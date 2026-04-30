const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro
const registrar = (req, res) => {
  const { nombre, email, password, rol_id } = req.body;

  if (!nombre || !email || !password || !rol_id)
    return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ mensaje: 'Formato de correo inválido' });

  const hash = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)';

  db.query(sql, [nombre, email, hash, rol_id], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY')
        return res.status(400).json({ mensaje: 'El correo ya está registrado' });
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  });
};
//login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });

  const sql = 'SELECT u.*, r.nombre AS rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (results.length === 0)
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const usuario = results[0];
    const passwordValida = bcrypt.compareSync(password, usuario.password);
    if (!passwordValida)
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ mensaje: 'Login exitoso', token, rol: usuario.rol });
  });
};

// Logout 
const logout = (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};

module.exports = { registrar, login, logout };