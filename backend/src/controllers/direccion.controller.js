const direccionModel = require("../models/direccion.model");

async function listar(req, res, next) {
  try {
    const direcciones = await direccionModel.listarPorUsuario(req.usuario.id);
    return res.json({ success: true, data: direcciones });
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const direccion = await direccionModel.crear(req.usuario.id, req.body);
    return res.status(201).json({
      success: true,
      message: "Dirección creada correctamente",
      data: direccion,
    });
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const direccion = await direccionModel.actualizar(
      req.params.id,
      req.usuario.id,
      req.body
    );

    if (!direccion) {
      return res.status(404).json({ success: false, message: "Dirección no encontrada" });
    }

    return res.json({
      success: true,
      message: "Dirección actualizada correctamente",
      data: direccion,
    });
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const eliminada = await direccionModel.eliminar(req.params.id, req.usuario.id);

    if (!eliminada) {
      return res.status(404).json({ success: false, message: "Dirección no encontrada" });
    }

    return res.json({ success: true, message: "Dirección eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, crear, actualizar, eliminar };
