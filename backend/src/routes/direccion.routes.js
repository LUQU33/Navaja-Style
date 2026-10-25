const { Router } = require("express");
const direccionController = require("../controllers/direccion.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");

const router = Router();

router.get(
  "/usuarios/me/direcciones",
  verificarAutenticacion,
  direccionController.listar
);

module.exports = router;
