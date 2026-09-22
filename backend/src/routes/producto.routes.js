const { Router } = require("express");
const productoController = require("../controllers/producto.controller");

const router = Router();

router.post("/productos", productoController.crear);
router.get("/productos", productoController.listar);
router.get("/productos/:id", productoController.obtenerPorId);
router.put("/productos/:id", productoController.actualizar);
router.delete("/productos/:id", productoController.eliminar);

module.exports = router;
