// backend/controllers/dashboardController.js
const db = require('../config/db');

exports.obtenerMetricas = async (req, res) => {
  try {
    // 1. Total de trámites
    const [totalRows] = await db.execute('SELECT COUNT(*) AS total FROM tramites');
    const total = totalRows[0].total;

    // 2. Trámites pendientes por prioridad
    const [pendientes] = await db.execute(`
      SELECT prioridad, COUNT(*) AS cantidad 
      FROM tramites 
      WHERE estado IN ('recibido', 'en_proceso')
      GROUP BY prioridad
    `);
    const pendientesMap = { alta: 0, media: 0, baja: 0 };
    pendientes.forEach(p => pendientesMap[p.prioridad] = p.cantidad);

    // 3. Trámites resueltos hoy
    const [resueltosHoy] = await db.execute(`
      SELECT COUNT(*) AS total 
      FROM tramites 
      WHERE DATE(fecha_actualizacion) = CURDATE() AND estado = 'resuelto'
    `);
    const resueltosHoyCount = resueltosHoy[0].total;

    // 4. Distribución por tipo
    const [porTipo] = await db.execute(`
      SELECT tt.nombre AS tipo, COUNT(*) AS cantidad
      FROM tramites t
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      GROUP BY tt.id
      ORDER BY cantidad DESC
      LIMIT 5
    `);

    // 5. Últimos trámites actualizados
    const [ultimos] = await db.execute(`
      SELECT t.id, c.nombre_completo AS ciudadano, tt.nombre AS tipo, t.estado, t.fecha_actualizacion
      FROM tramites t
      JOIN ciudadanos c ON t.ciudadano_id = c.id
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      ORDER BY t.fecha_actualizacion DESC
      LIMIT 5
    `);

    res.json({
      total,
      pendientes: pendientesMap,
      resueltosHoy: resueltosHoyCount,
      porTipo,
      ultimos
    });
  } catch (error) {
    console.error('Error al obtener métricas:', error);
    res.status(500).json({ error: 'Error al cargar métricas' });
  }
};