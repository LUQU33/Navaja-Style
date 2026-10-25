const direccionModel = require("../models/direccion.model");

async function listar(req, res, next) {
  try {
    const direcciones = await direccionModel.listarPorUsuario(req.usuario.id);
    return res.json({ success: true, data: direcciones });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar };
