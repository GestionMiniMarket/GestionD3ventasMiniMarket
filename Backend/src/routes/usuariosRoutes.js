const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} = require("../controllers/usuariosController");

router.use(verifyToken);

router.get("/",     getUsuarios);
router.get("/:id",  getUsuarioById);
router.post("/",    createUsuario);
router.put("/:id",  updateUsuario);
router.delete("/:id", deleteUsuario);

module.exports = router;