const express = require('express');
const router = express.Router();
const { abrirCaja, resumenCaja, registrarEgreso, solicitarCierre, listarCajas, confirmarCierre } = require('../controllers/cajasController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/abrir', verifyToken, abrirCaja);
router.get('/resumen', verifyToken, resumenCaja);
router.post('/egreso', verifyToken, registrarEgreso);
router.put('/solicitar-cierre', verifyToken, solicitarCierre);
router.get('/', verifyToken, listarCajas);
router.put('/:id/confirmar-cierre', verifyToken, confirmarCierre);

module.exports = router;