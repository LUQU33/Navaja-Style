const categoriaModel = require("../models/categoria.model");
const ApiError = require("../utils/ApiError");

async function crear(req, res) {
  const item = await categoriaModel.crear(req.body);
  res.status(201).json({ success: true, data: item });
}

async function listar(req, res) {
  const items = await categoriaModel.listar();
  res.json({ success: true, data: items });
}

async function obtenerPorId(req, res) {
  const id = Number(req.params.id);
  const item = await categoriaModel.buscarPorId(id);

  if (!item) {
    throw new ApiError(404, `Categoria con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function actualizar(req, res) {
  const id = Number(req.params.id);
  const item = await categoriaModel.actualizar(id, req.body);

  if (!item) {
    throw new ApiError(404, `Categoria con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function eliminar(req, res) {
  const id = Number(req.params.id);
  const item = await categoriaModel.eliminar(id);

  if (!item) {
    throw new ApiError(404, `Categoria con id ${id} no encontrado`);
  }

  res.json({ success: true, message: `${item.nombre} eliminado correctamente` });
}

module.exports = { crear, listar, obtenerPorId, actualizar, eliminar };
