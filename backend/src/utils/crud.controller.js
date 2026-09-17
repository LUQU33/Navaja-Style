const ApiError = require("./ApiError");

function crearControllerCRUD({ modelo, nombreEntidad, campoNombre }) {
  async function crear(req, res) {
    const item = await modelo.crear(req.body);
    res.status(201).json(item);
  }

  async function listar(req, res) {
    const items = await modelo.listar();
    res.json(items);
  }

  async function obtenerPorId(req, res) {
    const id = Number(req.params.id);
    const item = await modelo.buscarPorId(id);

    if (!item) {
      throw new ApiError(404, `${nombreEntidad} con id ${id} no encontrado`);
    }

    res.json(item);
  }

  async function actualizar(req, res) {
    const id = Number(req.params.id);
    const item = await modelo.actualizarPorId(id, req.body);

    if (!item) {
      throw new ApiError(404, `${nombreEntidad} con id ${id} no encontrado`);
    }

    res.json(item);
  }

  async function eliminar(req, res) {
    const id = Number(req.params.id);
    const item = await modelo.eliminarPorId(id);

    if (!item) {
      throw new ApiError(404, `${nombreEntidad} con id ${id} no encontrado`);
    }

    const mensaje = campoNombre
      ? `${item[campoNombre]} eliminado correctamente`
      : `${nombreEntidad} #${id} eliminado correctamente`;

    res.json({ mensaje });
  }

  return { crear, listar, obtenerPorId, actualizar, eliminar };
}

module.exports = { crearControllerCRUD };
