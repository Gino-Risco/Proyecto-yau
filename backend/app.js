const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Carpeta uploads
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
app.use('/uploads', express.static('uploads'));

// ✅ Rutas públicas PRIMERO
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // ← Login debe ir primero

// ✅ Rutas protegidas después
const tramitesRoutes = require('./routes/tramites');
const dashboardRoutes = require('./routes/dashboard');
const reportesRoutes = require('./routes/reportes');
const usuariosRoutes = require('./routes/usuarios');

app.use('/api', dashboardRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/tramites', tramitesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send(`
    <h1>Municipalidad Provincial de Yau</h1>
    <p>Sistema Automatizado de Gestión de Trámites</p>
    <p>Backend corriendo en puerto ${PORT}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  console.log(`🧠 API de ML esperando en http://localhost:5000`);
});