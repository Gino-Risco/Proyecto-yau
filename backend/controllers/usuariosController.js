// backend/controllers/usuariosController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

// 1. Listar usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, dni, nombre_completo, email, rol, estado, fecha_registro 
      FROM usuarios 
      ORDER BY fecha_registro DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// 2. Crear usuario
exports.crearUsuario = async (req, res) => {
  const { dni, nombre, email, password, rol } = req.body;
  if (!dni || !nombre || !email || !password || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const [exists] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (exists.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO usuarios (dni, nombre_completo, email, password, rol) VALUES (?, ?, ?, ?, ?)',
      [dni, nombre, email, hashedPassword, rol]
    );

    res.status(201).json({ message: 'Usuario creado', id: result.insertId });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// 3. Editar usuario
exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { dni, nombre, email, rol } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE usuarios SET dni = ?, nombre_completo = ?, email = ?, rol = ? WHERE id = ?',
      [dni, nombre, email, rol, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// 4. Activar/Inactivar
exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['activo', 'inactivo'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const [result] = await db.execute('UPDATE usuarios SET estado = ? WHERE id = ?', [estado, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: `Usuario ${estado}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};

// 5. Reiniciar contraseña
exports.reiniciarPassword = async (req, res) => {
  const { id } = req.params;
  const passwordTemporal = 'Yau2025!'; // Contraseña temporal estándar

  try {
    const hashed = await bcrypt.hash(passwordTemporal, 10);
    const [result] = await db.execute('UPDATE usuarios SET password = ? WHERE id = ?', [hashed, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Contraseña reiniciada', passwordTemporal });
  } catch (error) {
    console.error('Error al reiniciar contraseña:', error);
    res.status(500).json({ error: 'Error al reiniciar contraseña' });
  }
};