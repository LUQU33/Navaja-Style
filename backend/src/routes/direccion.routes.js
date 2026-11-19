const { Router } = require("express");
const { body } = require("express-validator");
const direccionController = require("../controllers/direccion.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

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

const validarEdicion = [
  body().custom((campos) => {
    if (!campos || typeof campos !== "object" || Array.isArray(campos)) return false;
    const nombres = Object.keys(campos);
    if (nombres.length === 0) return false;
    if ("es_principal" in campos) return nombres.length === 1;
    return nombres.every((campo) =>
      ["calle", "numero", "piso_depto", "ciudad", "provincia", "codigo_postal", "referencia"].includes(campo)
    );
  }).withMessage("Enviá campos válidos para actualizar"),
  body("calle").optional().isString().trim().notEmpty().isLength({ max: 150 }),
  body("numero").optional().isString().trim().notEmpty().isLength({ max: 20 }),
  body("piso_depto").optional({ values: "null" }).isString().trim().notEmpty().isLength({ max: 30 }),
  body("ciudad").optional().isString().trim().notEmpty().isLength({ max: 100 }),
  body("provincia").optional().isString().trim().notEmpty().isLength({ max: 100 }),
  body("codigo_postal").optional().isString().trim().notEmpty().isLength({ max: 20 }),
  body("referencia").optional({ values: "null" }).isString().trim().notEmpty(),
  body("es_principal").optional().custom((valor) => valor === true)
    .withMessage("es_principal debe ser true"),
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
router.put(
  "/usuarios/me/direcciones/:id",
  verificarAutenticacion,
  validarId,
  validarEdicion,
  verificarValidaciones,
  direccionController.actualizar
);
router.delete(
  "/usuarios/me/direcciones/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  direccionController.eliminar
);

module.exports = router;
