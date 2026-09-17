const metodoPagoModel = require("../models/metodoPago.model");
const { crearControllerCRUD } = require("../utils/crud.controller");

module.exports = crearControllerCRUD({
  modelo: metodoPagoModel,
  nombreEntidad: "Metodo de pago",
  campoNombre: "nombre_visible",
});
