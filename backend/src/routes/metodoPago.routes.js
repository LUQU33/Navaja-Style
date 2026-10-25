const { Router } = require("express");
const { body } = require("express-validator");
const metodoPagoController = require("../controllers/metodoPago.controller");
const { verificarAutenticacion, soloAdmin } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

const validacionMetodoPago = [
  body("codigo", "El código es inválido, está vacío o supera los 30 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 30 }),
  body("nombre_visible", "El nombre visible es inválido, está vacío o supera los 50 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 50 }),
  body("activo", "El campo activo debe ser verdadero o falso")
    .optional()
    .isBoolean()
    .toBoolean(),
  body("orden", "El orden debe ser un entero mayor o igual a 0")
    .optional()
    .isInt({ min: 0 }),
];

router.post(
  "/metodos-pago",
  verificarAutenticacion,
  soloAdmin,
  validacionMetodoPago,
  verificarValidaciones,
  metodoPagoController.crear
);
router.get("/metodos-pago", metodoPagoController.listar);
router.get("/metodos-pago/:id", validarId, verificarValidaciones, metodoPagoController.obtenerPorId);
router.put(
  "/metodos-pago/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  validacionMetodoPago,
  verificarValidaciones,
  metodoPagoController.actualizar
);
router.delete(
  "/metodos-pago/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  verificarValidaciones,
  metodoPagoController.eliminar
);

module.exports = router;
