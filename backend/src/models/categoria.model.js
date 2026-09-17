const { crearModeloCRUD } = require("../utils/crud.model");

module.exports = crearModeloCRUD({
  tabla: "categorias",
  camposCreables: ["nombre"],
  camposActualizables: ["nombre"],
});
