// backend/controllers/reportesController.js
const db = require('../config/db');

// 1. Reporte: Productividad y Cumplimiento
exports.obtenerReporteProductividad = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  const desde = fechaInicio || '2020-01-01';
  const hasta = fechaFin || '2030-12-31';

  try {
    const [resumen] = await db.execute(`
      SELECT 
        COUNT(*) AS recibidos,
        SUM(CASE WHEN estado = 'resuelto' THEN 1 ELSE 0 END) AS resueltos
      FROM tramites 
      WHERE DATE(fecha_ingreso) BETWEEN ? AND ?
    `, [desde, hasta]);

    const [promedio] = await db.execute(`
      SELECT AVG(DATEDIFF(fecha_actualizacion, fecha_ingreso)) AS promedio
      FROM tramites 
      WHERE estado = 'resuelto' AND DATE(fecha_ingreso) BETWEEN ? AND ?
    `, [desde, hasta]);

    const [vencidos] = await db.execute(`
      SELECT COUNT(*) AS vencidos
      FROM tramites t
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE t.estado != 'resuelto'
        AND DATE(t.fecha_ingreso) BETWEEN ? AND ?
        AND DATEDIFF(CURDATE(), t.fecha_ingreso) > tt.tiempo_max_dias
    `, [desde, hasta]);

    res.json({
      recibidos: resumen[0].recibidos,
      resueltos: resumen[0].resueltos,
      diasPromedio: parseFloat(promedio[0].promedio) || 0,
      vencidos: vencidos[0].vencidos
    });
  } catch (error) {
    console.error('Error en reporte de productividad:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};

// 2. Reporte: Por Tipo de Trámite
exports.obtenerReportePorTipo = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  const desde = fechaInicio || '2020-01-01';
  const hasta = fechaFin || '2030-12-31';

  try {
    const [porTipo] = await db.execute(`
      SELECT tt.nombre AS tipo, COUNT(*) AS cantidad
      FROM tramites t
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE DATE(t.fecha_ingreso) BETWEEN ? AND ?
      GROUP BY tt.id
      ORDER BY cantidad DESC
    `, [desde, hasta]);

    const [rechazos] = await db.execute(`
      SELECT tt.nombre AS tipo, COUNT(*) AS rechazados
      FROM tramites t
      JOIN tipos_tramite tt ON t.tipo_tramite_id = tt.id
      WHERE t.estado = 'rechazado' AND DATE(t.fecha_ingreso) BETWEEN ? AND ?
      GROUP BY tt.id
    `, [desde, hasta]);

    const rechazosMap = {};
    rechazos.forEach(r => rechazosMap[r.tipo] = r.rechazados);

    const resultado = porTipo.map(p => ({
      tipo: p.tipo,
      cantidad: p.cantidad,
      rechazados: rechazosMap[p.tipo] || 0,
      porcentajeRechazo: p.cantidad > 0 ? ((rechazosMap[p.tipo] || 0) / p.cantidad * 100).toFixed(1) : 0
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Error en reporte por tipo:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};

// 3. Reporte: Trámites Críticos
exports.obtenerReporteCriticos = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  const desde = fechaInicio || '2020-01-01';
  const hasta = fechaFin || '2030-12-31';

  try {
    const [criticos] = await db.execute(`
      SELECT 
        COUNT(*) AS totalCriticos,
        SUM(CASE WHEN DATEDIFF(CURDATE(), fecha_ingreso) <= 2 THEN 1 ELSE 0 END) AS resueltosRapido,
        SUM(CASE WHEN estado != 'resuelto' AND DATEDIFF(CURDATE(), fecha_ingreso) > 3 THEN 1 ELSE 0 END) AS pendientesCriticos
      FROM tramites
      WHERE prioridad = 'alta' AND DATE(fecha_ingreso) BETWEEN ? AND ?
    `, [desde, hasta]);

    res.json({
      totalCriticos: criticos[0].totalCriticos,
      resueltosEn48h: criticos[0].resueltosRapido,
      pendientesCriticos: criticos[0].pendientesCriticos
    });
  } catch (error) {
    console.error('Error en reporte críticos:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};

// 4. Reporte: Indicadores de Calidad
exports.obtenerReporteCalidad = async (req, res) => {
  try {
    // Trámites reingresados: mismo DNI, mismo tipo, en menos de 7 días
    const [reingresos] = await db.execute(`
      SELECT COUNT(*) AS reingresados
      FROM (
        SELECT t1.ciudadano_id, t1.tipo_tramite_id, t1.fecha_ingreso
        FROM tramites t1
        JOIN tramites t2 ON t1.ciudadano_id = t2.ciudadano_id 
          AND t1.tipo_tramite_id = t2.tipo_tramite_id
          AND t2.id > t1.id
          AND DATEDIFF(t2.fecha_ingreso, t1.fecha_ingreso) <= 7
      ) AS reingresos
    `);

    // Observaciones negativas frecuentes
    const [observaciones] = await db.execute(`
      SELECT 
        CASE 
          WHEN observaciones LIKE '%DNI%' THEN 'Falta DNI'
          WHEN observaciones LIKE '%documento%' THEN 'Documento incompleto'
          WHEN observaciones LIKE '%ilegible%' THEN 'Documento ilegible'
          ELSE 'Otros'
        END AS motivo,
        COUNT(*) AS cantidad
      FROM tramites
      WHERE observaciones IS NOT NULL AND estado = 'rechazado'
      GROUP BY motivo
      ORDER BY cantidad DESC
      LIMIT 3
    `);

    // % de trámites con observaciones
    const [conObs] = await db.execute(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN observaciones IS NOT NULL THEN 1 ELSE 0 END) AS conObservaciones
      FROM tramites
    `);

    res.json({
      reingresados: reingresos[0].reingresados,
      observacionesNegativas: observaciones,
      porcentajeConObservaciones: conObs[0].total > 0 
        ? (conObs[0].conObservaciones / conObs[0].total * 100).toFixed(1) 
        : 0
    });
  } catch (error) {
    console.error('Error en reporte de calidad:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};