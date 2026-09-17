const { Router } = require("express");
const colorController = require("../controllers/color.controller");

const router = Router();

router.post("/colores", colorController.crear);
router.get("/colores", colorController.listar);
router.get("/colores/:id", colorController.obtenerPorId);
router.put("/colores/:id", colorController.actualizar);
router.delete("/colores/:id", colorController.eliminar);

module.exports = router;
