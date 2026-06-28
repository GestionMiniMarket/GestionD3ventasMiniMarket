const express = require('express');
const router = express.Router();
const { registrarVenta, listarVentas, detalleVenta } = require('../controllers/ventasController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, registrarVenta);
router.get('/', verifyToken, listarVentas);
router.get('/:id', verifyToken, detalleVenta);

module.exports = router;