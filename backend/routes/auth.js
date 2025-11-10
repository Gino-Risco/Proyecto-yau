// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body; // ✅ Ahora usa "email"

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
        // Buscar por email (no por DNI)
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ? AND estado = "activo"', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = rows[0];
        const isValid = await bcrypt.compare(password, usuario.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET || 'yau_municipalidad_secreto',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre_completo,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;