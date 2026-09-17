const { Router } = require("express");
const talleController = require("../controllers/talle.controller");

const router = Router();

router.post("/talles", talleController.crear);
router.get("/talles", talleController.listar);
router.get("/talles/:id", talleController.obtenerPorId);
router.put("/talles/:id", talleController.actualizar);
router.delete("/talles/:id", talleController.eliminar);

module.exports = router;
