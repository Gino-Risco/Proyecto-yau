const express = require('express');
const router = express.Router();
const {
    obtenerReporteProductividad,
    obtenerReportePorTipo,
    obtenerReporteCriticos,
    obtenerReporteCalidad
} = require('../controllers/reportesController');

router.get('/productividad', obtenerReporteProductividad);
router.get('/tipo', obtenerReportePorTipo);
router.get('/criticos', obtenerReporteCriticos);
router.get('/calidad', obtenerReporteCalidad);

module.exports = router;