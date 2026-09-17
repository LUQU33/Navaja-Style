const colorModel = require("../models/color.model");
const { crearControllerCRUD } = require("../utils/crud.controller");

module.exports = crearControllerCRUD({
  modelo: colorModel,
  nombreEntidad: "Color",
  campoNombre: "nombre",
});
