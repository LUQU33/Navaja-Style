const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const usuarioController = require("../controllers/usuario.controller");
const { verificarValidaciones } = require("../middlewares/validaciones.middleware");

const router = express.Router();

const validacionLogin = [
  body("email", "El email es inválido o está vacío")
    .isString()
    .trim()
    .toLowerCase()
    .notEmpty(),
  body("password", "La contraseña es inválida o está vacía")
    .isString()
    .notEmpty(),
];

const validacionRegistro = [
  body("nombre", "El nombre es inválido, está vacío o supera los 100 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),
  body("apellido", "El apellido es inválido, está vacío o supera los 100 caracteres")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),
  body("email", "El email es inválido o supera los 255 caracteres")
    .isString()
    .trim()
    .toLowerCase()
    .isEmail()
    .isLength({ max: 255 }),
  body("password", "La contraseña debe tener entre 6 y 128 caracteres")
    .isString()
    .isLength({ min: 6, max: 128 }),
  body("telefono", "El teléfono es inválido, está vacío o supera los 30 caracteres")
    .optional({ values: "null" })
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 30 }),
];

router.post("/auth/login", validacionLogin, verificarValidaciones, authController.login);
router.post("/auth/register", validacionRegistro, verificarValidaciones, usuarioController.crear);

module.exports = router;
