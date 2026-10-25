const { Router } = require("express");
const { body } = require("express-validator");
const categoriaController = require("../controllers/categoria.controller");
const { verificarAutenticacion, soloAdmin } = require("../middlewares/auth.middleware");
const { validarId, verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

const validacionCategoria = [
  body("nombre", "El nombre es inválido, está vacío o supera los 100 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),
];

router.post(
  "/categorias",
  verificarAutenticacion,
  soloAdmin,
  validacionCategoria,
  verificarValidaciones,
  categoriaController.crear
);
router.get("/categorias", categoriaController.listar);
router.get("/categorias/:id", validarId, verificarValidaciones, categoriaController.obtenerPorId);
router.put(
  "/categorias/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  validacionCategoria,
  verificarValidaciones,
  categoriaController.actualizar
);
router.delete(
  "/categorias/:id",
  verificarAutenticacion,
  soloAdmin,
  validarId,
  verificarValidaciones,
  categoriaController.eliminar
);

module.exports = router;
