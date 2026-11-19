const { Router } = require("express");
const { body } = require("express-validator");
const carritoController = require("../controllers/carrito.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

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
router.put(
  "/carrito/items/:id",
  verificarAutenticacion,
  validarId,
  body("cantidad", "La cantidad debe ser un entero positivo").isInt({ min: 1 }).toInt(),
  verificarValidaciones,
  carritoController.actualizarItem
);
router.delete(
  "/carrito/items/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  carritoController.eliminarItem
);

module.exports = router;
