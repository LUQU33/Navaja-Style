const { Router } = require("express");
const { body } = require("express-validator");
const colorController = require("../controllers/color.controller");
const { verificarAutenticacion, soloAdmin } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

const validacionColor = [
  body("nombre", "El nombre es inválido, está vacío o supera los 50 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 50 }),
  body("hex", "El hex debe tener el formato #RRGGBB")
    .optional({ values: "null" })
    .isString()
    .matches(/^#[0-9A-Fa-f]{6}$/),
];

router.post(
  "/colores",
  verificarAutenticacion,
  soloAdmin,
  validacionColor,
  verificarValidaciones,
  colorController.crear
);
router.get("/colores", colorController.listar);
router.get("/colores/:id", validarId, verificarValidaciones, colorController.obtenerPorId);
router.put(
  "/colores/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  validacionColor,
  verificarValidaciones,
  colorController.actualizar
);
router.delete(
  "/colores/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  verificarValidaciones,
  colorController.eliminar
);

module.exports = router;
