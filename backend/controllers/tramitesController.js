// backend/controllers/tramitesController.js
const db = require('../config/db');
const axios = require('axios');
const { createWorker } = require('tesseract.js');
const nodemailer = require('nodemailer');

let tesseractWorker;
async function getTesseractWorker() {
  if (!tesseractWorker) {
    tesseractWorker = await createWorker('spa');
  }
  return tesseractWorker;
}

async function obtenerOcrearCiudadano(dni, nombre = null, email = null, telefono = null) {
  const [rows] = await db.execute('SELECT id, nombre_completo, email, telefono FROM ciudadanos WHERE dni = ?', [dni]);
  if (rows.length > 0) {
    const ciudadano = rows[0];
    if (
      (nombre && ciudadano.nombre_completo === 'Ciudadano no registrado') ||
      (!ciudadano.email && email) ||
      (!ciudadano.telefono && telefono)
    ) {
      await db.execute(
        `UPDATE ciudadanos SET nombre_completo = ?, email = ?, telefono = ? WHERE id = ?`,
        [nombre || ciudadano.nombre_completo, email || ciudadano.email, telefono || ciudadano.telefono, ciudadano.id]
      );
    }
    return ciudadano.id;
  }
  const [result] = await db.execute(
    'INSERT INTO ciudadanos (dni, nombre_completo, email, telefono) VALUES (?, ?, ?, ?)',
    [dni, nombre || 'Ciudadano no registrado', email || null, telefono || null]
  );
  return result.insertId;
}

async function obtenerTipoTramiteId(nombreTipo) {
  const [rows] = await db.execute('SELECT id FROM tipos_tramite WHERE nombre = ?', [nombreTipo]);
  if (rows.length === 0) {
    throw new Error(`Tipo de trámite no reconocido: ${nombreTipo}`);
  }
  return rows[0].id;
}

// ===== FUNCIÓN PARA ENVIAR NOTIFICACIÓN POR EMAIL =====
async function enviarNotificacionEmail(ciudadanoId, tramiteId, estado, observaciones = null, tipoTramite = null, prioridad = null) {
  try {
    const [ciudadanoRows] = await db.execute(
      'SELECT email, dni, nombre_completo FROM ciudadanos WHERE id = ?',
      [ciudadanoId]
    );

    if (!ciudadanoRows.length || !ciudadanoRows[0].email) return;

    const ciudadano = ciudadanoRows[0];
    const nombreCiudadano = ciudadano.nombre_completo || 'Estimado ciudadano';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let subject, body;

    if (estado === 'rechazado') {
      subject = `Trámite #${tramiteId} rechazado - Municipalidad de Yau`;
      body = `${nombreCiudadano},

Su trámite ha sido rechazado.

Observaciones: ${observaciones || 'No se proporcionaron observaciones adicionales.'}

Puede corregir los errores y volver a presentar su trámite en nuestro portal.

Gracias por usar nuestros servicios.
Municipalidad Provincial de Yau`;
    } else if (estado === 'resuelto') {
      subject = `Trámite #${tramiteId} resuelto - Municipalidad de Yau`;
      body = `${nombreCiudadano},

Su trámite ha sido resuelto.

Observaciones: ${observaciones || 'Trámite procesado correctamente.'}

Puede retirar su documento en las oficinas de la Municipalidad de Yau, de lunes a viernes de 8:00 a.m. a 4:00 p.m.

Gracias por usar nuestros servicios.
Municipalidad Provincial de Yau`;
    } else if (estado === 'recibido') {
      subject = `Trámite #${tramiteId} recibido - Municipalidad de Yau`;
      body = `${nombreCiudadano},

Gracias por presentar su trámite.

Tipo de trámite: ${tipoTramite || 'No especificado'}
Prioridad: ${prioridad || 'baja'}

Su solicitud ha sido registrada con éxito y está en cola para ser procesada. Puede consultar el estado en cualquier momento ingresando su DNI en nuestro portal.

Gracias por usar nuestros servicios.
Municipalidad Provincial de Yau`;
    } else {
      // en_proceso u otros
      subject = `Actualización de trámite #${tramiteId} - Municipalidad de Yau`;
      body = `${nombreCiudadano},

Su trámite ha sido actualizado a "${estado}".

${observaciones ? `Observaciones: ${observaciones}\n\n` : ''}Puede ver el detalle en nuestro portal: http://yau.gob.pe/tramite/${tramiteId}

Gracias por usar nuestros servicios.
Municipalidad Provincial de Yau`;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ciudadano.email,
      subject,
      text: body
    });

    console.log(`📧 Notificación enviada a ${ciudadano.email} para trámite #${tramiteId}`);
  } catch (error) {
    console.error('❌ Error al enviar notificación por email:', error.message);
  }
}

// ===== CREAR TRÁMITE =====
exports.crearTramite = async (req, res) => {
  try {
    const archivo = req.file;
    const { dni, nombre, email, telefono } = req.body;

    if (!archivo || !dni || dni.length !== 8) {
      return res.status(400).json({ error: 'Documento y DNI (8 dígitos) son obligatorios' });
    }

    // OCR
    const worker = await getTesseractWorker();
    const { data: { text } } = await worker.recognize(archivo.path);
    const textoOCR = text.trim();
    if (!textoOCR || textoOCR.length < 10) {
      return res.status(400).json({ error: 'No se pudo extraer texto del documento' });
    }

    // ML
    const mlResponse = await axios.post('http://127.0.0.1:5000/predecir', { texto: textoOCR });
    const { tipo_tramite, prioridad } = mlResponse.data;

    // Guardar
    const ciudadano_id = await obtenerOcrearCiudadano(dni, nombre, email, telefono);
    const tipo_tramite_id = await obtenerTipoTramiteId(tipo_tramite);
    const [result] = await db.execute(
      `INSERT INTO tramites (ciudadano_id, tipo_tramite_id, archivo_original, contenido_texto, prioridad, estado)
       VALUES (?, ?, ?, ?, ?, 'recibido')`,
      [ciudadano_id, tipo_tramite_id, archivo.filename, textoOCR, prioridad]
    );

    // ✅ ENVIAR NOTIFICACIÓN REAL
    await enviarNotificacionEmail(ciudadano_id, result.insertId, 'recibido', null, tipo_tramite, prioridad);

    res.status(201).json({
      id: result.insertId,
      dni,
      tipo_tramite,
      prioridad,
      estado: 'recibido'
    });

  } catch (error) {
    console.error('❌ Error al procesar trámite:', error.message);
    res.status(500).json({ error: 'Error al procesar el documento' });
  }
};

// ===== CONSULTAR POR DNI =====
exports.obtenerTramitesPorDNI = async (req, res) => {
  const { dni } = req.params;
  if (!dni || dni.length !== 8) {
    return res.status(400).json({ error: 'DNI válido requerido' });
  }

  try {
    const [rows] = await db.execute(`
      SELECT t.id, c.dni, c.nombre_completo, tt.nombre AS tipo_tramite, t.prioridad, t.estado, t.fecha_ingreso, t.observaciones
      FROM tramites t
      JOIN ciudadanos c ON t.ciudadano_id = c.id
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE c.dni = ?
      ORDER BY t.fecha_ingreso DESC
    `, [dni]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar trámites' });
  }
};

// ===== ACTUALIZAR ESTADO =====
exports.actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado, observaciones } = req.body;

  if (!['recibido', 'en_proceso', 'resuelto', 'rechazado'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const [tramiteActual] = await db.execute('SELECT ciudadano_id FROM tramites WHERE id = ?', [id]);
    if (!tramiteActual.length) return res.status(404).json({ error: 'Trámite no encontrado' });

    const ciudadanoId = tramiteActual[0].ciudadano_id;

    await db.execute(
      'UPDATE tramites SET estado = ?, observaciones = ?, fecha_actualizacion = NOW() WHERE id = ?',
      [estado, observaciones || null, id]
    );

    // ✅ ENVIAR NOTIFICACIÓN REAL
    await enviarNotificacionEmail(ciudadanoId, id, estado, observaciones);

    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar el trámite' });
  }
};