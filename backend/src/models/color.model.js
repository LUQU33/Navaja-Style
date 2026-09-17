const { crearModeloCRUD } = require("../utils/crud.model");

module.exports = crearModeloCRUD({
  tabla: "colores",
  camposCreables: ["nombre", "hex"],
  camposActualizables: ["nombre", "hex"],
});
