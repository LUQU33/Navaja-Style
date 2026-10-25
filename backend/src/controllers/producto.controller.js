const productoModel = require("../models/producto.model");
const ApiError = require("../utils/ApiError");

async function crear(req, res) {
  const item = await productoModel.crear(req.body);
  res.status(201).json({ success: true, data: item });
}

function categoriaDeQuery(req) {
  return req.query.categoria ? Number(req.query.categoria) : null;
}

async function listar(req, res) {
  const items = await productoModel.listarCatalogo({
    categoriaId: categoriaDeQuery(req),
    soloActivos: true,
  });
  res.json({ success: true, data: items });
}

async function obtenerPorId(req, res) {
  const id = Number(req.params.id);
  const item = await productoModel.buscarDetalle(id, { soloActivos: true });

  if (!item) {
    throw new ApiError(404, `Producto con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function listarAdmin(req, res) {
  const items = await productoModel.listarCatalogo({
    categoriaId: categoriaDeQuery(req),
    soloActivos: false,
  });
  res.json({ success: true, data: items });
}

async function obtenerPorIdAdmin(req, res) {
  const id = Number(req.params.id);
  const item = await productoModel.buscarDetalle(id, { soloActivos: false });

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

module.exports = { crear, listar, obtenerPorId, listarAdmin, obtenerPorIdAdmin, actualizar, eliminar };
