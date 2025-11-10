const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload');
const { crearTramite, obtenerTramitesPorDNI, actualizarEstado } = require('../controllers/tramitesController');

// Ciudadano: enviar trámite
router.post('/', upload.single('documento'), crearTramite);

// Ciudadano: consultar por DNI
// GET /api/tramites/dni/:dni → devuelve los trámites de un ciudadano por DNI
router.get('/dni/:dni', async (req, res) => {
  const { dni } = req.params;
  if (!dni || dni.length !== 8) {
    return res.status(400).json({ error: 'DNI válido requerido' });
  }

  try {
    const [rows] = await db.execute(`
      SELECT t.id, tt.nombre AS tipo_tramite, t.prioridad, t.estado, t.fecha_ingreso, t.observaciones
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
});

// Administrativo: listar todos los trámites
router.get('/', async (req, res) => {
  try {
    const {
      q,
      estado,
      prioridad,
      tipo_tramite,
      fecha_desde,
      fecha_hasta,
      page = 1,
      limit = 25
    } = req.query;

    // Validar y parsear paginación
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 25));
    const offset = (pageNum - 1) * limitNum;

    // Base de la consulta
    let query = `
      SELECT 
        t.id, 
        c.dni, 
        c.nombre_completo AS ciudadano_nombre,
        tt.nombre AS tipo_tramite, 
        t.prioridad, 
        t.estado, 
        t.fecha_ingreso,
        t.observaciones 
      FROM tramites t
      JOIN ciudadanos c ON t.ciudadano_id = c.id
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM tramites t
      JOIN ciudadanos c ON t.ciudadano_id = c.id
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE 1=1
    `;

    const paramsQuery = [];
    const paramsCount = [];

    // Filtros
    if (q) {
      query += ` AND (c.nombre_completo LIKE ? OR c.dni LIKE ?)`;
      countQuery += ` AND (c.nombre_completo LIKE ? OR c.dni LIKE ?)`;
      paramsQuery.push(`%${q}%`, `%${q}%`);
      paramsCount.push(`%${q}%`, `%${q}%`);
    }

    if (estado) {
      query += ` AND t.estado = ?`;
      countQuery += ` AND t.estado = ?`;
      paramsQuery.push(estado);
      paramsCount.push(estado);
    }

    if (prioridad) {
      query += ` AND t.prioridad = ?`;
      countQuery += ` AND t.prioridad = ?`;
      paramsQuery.push(prioridad);
      paramsCount.push(prioridad);
    }

    if (tipo_tramite) {
      query += ` AND tt.nombre = ?`;
      countQuery += ` AND tt.nombre = ?`;
      paramsQuery.push(tipo_tramite);
      paramsCount.push(tipo_tramite);
    }

    if (fecha_desde) {
      query += ` AND t.fecha_ingreso >= ?`;
      countQuery += ` AND t.fecha_ingreso >= ?`;
      paramsQuery.push(fecha_desde);
      paramsCount.push(fecha_desde);
    }

    if (fecha_hasta) {
      const fechaFin = new Date(fecha_hasta);
      if (!isNaN(fechaFin)) {
        fechaFin.setHours(23, 59, 59, 999);
        const fechaStr = fechaFin.toISOString().slice(0, 19).replace('T', ' ');
        query += ` AND t.fecha_ingreso <= ?`;
        countQuery += ` AND t.fecha_ingreso <= ?`;
        paramsQuery.push(fechaStr);
        paramsCount.push(fechaStr);
      }
    }

    // Orden y paginación
    query += `
      ORDER BY 
        CASE t.prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
        t.fecha_ingreso ASC
      LIMIT ? OFFSET ?
    `;
    paramsQuery.push(limitNum, offset);

    // Ejecutar consultas
    const [tramites] = await db.execute(query, paramsQuery);
    const [[countResult]] = await db.execute(countQuery, paramsCount);

    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      data: tramites,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('❌ Error en GET /api/tramites:', error);
    res.status(500).json({ error: 'Error al obtener trámites' });
  }
});


// Administrativo o general: obtener trámite por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(`
 SELECT 
        t.id, 
        c.dni, 
        tt.nombre AS tipo_tramite, 
        t.prioridad, 
        t.estado, 
        t.fecha_ingreso, 
        t.archivo_original, 
        t.observaciones,
        t.contenido_texto
      FROM tramites t
      JOIN ciudadanos c ON t.ciudadano_id = c.id
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE t.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Trámite no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error en GET /api/tramites/:id:', error);
    res.status(500).json({ error: 'Error al obtener el trámite' });
  }
});

// Administrativo: actualizar estado
router.put('/:id', actualizarEstado);

module.exports = router;
