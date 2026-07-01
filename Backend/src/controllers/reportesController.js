const db = require('../config/db');

// Ventas diarias
const ventasDiarias = (req, res) => {
  const { fecha } = req.query;
  const dia = fecha || new Date().toISOString().split('T')[0];

  const sql = `
    SELECT 
      COUNT(v.id) AS total_ventas,
      COALESCE(SUM(v.total), 0) AS ingresos_total,
      COALESCE(SUM(CASE WHEN v.metodo_pago = 'efectivo' THEN v.total ELSE 0 END), 0) AS ingresos_efectivo,
      COALESCE(SUM(CASE WHEN v.metodo_pago = 'tarjeta' THEN v.total ELSE 0 END), 0) AS ingresos_tarjeta
    FROM ventas v
    WHERE DATE(v.fecha) = ?
  `;
  db.query(sql, [dia], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json({ fecha: dia, ...results[0] });
  });
};

// Ventas semanales
const ventasSemanales = (req, res) => {
  const sql = `
    SELECT 
      DATE(v.fecha) AS dia,
      COUNT(v.id) AS total_ventas,
      COALESCE(SUM(v.total), 0) AS ingresos_total
    FROM ventas v
    WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(v.fecha)
    ORDER BY dia ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

// Ventas mensuales
const ventasMensuales = (req, res) => {
  const { mes, anio } = req.query;
  const mesActual = mes || new Date().getMonth() + 1;
  const anioActual = anio || new Date().getFullYear();

  const sql = `
    SELECT 
      DATE(v.fecha) AS dia,
      COUNT(v.id) AS total_ventas,
      COALESCE(SUM(v.total), 0) AS ingresos_total
    FROM ventas v
    WHERE MONTH(v.fecha) = ? AND YEAR(v.fecha) = ?
    GROUP BY DATE(v.fecha)
    ORDER BY dia ASC
  `;
  db.query(sql, [mesActual, anioActual], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json({ mes: mesActual, anio: anioActual, detalle: results });
  });
};

// Productos más vendidos
const productosMasVendidos = (req, res) => {
  const sql = `
    SELECT 
      p.id, p.nombre, c.nombre AS categoria,
      SUM(dv.cantidad) AS total_vendido,
      SUM(dv.subtotal) AS ingresos_generados
    FROM detalle_ventas dv
    JOIN productos p ON dv.producto_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
    GROUP BY p.id
    ORDER BY total_vendido DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

// Productos con baja rotación
const productosBaljaRotacion = (req, res) => {
  const sql = `
    SELECT 
      p.id, p.nombre, c.nombre AS categoria,
      p.stock, p.stock_minimo,
      COALESCE(SUM(dv.cantidad), 0) AS total_vendido
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN detalle_ventas dv ON dv.producto_id = p.id
    WHERE p.activo = 1
    GROUP BY p.id
    ORDER BY total_vendido ASC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

// Dashboard resumen general
const dashboard = (req, res) => {
  const sqlVentas = `
    SELECT 
      COUNT(id) AS ventas_hoy,
      COALESCE(SUM(total), 0) AS ingresos_hoy
    FROM ventas
    WHERE DATE(fecha) = CURDATE()
  `;

  const sqlProductos = `SELECT COUNT(id) AS total_productos FROM productos WHERE activo = 1`;
  const sqlStockBajo = `SELECT COUNT(id) AS productos_stock_bajo FROM productos WHERE stock <= stock_minimo AND activo = 1`;
  const sqlCajasActivas = `SELECT COUNT(id) AS cajas_activas FROM cajas WHERE estado = 'abierta'`;

  db.query(sqlVentas, (err, ventas) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    db.query(sqlProductos, (err, productos) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
      db.query(sqlStockBajo, (err, stockBajo) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
        db.query(sqlCajasActivas, (err, cajas) => {
          if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
          res.json({
            ventas_hoy: ventas[0].ventas_hoy,
            ingresos_hoy: ventas[0].ingresos_hoy,
            total_productos: productos[0].total_productos,
            productos_stock_bajo: stockBajo[0].productos_stock_bajo,
            cajas_activas: cajas[0].cajas_activas
          });
        });
      });
    });
  });
};

// Egresos de una caja específica
const egresosPorCaja = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT e.*, c.usuario_id
    FROM egresos_caja e
    JOIN cajas c ON e.caja_id = c.id
    WHERE e.caja_id = ?
    ORDER BY e.creado_en DESC
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

module.exports = { ventasDiarias, ventasSemanales, ventasMensuales, productosMasVendidos, productosBaljaRotacion, dashboard, egresosPorCaja };