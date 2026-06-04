const express = require('express');
const router = express.Router();
const { listarInventario, agregarStock, ajustarStock, stockBajo } = require('../controllers/inventarioController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, listarInventario);
router.put('/:id/agregar-stock', verifyToken, agregarStock);
router.put('/:id/ajustar-stock', verifyToken, ajustarStock);
router.get('/stock-bajo', verifyToken, stockBajo);

module.exports = router;