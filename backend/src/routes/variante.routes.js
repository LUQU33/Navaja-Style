const { Router } = require("express");
const varianteController = require("../controllers/variante.controller");

const router = Router();

router.post("/variantes", varianteController.crear);
router.get("/variantes", varianteController.listar);
router.get("/variantes/:id", varianteController.obtenerPorId);
router.put("/variantes/:id", varianteController.actualizar);
router.delete("/variantes/:id", varianteController.eliminar);

module.exports = router;
