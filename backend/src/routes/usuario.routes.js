const { Router } = require("express");
const usuarioController = require("../controllers/usuario.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/usuarios/me", verificarAutenticacion, usuarioController.obtenerMe);
router.put("/usuarios/me", verificarAutenticacion, usuarioController.actualizarMe);

module.exports = router;
