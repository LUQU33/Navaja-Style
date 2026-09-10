const { Router } = require("express");
const productoRoutes = require("./producto.routes");

const router = Router();

router.use(productoRoutes);

module.exports = router;
