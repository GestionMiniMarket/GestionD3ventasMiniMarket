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

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });

  const sql = `
    SELECT u.*, r.nombre AS rol 
    FROM usuarios u 
    JOIN roles r ON u.rol_id = r.id 
    WHERE u.email = ?
  `;

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    
    // 1. Si el correo no existe en la BD o es un intento de SQL Injection
    if (results.length === 0)
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const usuario = results[0];

    // 2. Si el usuario existe, pero su cuenta fue desactivada
    if (usuario.activo !== 1)
      return res.status(401).json({ mensaje: 'Usuario inactivo. Contacte al administrador.' });

    // 3. Si existe y está activo, procedemos a comparar el hash bcrypt
    const passwordValida = bcrypt.compareSync(password, usuario.password);
    if (!passwordValida)
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    // 4. Si todo está bien, generamos el token
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