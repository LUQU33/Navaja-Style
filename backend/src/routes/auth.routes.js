const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();
const { verificarAutenticacion } = require("../middlewares/auth.middleware");

router.post("/auth/login", authController.login);
router.get("/auth/me", verificarAutenticacion, authController.me);
module.exports = router;