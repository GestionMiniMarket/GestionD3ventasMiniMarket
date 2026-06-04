const express = require('express');
const router = express.Router();
const { listarCategorias, crearCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoriasController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, listarCategorias);
router.post('/', verifyToken, crearCategoria);
router.put('/:id', verifyToken, editarCategoria);
router.delete('/:id', verifyToken, eliminarCategoria);

module.exports = router;