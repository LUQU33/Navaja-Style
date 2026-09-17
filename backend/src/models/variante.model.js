const { crearModeloCRUD } = require("../utils/crud.model");

module.exports = crearModeloCRUD({
  tabla: "variantes",
  camposCreables: ["producto_id", "color_id", "talle_id", "sku", "stock"],
  camposActualizables: ["producto_id", "color_id", "talle_id", "sku", "stock"],
  conTimestamps: true,
});
