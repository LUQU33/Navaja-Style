const { Router } = require("express");
const { body } = require("express-validator");
const varianteController = require("../controllers/variante.controller");
const { verificarAutenticacion, soloAdmin } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

const validacionVariante = [
  body("producto_id", "El producto debe ser un entero positivo")
    .isInt({ min: 1 }),
  body("color_id", "El color debe ser un entero positivo")
    .isInt({ min: 1 }),
  body("talle_id", "El talle debe ser un entero positivo")
    .isInt({ min: 1 }),
  body("sku", "El SKU es inválido, está vacío o supera los 50 caracteres")
    .optional({ values: "null" })
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 50 }),
  body("stock", "El stock debe ser un entero mayor o igual a 0")
    .optional()
    .isInt({ min: 0 }),
];

router.post(
  "/variantes",
  verificarAutenticacion,
  soloAdmin,
  validacionVariante,
  verificarValidaciones,
  varianteController.crear
);
router.get("/variantes", varianteController.listar);
router.get("/variantes/:id", validarId, verificarValidaciones, varianteController.obtenerPorId);
router.put(
  "/variantes/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  validacionVariante,
  verificarValidaciones,
  varianteController.actualizar
);
router.delete(
  "/variantes/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  verificarValidaciones,
  varianteController.eliminar
);

module.exports = router;
