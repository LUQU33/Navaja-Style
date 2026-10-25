const colorModel = require("../models/color.model");
const ApiError = require("../utils/ApiError");

async function crear(req, res) {
  const item = await colorModel.crear(req.body);
  res.status(201).json({ success: true, data: item });
}

async function listar(req, res) {
  const items = await colorModel.listar();
  res.json({ success: true, data: items });
}

async function obtenerPorId(req, res) {
  const id = Number(req.params.id);
  const item = await colorModel.buscarPorId(id);

  if (!item) {
    throw new ApiError(404, `Color con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function actualizar(req, res) {
  const id = Number(req.params.id);
  const item = await colorModel.actualizar(id, req.body);

  if (!item) {
    throw new ApiError(404, `Color con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function eliminar(req, res) {
  const id = Number(req.params.id);
  const item = await colorModel.eliminar(id);

  if (!item) {
    throw new ApiError(404, `Color con id ${id} no encontrado`);
  }

  res.json({ success: true, message: `${item.nombre} eliminado correctamente` });
}

module.exports = { crear, listar, obtenerPorId, actualizar, eliminar };
