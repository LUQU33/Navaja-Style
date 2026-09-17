const { crearModeloCRUD } = require("../utils/crud.model");

module.exports = crearModeloCRUD({
  tabla: "talles",
  camposCreables: ["nombre", "orden"],
  camposActualizables: ["nombre", "orden"],
});
