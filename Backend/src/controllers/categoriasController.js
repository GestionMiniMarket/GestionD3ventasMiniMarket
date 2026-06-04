const db = require('../config/db');

// Listar categorías
const listarCategorias = (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

// Crear categoría
const crearCategoria = (req, res) => {
  const { nombre } = req.body;
  if (!nombre)
    return res.status(400).json({ mensaje: 'El nombre es requerido' });

  db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.status(201).json({ mensaje: 'Categoría creada correctamente', id: result.insertId });
  });
};

// Editar categoría
const editarCategoria = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre)
    return res.status(400).json({ mensaje: 'El nombre es requerido' });

  db.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría actualizada correctamente' });
  });
};

// Eliminar categoría
const eliminarCategoria = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM categorias WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  });
};

module.exports = { listarCategorias, crearCategoria, editarCategoria, eliminarCategoria };