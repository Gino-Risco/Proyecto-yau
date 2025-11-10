const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yau_municipalidad_secreto');
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const soloFuncionarios = (req, res, next) => {
  if (req.usuario.rol !== 'funcionario' && req.usuario.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado. Solo funcionarios.' });
  }
  next();
};

module.exports = { protegerRuta, soloFuncionarios };