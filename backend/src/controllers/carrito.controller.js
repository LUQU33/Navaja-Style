const carritoModel = require("../models/carrito.model");

async function obtener(req, res, next) {
  try {
    const carrito = await carritoModel.obtenerPorUsuario(req.usuario.id);
    return res.json({ success: true, data: carrito });
  } catch (error) {
    next(error);
  }
}

async function agregarItem(req, res, next) {
  try {
    const carrito = await carritoModel.agregarItem(
      req.usuario.id, req.body.variante_id, req.body.cantidad
    );
    return res.status(201).json({
      success: true,
      message: "Producto agregado al carrito",
      data: carrito,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { obtener, agregarItem };
