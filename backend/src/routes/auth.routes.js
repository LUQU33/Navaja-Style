const express = require("express");
const authController = require("../controllers/auth.controller");
const usuarioController = require("../controllers/usuario.controller");

const router = express.Router();

router.post("/auth/login", authController.login);
router.post("/auth/register", usuarioController.crear);

module.exports = router;
