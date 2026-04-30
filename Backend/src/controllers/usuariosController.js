const db = require("../config/db");
const bcrypt = require("bcryptjs");
const dbPromise = db.promise();

// GET /api/usuarios
const getUsuarios = async (req, res) => {
  try {
    const [rows] = await dbPromise.query(
      `SELECT u.id, u.nombre, u.email, u.rol_id, u.creado_en, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.activo = 1
       ORDER BY u.creado_en DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// GET /api/usuarios/:id
const getUsuarioById = async (req, res) => {
  try {
    const [rows] = await dbPromise.query(
      `SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ? AND u.activo = 1`,
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// POST /api/usuarios — crear
const createUsuario = async (req, res) => {
  const { nombre, email, password, rol_id } = req.body;

  if (!nombre || !email || !password || !rol_id)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    const [existe] = await dbPromise.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existe.length > 0)
      return res.status(409).json({ message: "El correo ya está registrado" });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await dbPromise.query(
      "INSERT INTO usuarios (nombre, email, password, rol_id, activo) VALUES (?, ?, ?, ?,1)",
      [nombre, email, hash, rol_id]
    );
    res.status(201).json({ message: "Usuario creado", id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// PUT /api/usuarios/:id — editar 
const updateUsuario = async (req, res) => {
  const { nombre, email, rol_id } = req.body;

  if (!nombre || !email || !rol_id)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    const [result] = await dbPromise.query(
      "UPDATE usuarios SET nombre = ?, email = ?, rol_id = ? WHERE id = ? AND activo = 1",
      [nombre, email, rol_id, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// DELETE /api/usuarios/:id
const deleteUsuario = async (req, res) => {
  try {
    const [result] = await dbPromise.query(
      "UPDATE usuarios SET activo = 0 WHERE id = ? AND activo = 1",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar usuario" });
  }
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };