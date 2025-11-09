// backend/routes/reportes.js
const express = require('express');
const router = express.Router();
const { obtenerReporteProductividad } = require('../controllers/reportesController');

router.get('/productividad', obtenerReporteProductividad);

module.exports = router;