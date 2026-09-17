const { crearModeloCRUD } = require("../utils/crud.model");

module.exports = crearModeloCRUD({
  tabla: "productos",
  camposCreables: ["nombre", "descripcion", "precio", "categoria_id"],
  camposActualizables: ["nombre", "descripcion", "precio", "categoria_id", "estado"],
  conTimestamps: true,
});
