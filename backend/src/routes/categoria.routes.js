const { Router } = require("express");
const {
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categoria.controller");

const router = Router()

router.post("/categorias", crearCategoria);
router.get("/categorias", listarCategorias);
router.get("/categorias/:id", obtenerCategoriaPorId);
router.put("/categorias/:id", actualizarCategoria);
router.delete("/categorias", eliminarCategoria);

module.exports = router;
