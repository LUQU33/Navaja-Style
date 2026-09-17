const talleModel = require("../models/talle.model");
const { crearControllerCRUD } = require("../utils/crud.controller");

module.exports = crearControllerCRUD({
  modelo: talleModel,
  nombreEntidad: "Talle",
  campoNombre: "nombre",
});
