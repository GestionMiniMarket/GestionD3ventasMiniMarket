const db = require('../config/db');

// Ver inventario (todos los productos con su stock)
const listarInventario = (req, res) => {
  const sql = `
    SELECT p.id, p.nombre, p.precio, p.stock, p.stock_minimo,
           p.categoria_id, c.nombre AS categoria
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.activo = 1
    ORDER BY p.nombre ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

// Agregar stock a un producto
const agregarStock = (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  if (!cantidad || cantidad <= 0)
    return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a 0' });

  const sql = 'UPDATE productos SET stock = stock + ? WHERE id = ? AND activo = 1';
  db.query(sql, [cantidad, id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Stock actualizado correctamente' });
  });
};

// Ajustar stock manualmente
const ajustarStock = (req, res) => {
  const { id } = req.params;
  const { stock, stock_minimo } = req.body;

  if (stock === undefined)
    return res.status(400).json({ mensaje: 'El stock es requerido' });

  const sql = 'UPDATE productos SET stock = ?, stock_minimo = ? WHERE id = ? AND activo = 1';
  db.query(sql, [stock, stock_minimo || 5, id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Stock ajustado correctamente' });
  });
};

// Productos con stock bajo
const stockBajo = (req, res) => {
  const sql = 'SELECT * FROM productos WHERE stock <= stock_minimo AND activo = 1';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

module.exports = { listarInventario, agregarStock, ajustarStock, stockBajo };