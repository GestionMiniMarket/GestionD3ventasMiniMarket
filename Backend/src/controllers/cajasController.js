const db = require('../config/db');

// Abrir caja
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

    const sql = 'INSERT INTO cajas (usuario_id, monto_inicial, estado) VALUES (?, ?, "abierta")';
    db.query(sql, [usuario_id, monto_inicial], (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
      res.status(201).json({ mensaje: 'Caja abierta correctamente', caja_id: result.insertId });
    });
  });
};

// Ver resumen de caja activa (para la pantalla de cierre del cajero)
const resumenCaja = (req, res) => {
  const usuario_id = req.usuario.id;

  const sql = `
    SELECT c.*,
      COALESCE(SUM(CASE WHEN v.metodo_pago = 'efectivo' THEN v.total ELSE 0 END), 0) AS ventas_efectivo,
      COALESCE(SUM(CASE WHEN v.metodo_pago = 'tarjeta' THEN v.total ELSE 0 END), 0) AS ventas_tarjeta,
      COALESCE((SELECT SUM(e.monto) FROM egresos_caja e WHERE e.caja_id = c.id), 0) AS total_egresos
    FROM cajas c
    LEFT JOIN ventas v ON v.caja_id = c.id
    WHERE c.usuario_id = ? AND c.estado = 'abierta'
    GROUP BY c.id
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (results.length === 0)
      return res.status(404).json({ mensaje: 'No tienes una caja abierta' });

    const caja = results[0];
    const efectivo_esperado = parseFloat(caja.monto_inicial) + parseFloat(caja.ventas_efectivo) - parseFloat(caja.total_egresos);

    res.json({
      caja_id: caja.id,
      monto_inicial: caja.monto_inicial,
      ventas_efectivo: caja.ventas_efectivo,
      ventas_tarjeta: caja.ventas_tarjeta,
      total_egresos: caja.total_egresos,
      efectivo_esperado: efectivo_esperado.toFixed(2)
    });
  });
};

// Registrar egreso/gasto de caja
const registrarEgreso = (req, res) => {
  const { motivo, monto } = req.body;
  const usuario_id = req.usuario.id;

  if (!motivo || !monto)
    return res.status(400).json({ mensaje: 'Motivo y monto son requeridos' });

  const sqlCaja = "SELECT id FROM cajas WHERE usuario_id = ? AND estado = 'abierta'";
  db.query(sqlCaja, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (results.length === 0)
      return res.status(404).json({ mensaje: 'No tienes una caja abierta' });

    const caja_id = results[0].id;
    db.query('INSERT INTO egresos_caja (caja_id, motivo, monto) VALUES (?, ?, ?)', [caja_id, motivo, monto], (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
      res.status(201).json({ mensaje: 'Egreso registrado correctamente' });
    });
  });
};

// Solicitar cierre (cajero cuenta el dinero e ingresa el monto)
const solicitarCierre = (req, res) => {
  const { efectivo_contado } = req.body;
  const usuario_id = req.usuario.id;

  if (efectivo_contado === undefined)
    return res.status(400).json({ mensaje: 'El efectivo contado es requerido' });

  const sql = `
    SELECT c.*,
      COALESCE(SUM(CASE WHEN v.metodo_pago = 'efectivo' THEN v.total ELSE 0 END), 0) AS ventas_efectivo,
      COALESCE((SELECT SUM(e.monto) FROM egresos_caja e WHERE e.caja_id = c.id), 0) AS total_egresos
    FROM cajas c
    LEFT JOIN ventas v ON v.caja_id = c.id
    WHERE c.usuario_id = ? AND c.estado = 'abierta'
    GROUP BY c.id
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (results.length === 0)
      return res.status(404).json({ mensaje: 'No tienes una caja abierta' });

    const caja = results[0];
    const efectivo_esperado = parseFloat(caja.monto_inicial) + parseFloat(caja.ventas_efectivo) - parseFloat(caja.total_egresos);
    const diferencia = parseFloat(efectivo_contado) - efectivo_esperado;

    const updateSql = `
      UPDATE cajas 
      SET estado = 'esperando_cierre', efectivo_contado = ?, diferencia = ?
      WHERE id = ?
    `;
    db.query(updateSql, [efectivo_contado, diferencia.toFixed(2), caja.id], (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
      res.json({
        mensaje: 'Solicitud de cierre enviada al supervisor',
        efectivo_esperado: efectivo_esperado.toFixed(2),
        efectivo_contado,
        diferencia: diferencia.toFixed(2),
        estado: diferencia === 0 ? 'Sin descuadre' : diferencia > 0 ? 'Sobrante' : 'Faltante'
      });
    });
  });
};

// Listar cajas (para el supervisor)
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

// Confirmar cierre (solo supervisor)
const confirmarCierre = (req, res) => {
  const { id } = req.params;
  const { observaciones } = req.body;
  const rol = req.usuario.rol;

  if (rol !== 'Supervisor' && rol !== 'Administrador')
    return res.status(403).json({ mensaje: 'Solo el Supervisor puede confirmar cierres' });

  const sql = `
    UPDATE cajas 
    SET estado = 'cerrada', fecha_cierre = NOW(), observaciones = ?
    WHERE id = ? AND estado = 'esperando_cierre'
  `;
  db.query(sql, [observaciones || null, id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Caja no encontrada o no está esperando cierre' });
    res.json({ mensaje: 'Caja cerrada correctamente' });
  });
};

module.exports = { abrirCaja, resumenCaja, registrarEgreso, solicitarCierre, listarCajas, confirmarCierre };