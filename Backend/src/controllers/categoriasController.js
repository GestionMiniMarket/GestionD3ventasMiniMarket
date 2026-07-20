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
  if (!nombre || !nombre.trim())
    return res.status(400).json({ mensaje: 'El nombre es requerido' });

  const nombreLimpio = nombre.trim();

  db.query(
    'SELECT id FROM categorias WHERE LOWER(nombre) = LOWER(?)',
    [nombreLimpio],
    (err, existentes) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

      if (existentes.length > 0)
        return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });

      db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombreLimpio], (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
        res.status(201).json({ mensaje: 'Categoría creada correctamente', id: result.insertId });
      });
    }
  );
};

// Editar categoría
const editarCategoria = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre || !nombre.trim())
    return res.status(400).json({ mensaje: 'El nombre es requerido' });

  const nombreLimpio = nombre.trim();

  db.query(
    'SELECT id FROM categorias WHERE LOWER(nombre) = LOWER(?) AND id != ?',
    [nombreLimpio, id],
    (err, existentes) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

      if (existentes.length > 0)
        return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });

      db.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombreLimpio, id], (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
        if (result.affectedRows === 0)
          return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría actualizada correctamente' });
      });
    }
  );
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