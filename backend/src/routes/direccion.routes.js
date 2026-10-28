const { Router } = require("express");
const { body } = require("express-validator");
const direccionController = require("../controllers/direccion.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");
const { verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

const validarDireccion = [
  body("calle", "La calle es obligatoria y no puede superar los 150 caracteres")
    .isString().trim().notEmpty().isLength({ max: 150 }),
  body("numero", "El número es obligatorio y no puede superar los 20 caracteres")
    .isString().trim().notEmpty().isLength({ max: 20 }),
  body("piso_depto", "El piso o departamento no puede superar los 30 caracteres")
    .optional({ values: "null" }).isString().trim().notEmpty().isLength({ max: 30 }),
  body("ciudad", "La ciudad es obligatoria y no puede superar los 100 caracteres")
    .isString().trim().notEmpty().isLength({ max: 100 }),
  body("provincia", "La provincia es obligatoria y no puede superar los 100 caracteres")
    .isString().trim().notEmpty().isLength({ max: 100 }),
  body("codigo_postal", "El código postal es obligatorio y no puede superar los 20 caracteres")
    .isString().trim().notEmpty().isLength({ max: 20 }),
  body("referencia", "La referencia debe ser texto")
    .optional({ values: "null" }).isString().trim().notEmpty(),
  body("es_principal", "La dirección principal se configurará por separado")
    .not().exists(),
];

router.get(
  "/usuarios/me/direcciones",
  verificarAutenticacion,
  direccionController.listar
);
router.post(
  "/usuarios/me/direcciones",
  verificarAutenticacion,
  validarDireccion,
  verificarValidaciones,
  direccionController.crear
);

module.exports = router;
