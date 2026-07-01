const db = require('../config/db');

const registrarVenta = (req, res) => {
  const { caja_id, productos, metodo_pago } = req.body;
  const usuario_id = req.usuario.id;

  if (!metodo_pago || !['efectivo', 'tarjeta'].includes(metodo_pago)) {
    return res.status(400).json({
      mensaje: 'Método de pago inválido. Use efectivo o tarjeta',
    });
  }

  if (!caja_id || !productos || productos.length === 0) {
    return res.status(400).json({
      mensaje: 'Caja y productos son requeridos',
    });
  }

  const sqlCaja = `
    SELECT id
    FROM cajas
    WHERE id = ? AND estado = 'abierta'
  `;

  db.query(sqlCaja, [caja_id], (err, cajaResults) => {
    if (err) return res.status(500).json({ mensaje: 'Error al validar caja' });

    if (cajaResults.length === 0) {
      return res.status(400).json({
        mensaje: 'La caja no existe o no está abierta',
      });
    }

    const ids = productos.map((p) => p.producto_id);

    const sqlProductos = `
      SELECT id, nombre, precio, stock, activo
      FROM productos
      WHERE id IN (?)
    `;

    db.query(sqlProductos, [ids], (err, productosDB) => {
      if (err) return res.status(500).json({ mensaje: 'Error al validar productos' });

      for (const item of productos) {
        const productoDB = productosDB.find((p) => p.id === item.producto_id);

        if (!productoDB) {
          return res.status(404).json({
            mensaje: `Producto no encontrado`,
          });
        }

        if (Number(productoDB.activo) !== 1) {
          return res.status(400).json({
            mensaje: `El producto "${productoDB.nombre}" está desactivado`,
          });
        }

        if (Number(productoDB.stock) < Number(item.cantidad)) {
          return res.status(400).json({
            mensaje: `Stock insuficiente para "${productoDB.nombre}". Stock disponible: ${productoDB.stock}`,
          });
        }
      }

      let total = 0;

      productos.forEach((p) => {
        total += Number(p.precio_unitario) * Number(p.cantidad);
      });

      const sqlVenta = `
        INSERT INTO ventas (usuario_id, caja_id, total, metodo_pago)
        VALUES (?, ?, ?, ?)
      `;

      db.query(sqlVenta, [usuario_id, caja_id, total, metodo_pago], (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error al registrar venta' });

        const venta_id = result.insertId;

        const detalles = productos.map((p) => [
          venta_id,
          p.producto_id,
          p.cantidad,
          p.precio_unitario,
          Number(p.precio_unitario) * Number(p.cantidad),
        ]);

        const sqlDetalle = `
          INSERT INTO detalle_ventas
          (venta_id, producto_id, cantidad, precio_unitario, subtotal)
          VALUES ?
        `;

        db.query(sqlDetalle, [detalles], (err) => {
          if (err) return res.status(500).json({ mensaje: 'Error al registrar detalle' });

          const actualizaciones = productos.map(
            (p) =>
              new Promise((resolve, reject) => {
                const sqlUpdate = `
                  UPDATE productos
                  SET stock = stock - ?
                  WHERE id = ? AND activo = 1 AND stock >= ?
                `;

                db.query(sqlUpdate, [p.cantidad, p.producto_id, p.cantidad], (err, result) => {
                  if (err) return reject(err);

                  if (result.affectedRows === 0) {
                    return reject(new Error('Stock insuficiente o producto desactivado'));
                  }

                  resolve();
                });
              })
          );

          Promise.all(actualizaciones)
            .then(() =>
              res.status(201).json({
                mensaje: 'Venta registrada correctamente',
                venta_id,
                total,
              })
            )
            .catch(() =>
              res.status(500).json({
                mensaje: 'Error al actualizar stock',
              })
            );
        });
      });
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