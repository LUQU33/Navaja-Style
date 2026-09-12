const { Router } = require("express");
const categoriaRoutes = require("./categoria.routes");
const productoRoutes = require("./producto.routes");

const router = Router();

router.use(categoriaRoutes);
router.use(productoRoutes);

module.exports = router;
