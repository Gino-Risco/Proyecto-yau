// backend/routes/usuarios.js
const express = require('express');
const { protegerRuta } = require('../middleware/auth');
const {
  listarUsuarios,
  crearUsuario,
  editarUsuario,
  cambiarEstado,
  reiniciarPassword
} = require('../controllers/usuariosController');

const router = express.Router();

// Solo administradores pueden gestionar usuarios
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
  next();
};

router.get('/', protegerRuta, soloAdmin, listarUsuarios);
router.post('/', protegerRuta, soloAdmin, crearUsuario);
router.put('/:id', protegerRuta, soloAdmin, editarUsuario);
router.patch('/:id/estado', protegerRuta, soloAdmin, cambiarEstado);
router.patch('/:id/password', protegerRuta, soloAdmin, reiniciarPassword);

module.exports = router;