const db = require('../config/db');

const abrirCaja = (req, res) => {
  const { monto_inicial } = req.body;
  const usuario_id = req.usuario.id;

  if (!monto_inicial)
    return res.status(400).json({ mensaje: 'El monto inicial es requerido' });

  const sqlVerificar = "SELECT * FROM cajas WHERE usuario_id = ? AND estado = 'abierta'";
  db.query(sqlVerificar, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (results.length > 0)
      return res.status(400).json({ mensaje: 'Ya tienes una caja abierta' });

    const sql = 'INSERT INTO cajas (usuario_id, monto_inicial) VALUES (?, ?)';
    db.query(sql, [usuario_id, monto_inicial], (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
      res.status(201).json({ mensaje: 'Caja abierta correctamente', caja_id: result.insertId });
    });
  });
};

const cerrarCaja = (req, res) => {
  const { monto_final } = req.body;
  const usuario_id = req.usuario.id;

  if (!monto_final)
    return res.status(400).json({ mensaje: 'El monto final es requerido' });

  const sql = "UPDATE cajas SET estado = 'cerrada', fecha_cierre = NOW(), monto_final = ? WHERE usuario_id = ? AND estado = 'abierta'";
  db.query(sql, [monto_final, usuario_id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'No tienes una caja abierta' });
    res.json({ mensaje: 'Caja cerrada correctamente' });
  });
};

const listarCajas = (req, res) => {
  const sql = `
    SELECT c.*, u.nombre AS cajero
    FROM cajas c
    JOIN usuarios u ON c.usuario_id = u.id
    ORDER BY c.fecha_apertura DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.json(results);
  });
};

module.exports = { abrirCaja, cerrarCaja, listarCajas };