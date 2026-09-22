const { Router } = require("express");
const categoriaController = require("../controllers/categoria.controller");

const router = Router();

router.post("/categorias", categoriaController.crear);
router.get("/categorias", categoriaController.listar);
router.get("/categorias/:id", categoriaController.obtenerPorId);
router.put("/categorias/:id", categoriaController.actualizar);
router.delete("/categorias/:id", categoriaController.eliminar);

module.exports = router;
