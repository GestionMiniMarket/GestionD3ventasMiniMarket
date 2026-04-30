const express = require('express');
const router = express.Router();
const { registrar, login, logout } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/registro', registrar);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

module.exports = router;