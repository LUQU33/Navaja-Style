const { Router } = require("express");
const categoriaRoutes = require("./categoria.routes");
const productoRoutes = require("./producto.routes")
const authRoutes = require("./auth.routes");
const router = Router();

router.use(categoriaRoutes);
router.use(productoRoutes);

router.use(authRoutes);
module.exports = router;
