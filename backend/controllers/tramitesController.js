// controllers/tramitesController.js
const db = require('../config/db');
const axios = require('axios');
const { createWorker } = require('tesseract.js');
const fs = require('fs').promises;

// Inicializar Tesseract (solo una vez)
let tesseractWorker;

async function getTesseractWorker() {
  if (!tesseractWorker) {
    tesseractWorker = await createWorker('spa'); // Español
  }
  return tesseractWorker;
}

// Buscar o crear ciudadano por DNI
async function obtenerOcrearCiudadano(dni, nombre = null, email = null, telefono = null) {
  const [rows] = await db.execute('SELECT id FROM ciudadanos WHERE dni = ?', [dni]);
  if (rows.length > 0) {
    return rows[0].id;
  }

  // Si no existe, lo creamos (nombre/email pueden venir del formulario más adelante)
  const [result] = await db.execute(
    'INSERT INTO ciudadanos (dni, nombre_completo, email, telefono) VALUES (?, ?, ?, ?)',
    [dni, nombre || 'Ciudadano no registrado', email || null, telefono || null]
  );
  return result.insertId;
}

// Obtener ID del tipo de trámite por nombre (desde tu tabla tipos_tramite)
async function obtenerTipoTramiteId(nombreTipo) {
  const [rows] = await db.execute(
    'SELECT id FROM tipos_tramite WHERE nombre = ?',
    [nombreTipo]
  );
  if (rows.length === 0) {
    throw new Error(`Tipo de trámite no reconocido: ${nombreTipo}`);
  }
  return rows[0].id;
}

exports.crearTramite = async (req, res) => {
  try {
    const archivo = req.file;
    const { dni } = req.body; // El DNI lo envía el frontend en el formulario

    if (!archivo) {
      return res.status(400).json({ error: 'Documento es obligatorio' });
    }
    if (!dni || dni.length !== 8) {
      return res.status(400).json({ error: 'DNI válido (8 dígitos) es obligatorio' });
    }

    // 1. EXTRAER TEXTO CON OCR REAL
    console.log('🔍 Extrayendo texto con Tesseract OCR...');
    const worker = await getTesseractWorker();
    const { data: { text } } = await worker.recognize(archivo.path);
    const textoOCR = text.trim();
    console.log('📄 Texto extraído:', textoOCR.substring(0, 100) + '...');

    if (!textoOCR || textoOCR.length < 10) {
      return res.status(400).json({ error: 'No se pudo extraer texto del documento' });
    }

    // 2. ENVIAR A API DE ML
    console.log('🧠 Enviando a modelo de ML...');
    const mlResponse = await axios.post('http://127.0.0.1:5000/predecir', {
      texto: textoOCR
    }, { timeout: 10000 });

    const { tipo_tramite, prioridad } = mlResponse.data;

    // 3. OBTENER IDs REALES DE LA BASE DE DATOS
    const ciudadano_id = await obtenerOcrearCiudadano(dni);
    const tipo_tramite_id = await obtenerTipoTramiteId(tipo_tramite);

    // 4. GUARDAR TRÁMITE EN BD
    const [result] = await db.execute(
      `INSERT INTO tramites 
       (ciudadano_id, tipo_tramite_id, archivo_original, contenido_texto, prioridad, estado)
       VALUES (?, ?, ?, ?, ?, 'recibido')`,
      [ciudadano_id, tipo_tramite_id, archivo.filename, textoOCR, prioridad]
    );

    // 5. NOTIFICAR (aquí iría Nodemailer en producción)
    console.log(`✅ Trámite registrado con ID: ${result.insertId}`);
    console.log(`📧 Notificación simulada: Su trámite de "${tipo_tramite}" ha sido recibido (prioridad: ${prioridad})`);

    // Responder al frontend
    res.status(201).json({
      id: result.insertId,
      dni,
      tipo_tramite,
      prioridad,
      estado: 'recibido',
      resumen: textoOCR.substring(0, 200) + '...'
    });

  } catch (error) {
    console.error('❌ Error al procesar trámite:', error.message);
    res.status(500).json({ error: 'Error al procesar el documento' });
  }
};

exports.obtenerTramitesPorDNI = async (req, res) => {
  const { dni } = req.params;
  if (!dni || dni.length !== 8) {
    return res.status(400).json({ error: 'DNI válido requerido' });
  }

  try {
    const [rows] = await db.execute(`
      SELECT t.id, tt.nombre AS tipo_tramite, t.prioridad, t.estado, t.fecha_ingreso
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

// controllers/tramitesController.js
exports.actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['recibido', 'en_proceso', 'resuelto', 'rechazado'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    await db.execute('UPDATE tramites SET estado = ?, fecha_actualizacion = NOW() WHERE id = ?', [estado, id]);
    // Opcional: enviar notificación por email
    // ... veremos después
    res.json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};