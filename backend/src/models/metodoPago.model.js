const { crearModeloCRUD } = require("../utils/crud.model");

module.exports = crearModeloCRUD({
  tabla: "metodos_pago",
  camposCreables: ["codigo", "nombre_visible", "activo", "orden"],
  camposActualizables: ["codigo", "nombre_visible", "activo", "orden"],
});
