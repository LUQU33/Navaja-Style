const productoModel = require("../models/producto.model");
const ApiError = require("../utils/ApiError");

async function crear(req, res) {
  const item = await productoModel.crear(req.body);
  res.status(201).json({ success: true, data: item });
}

async function listar(req, res) {
  const items = await productoModel.listar();
  res.json({ success: true, data: items });
}

async function obtenerPorId(req, res) {
  const id = Number(req.params.id);
  const item = await productoModel.buscarPorId(id);

  if (!item) {
    throw new ApiError(404, `Producto con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function actualizar(req, res) {
  const id = Number(req.params.id);
  const item = await productoModel.actualizar(id, req.body);

  if (!item) {
    throw new ApiError(404, `Producto con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function eliminar(req, res) {
  const id = Number(req.params.id);
  const item = await productoModel.eliminar(id);

  if (!item) {
    throw new ApiError(404, `Producto con id ${id} no encontrado`);
  }

  res.json({ success: true, message: `${item.nombre} eliminado correctamente` });
}

module.exports = { crear, listar, obtenerPorId, actualizar, eliminar };
