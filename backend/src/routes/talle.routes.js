const { Router } = require("express");
const { body } = require("express-validator");
const talleController = require("../controllers/talle.controller");
const { verificarAutenticacion, soloAdmin } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

const validacionTalle = [
  body("nombre", "El nombre es inválido, está vacío o supera los 20 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 20 }),
  body("orden", "El orden debe ser un entero mayor o igual a 0")
    .optional()
    .isInt({ min: 0 }),
];

router.post(
  "/talles",
  verificarAutenticacion,
  soloAdmin,
  validacionTalle,
  verificarValidaciones,
  talleController.crear
);
router.get("/talles", talleController.listar);
router.get("/talles/:id", validarId, verificarValidaciones, talleController.obtenerPorId);
router.put(
  "/talles/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  validacionTalle,
  verificarValidaciones,
  talleController.actualizar
);
router.delete(
  "/talles/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  verificarValidaciones,
  talleController.eliminar
);

module.exports = router;
