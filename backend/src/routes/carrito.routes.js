const { Router } = require("express");
const { body } = require("express-validator");
const carritoController = require("../controllers/carrito.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");
const { verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

router.get("/carrito", verificarAutenticacion, carritoController.obtener);
router.post(
  "/carrito/items",
  verificarAutenticacion,
  body("variante_id", "La variante debe ser un entero positivo").isInt({ min: 1 }).toInt(),
  body("cantidad", "La cantidad debe ser un entero positivo").isInt({ min: 1 }).toInt(),
  verificarValidaciones,
  carritoController.agregarItem
);

module.exports = router;
