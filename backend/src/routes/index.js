const { Router } = require("express");
const categoriaRoutes = require("./categoria.routes");
const productoRoutes = require("./producto.routes");
const talleRoutes = require("./talle.routes");
const colorRoutes = require("./color.routes");
const authRoutes = require("./auth.routes");
const router = Router();

router.use(categoriaRoutes);
router.use(productoRoutes);
router.use(talleRoutes);
router.use(colorRoutes);

router.use(authRoutes);
module.exports = router;
