const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
  const { dni, password } = req.body;
  if (!dni || !password) {
    return res.status(400).json({ error: 'DNI y contraseña son obligatorios' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE dni = ? AND estado = "activo"', [dni]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];
    const isValid = await bcrypt.compare(password, usuario.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, dni: usuario.dni, rol: usuario.rol },
      process.env.JWT_SECRET || 'yau_municipalidad_secreto',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        dni: usuario.dni,
        nombre: usuario.nombre_completo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;