const express = require("express");
const authController = require("../controllers/auth.controller");
const {
  verificarAutenticacion,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/me", verificarAutenticacion, authController.me);

module.exports = router;