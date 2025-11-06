// backend/app.js
const express = require('express');
const cors = require('cors');
const tramitesRoutes = require('./routes/tramites');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Crear carpeta uploads si no existe
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/tramites', tramitesRoutes);

// Ruta de bienvenida
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