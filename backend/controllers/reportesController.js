// backend/controllers/reportesController.js
const db = require('../config/db');

exports.obtenerReporteProductividad = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  const desde = fechaInicio || '2020-01-01';
  const hasta = fechaFin || '2030-12-31';

  try {
    // Total recibidos y resueltos
    const [resumen] = await db.execute(`
      SELECT 
        COUNT(*) AS total_recibidos,
        SUM(CASE WHEN estado = 'resuelto' THEN 1 ELSE 0 END) AS total_resueltos
      FROM tramites 
      WHERE DATE(fecha_ingreso) BETWEEN ? AND ?
    `, [desde, hasta]);

    // Tiempo promedio de resolución
    const [tiempo] = await db.execute(`
      SELECT AVG(DATEDIFF(fecha_actualizacion, fecha_ingreso)) AS promedio_dias
      FROM tramites 
      WHERE estado = 'resuelto' 
        AND DATE(fecha_ingreso) BETWEEN ? AND ?
    `, [desde, hasta]);

    // Trámites vencidos
    const [vencidos] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM tramites t
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE t.estado != 'resuelto'
        AND DATE(t.fecha_ingreso) BETWEEN ? AND ?
        AND DATEDIFF(CURDATE(), t.fecha_ingreso) > tt.tiempo_max_dias
    `, [desde, hasta]);

    res.json({
      recibidos: resumen[0].total_recibidos,
      resueltos: resumen[0].total_resueltos,
      promedioDias: parseFloat(tiempo[0].promedio_dias) || 0,
      vencidos: vencidos[0].total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};

// Otras funciones para otros reportes...