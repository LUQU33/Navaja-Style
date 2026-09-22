const varianteModel = require("../models/variante.model");
const { crearControllerCRUD } = require("../utils/crud.controller");

module.exports = crearControllerCRUD({
  modelo: varianteModel,
  nombreEntidad: "Variante",
});
