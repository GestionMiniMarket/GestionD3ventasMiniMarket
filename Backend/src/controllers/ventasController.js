const db = require('../config/db');

const registrarVenta = (req, res) => {
  const { caja_id, productos } = req.body;
  const usuario_id = req.usuario.id;

  if (!caja_id || !productos || productos.length === 0)
    return res.status(400).json({ mensaje: 'Caja y productos son requeridos' });

  let total = 0;
  productos.forEach(p => { total += p.precio_unitario * p.cantidad; });

  const sqlVenta = 'INSERT INTO ventas (usuario_id, caja_id, total) VALUES (?, ?, ?)';
  db.query(sqlVenta, [usuario_id, caja_id, total], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al registrar venta' });

    const venta_id = result.insertId;
    const detalles = productos.map(p => [
      venta_id, p.producto_id, p.cantidad,
      p.precio_unitario, p.precio_unitario * p.cantidad
    ]);

    db.query('INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ?', [detalles], (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error al registrar detalle' });

      const actualizaciones = productos.map(p =>
        new Promise((resolve, reject) => {
          db.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [p.cantidad, p.producto_id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        })
      );

      Promise.all(actualizaciones)
        .then(() => res.status(201).json({ mensaje: 'Venta registrada correctamente', venta_id, total }))
        .catch(() => res.status(500).json({ mensaje: 'Error al actualizar stock' }));
    });
  });
};

const listarVentas = (req, res) => {
  const { fecha } = req.query;
  let sql = `
    SELECT v.id, v.fecha, v.total, u.nombre AS vendedor
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
  `;
  const params = [];
  if (fecha) {
    sql += ' WHERE DATE(v.fecha) = ?';
    params.push(fecha);
  }
  sql += ' ORDER BY v.fecha DESC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

const detalleVenta = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT dv.cantidad, dv.precio_unitario, dv.subtotal, p.nombre AS producto
    FROM detalle_ventas dv
    JOIN productos p ON dv.producto_id = p.id
    WHERE dv.venta_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (results.length === 0)
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    res.json(results);
  });
};

module.exports = { registrarVenta, listarVentas, detalleVenta };