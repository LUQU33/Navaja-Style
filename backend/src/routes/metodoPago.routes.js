const { Router } = require("express");
const metodoPagoController = require("../controllers/metodoPago.controller");

const router = Router();

router.post("/metodos-pago", metodoPagoController.crear);
router.get("/metodos-pago", metodoPagoController.listar);
router.get("/metodos-pago/:id", metodoPagoController.obtenerPorId);
router.put("/metodos-pago/:id", metodoPagoController.actualizar);
router.delete("/metodos-pago/:id", metodoPagoController.eliminar);

module.exports = router;
