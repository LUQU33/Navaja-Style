const carritoModel = require("../models/carrito.model");

async function obtener(req, res, next) {
  try {
    const carrito = await carritoModel.obtenerPorUsuario(req.usuario.id);
    return res.json({ success: true, data: carrito });
  } catch (error) {
    next(error);
  }
}

module.exports = { obtener };
