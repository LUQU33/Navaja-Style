const productoModel = require("../models/producto.model");
const { crearControllerCRUD } = require("../utils/crud.controller");

module.exports = crearControllerCRUD({
  modelo: productoModel,
  nombreEntidad: "Producto",
  campoNombre: "nombre",
});
