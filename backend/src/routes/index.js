const { Router } = require("express");
const categoriaRoutes = require("./categoria.routes");
const authRoutes = require("./auth.routes");
const router = Router();

router.use(categoriaRoutes);

router.use(authRoutes);
module.exports = router;
