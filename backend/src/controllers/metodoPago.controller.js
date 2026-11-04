const metodoPagoModel = require("../models/metodoPago.model");
const ApiError = require("../utils/ApiError");

async function crear(req, res) {
  const item = await metodoPagoModel.crear(req.body);
  res.status(201).json({ success: true, data: item });
}

async function listar(req, res) {
  const items = await metodoPagoModel.listar();
  res.json({ success: true, data: items });
}

async function obtenerPorId(req, res) {
  const id = Number(req.params.id);
  const item = await metodoPagoModel.buscarPorId(id);

  if (!item) {
    throw new ApiError(404, `Metodo de pago con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function actualizar(req, res) {
  const id = Number(req.params.id);
  const item = await metodoPagoModel.actualizar(id, req.body);

  if (!item) {
    throw new ApiError(404, `Metodo de pago con id ${id} no encontrado`);
  }

  res.json({ success: true, data: item });
}

async function eliminar(req, res) {
  const id = Number(req.params.id);
  const item = await metodoPagoModel.eliminar(id);

  if (!item) {
    throw new ApiError(404, `Metodo de pago con id ${id} no encontrado`);
  }

  res.json({ success: true, message: `${item.nombre_visible} eliminado correctamente` });
}

module.exports = { crear, listar, obtenerPorId, actualizar, eliminar };
