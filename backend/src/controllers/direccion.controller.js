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

module.exports = { listar, crear };
