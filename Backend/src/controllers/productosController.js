const db = require('../config/db');

// Listar productos
const listarProductos = (req, res) => {
  const sql = `
    SELECT p.id, p.nombre, p.precio, p.stock, p.stock_minimo,
           p.categoria_id, c.nombre AS categoria
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.activo = 1
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

// Crear producto
const crearProducto = (req, res) => {
  const { nombre, precio, categoria_id, descripcion } = req.body;

  if (!nombre || !precio || !categoria_id)
    return res.status(400).json({ mensaje: 'Nombre, precio y categoría son requeridos' });

  const sql = 'INSERT INTO productos (nombre, precio, stock, stock_minimo, categoria_id, descripcion) VALUES (?, ?, 0, 5, ?, ?)';
  db.query(sql, [nombre, precio, categoria_id, descripcion || null], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.status(201).json({ mensaje: 'Producto creado correctamente', id: result.insertId });
  });
};

// Editar producto
const editarProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, stock_minimo, categoria_id } = req.body;

  if (!nombre || !precio || !categoria_id)
    return res.status(400).json({ mensaje: 'Nombre, precio y categoría son requeridos' });

  const sql = 'UPDATE productos SET nombre = ?, precio = ?, stock = ?, stock_minimo = ?, categoria_id = ? WHERE id = ?';
  db.query(sql, [nombre, precio, stock, stock_minimo, categoria_id, id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
};

// Eliminar producto
const eliminarProducto = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE productos SET activo = 0 WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto desactivado correctamente' });
  });
};

const restaurarProducto = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE productos SET activo = 1 WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto restaurado correctamente' });
  });
};

// Productos con stock bajo
const stockBajo = (req, res) => {
  const sql = 'SELECT * FROM productos WHERE stock <= stock_minimo';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

module.exports = { listarProductos, crearProducto, editarProducto, eliminarProducto, stockBajo, restaurarProducto  };