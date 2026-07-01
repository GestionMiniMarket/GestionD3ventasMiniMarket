const db = require('../config/db');

const listarProductos = (req, res) => {
  const sql = `
    SELECT p.id, p.nombre, p.descripcion, p.precio,
           p.stock, p.stock_minimo, p.activo,
           p.categoria_id, c.nombre AS categoria
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.activo DESC, p.nombre ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    res.json(results);
  });
};

const crearProducto = (req, res) => {
  const { nombre, precio, categoria_id, descripcion } = req.body;

  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({ mensaje: 'Nombre, precio y categoría son requeridos' });
  }

  const sql = `
    INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo, categoria_id, activo)
    VALUES (?, ?, ?, 0, 5, ?, 1)
  `;

  db.query(sql, [nombre, descripcion || null, precio, categoria_id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.status(201).json({ mensaje: 'Producto creado correctamente', id: result.insertId });
  });
};

const editarProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria_id, descripcion } = req.body;

  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({ mensaje: 'Nombre, precio y categoría son requeridos' });
  }

  const sql = `
    UPDATE productos
    SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?
    WHERE id = ? AND activo = 1
  `;

  db.query(sql, [nombre, descripcion || null, precio, categoria_id, id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
};

const eliminarProducto = (req, res) => {
  const { id } = req.params;

  db.query('UPDATE productos SET activo = 0 WHERE id = ? AND activo = 1', [id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto desactivado correctamente' });
  });
};

const restaurarProducto = (req, res) => {
  const { id } = req.params;

  db.query('UPDATE productos SET activo = 1 WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto restaurado correctamente' });
  });
};

const stockBajo = (req, res) => {
  const sql = `
    SELECT id, nombre, descripcion, precio, stock, stock_minimo, categoria_id
    FROM productos
    WHERE stock <= stock_minimo AND activo = 1
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

module.exports = {
  listarProductos,
  crearProducto,
  editarProducto,
  eliminarProducto,
  stockBajo,
  restaurarProducto,
};