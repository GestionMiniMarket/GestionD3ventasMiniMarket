const express = require('express');
const router = express.Router();
const { listarCategorias, crearCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoriasController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.use(verifyToken, verifyAdmin);

router.get('/', listarCategorias);
router.post('/', crearCategoria);
router.put('/:id', editarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;