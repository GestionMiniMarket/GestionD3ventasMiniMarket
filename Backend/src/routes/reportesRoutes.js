const express = require('express');
const router = express.Router();
const { ventasDiarias, ventasSemanales, ventasMensuales, productosMasVendidos, productosBaljaRotacion, dashboard, egresosPorCaja } = require('../controllers/reportesController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/dashboard', verifyToken, dashboard);
router.get('/ventas/diarias', verifyToken, ventasDiarias);
router.get('/ventas/semanales', verifyToken, ventasSemanales);
router.get('/ventas/mensuales', verifyToken, ventasMensuales);
router.get('/productos/mas-vendidos', verifyToken, productosMasVendidos);
router.get('/productos/baja-rotacion', verifyToken, productosBaljaRotacion);
router.get('/cajas/:id/egresos', verifyToken, egresosPorCaja);

module.exports = router;