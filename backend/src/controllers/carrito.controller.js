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

async function actualizarItem(req, res, next) {
  try {
    const carrito = await carritoModel.actualizarItem(
      req.usuario.id, req.params.id, req.body.cantidad
    );
    return res.json({
      success: true,
      message: "Cantidad actualizada correctamente",
      data: carrito,
    });
  } catch (error) {
    next(error);
  }
}

async function eliminarItem(req, res, next) {
  try {
    const eliminado = await carritoModel.eliminarItem(req.usuario.id, req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, message: "Artículo no encontrado en el carrito" });
    }

    const carrito = await carritoModel.obtenerPorUsuario(req.usuario.id);
    return res.json({ success: true, message: "Artículo eliminado del carrito", data: carrito });
  } catch (error) {
    next(error);
  }
}

async function vaciar(req, res, next) {
  try {
    const carrito = await carritoModel.vaciar(req.usuario.id);
    return res.json({ success: true, message: "Carrito vaciado correctamente", data: carrito });
  } catch (error) {
    next(error);
  }
}

module.exports = { obtener, agregarItem, actualizarItem, eliminarItem, vaciar };
