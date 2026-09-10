const { Router } = require("express");
const {
  crearProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/producto.controller");

const router = Router();

router.post("/productos", crearProducto);
router.get("/productos", listarProductos);
router.get("/productos/:id", obtenerProductoPorId);
router.put("/productos/:id", actualizarProducto);
router.delete("/productos", eliminarProducto);

module.exports = router;
