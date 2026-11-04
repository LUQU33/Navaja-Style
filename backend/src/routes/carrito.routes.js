const { Router } = require("express");
const carritoController = require("../controllers/carrito.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/carrito", verificarAutenticacion, carritoController.obtener);

module.exports = router;
