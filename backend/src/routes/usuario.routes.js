const { Router } = require("express");
const { body } = require("express-validator");
const usuarioController = require("../controllers/usuario.controller");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");
const { verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = Router();

// Actualización parcial: todos los campos son opcionales.
const validacionActualizarPerfil = [
  body("nombre", "El nombre es inválido, está vacío o supera los 100 caracteres")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),
  body("apellido", "El apellido es inválido, está vacío o supera los 100 caracteres")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),
  body("telefono", "El teléfono es inválido, está vacío o supera los 30 caracteres")
    .optional({ values: "null" })
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 30 }),
  body("password", "La contraseña debe tener entre 6 y 128 caracteres")
    .optional()
    .isString()
    .isLength({ min: 6, max: 128 }),
];

router.get("/usuarios/me", verificarAutenticacion, usuarioController.obtenerMe);
router.put(
  "/usuarios/me",
  verificarAutenticacion,
  validacionActualizarPerfil,
  verificarValidaciones,
  usuarioController.actualizarMe
);

module.exports = router;
