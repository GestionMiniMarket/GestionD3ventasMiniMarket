const express = require('express');
const router = express.Router();
const { listarProductos, crearProducto, editarProducto, eliminarProducto, stockBajo, restaurarProducto  } = require('../controllers/productosController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, listarProductos);
router.post('/', verifyToken, crearProducto);
router.put('/:id', verifyToken, editarProducto);
router.delete('/:id', verifyToken, eliminarProducto);
router.get('/stock-bajo', verifyToken, stockBajo);
router.put('/:id/restaurar', verifyToken, restaurarProducto);

module.exports = router;