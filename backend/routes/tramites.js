const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload');
const { crearTramite, obtenerTramitesPorDNI, actualizarEstado } = require('../controllers/tramitesController');

// Ciudadano: enviar trámite
router.post('/', upload.single('documento'), crearTramite);

// Ciudadano: consultar por DNI
router.get('/dni/:dni', obtenerTramitesPorDNI);

// Administrativo: listar todos los trámites
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        t.id, 
        c.dni, 
        tt.nombre AS tipo_tramite, 
        t.prioridad, 
        t.estado, 
        t.fecha_ingreso
      FROM tramites t
      JOIN ciudadanos c ON t.ciudadano_id = c.id
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      ORDER BY 
        CASE t.prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
        t.fecha_ingreso ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error en GET /api/tramites:', error.message);
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
        t.fecha_actualizacion,
        t.archivo_original,
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
