const { Router } = require("express");
const { body } = require("express-validator");
const productoController = require("../controllers/producto.controller");
const { verificarAutenticacion, soloAdmin } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

const validacionProducto = [
  body("nombre", "El nombre es inválido, está vacío o supera los 150 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 150 }),
  body("descripcion", "La descripción debe ser texto de hasta 65535 caracteres")
    .optional({ values: "null" })
    .isString()
    .isLength({ max: 65535 }),
  body("precio", "El precio debe ser un número entre 0 y 99999999.99 con hasta 2 decimales")
    .isDecimal({ decimal_digits: "0,2" })
    .isFloat({ min: 0, max: 99999999.99 }),
  body("categoria_id", "La categoría debe ser un entero positivo")
    .isInt({ min: 1 }),
  body("estado", "El estado debe ser activo, inactivo o borrador")
    .optional()
    .isIn(["activo", "inactivo", "borrador"]),
];

router.post(
  "/productos",
  verificarAutenticacion,
  soloAdmin,
  validacionProducto,
  verificarValidaciones,
  productoController.crear
);
router.get("/productos", productoController.listar);
router.get("/productos/:id", validarId, verificarValidaciones, productoController.obtenerPorId);
router.put(
  "/productos/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  validacionProducto,
  verificarValidaciones,
  productoController.actualizar
);
router.delete(
  "/productos/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  verificarValidaciones,
  productoController.eliminar
);

module.exports = router;
