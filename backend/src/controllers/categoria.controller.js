const categoriaModel = require("../models/categoria.model");
const { crearControllerCRUD } = require("../utils/crud.controller");

module.exports = crearControllerCRUD({
  modelo: categoriaModel,
  nombreEntidad: "Categoria",
  campoNombre: "nombre",
});
