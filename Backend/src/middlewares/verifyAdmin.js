const verifyAdmin = (req, res, next) => {
    if (req.usuario?.rol?.toLowerCase() !== 'administrador') {
      return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
    }
    next();
  };
  
  module.exports = verifyAdmin;