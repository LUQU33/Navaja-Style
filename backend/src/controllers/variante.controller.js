const varianteModel = require("../models/variante.model");
const ApiError = require("../utils/ApiError");

async function crear(req, res) {
  const item = await varianteModel.crear(req.body);
  res.status(201).json({ success: true, data: item });
}

async function listar(req, res) {
  const items = await varianteModel.listar();
  res.json({ success: true, data: items });
}

async function obtenerPorId(req, res) {
  const id = Number(req.params.id);
  const item = await varianteModel.buscarPorId(id);

  if (!item) {
    throw new ApiError(404, `Variante con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function actualizar(req, res) {
  const id = Number(req.params.id);
  const item = await varianteModel.actualizar(id, req.body);

  if (!item) {
    throw new ApiError(404, `Variante con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function eliminar(req, res) {
  const id = Number(req.params.id);
  const item = await varianteModel.eliminar(id);

  if (!item) {
    throw new ApiError(404, `Variante con id ${id} no encontrado`);
  }

  res.json({ success: true, message: `Variante #${id} eliminado correctamente` });
}

module.exports = { crear, listar, obtenerPorId, actualizar, eliminar };
