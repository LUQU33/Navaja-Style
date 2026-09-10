const productoModel = require("../models/producto.model");
const ApiError = require("../utils/ApiError");

async function crearProducto(req, res) {
  const { nombre, descripcion, precio, categoria_id } = req.body;
  const producto = await productoModel.crear({ nombre, descripcion, precio, categoria_id });
  res.status(201).json(producto);
}

async function listarProductos(req, res) {
  const productos = await productoModel.listar();
  res.json(productos);
}

async function obtenerProductoPorId(req, res) {
  const id = Number(req.params.id);
  const producto = await productoModel.buscarPorId(id);

  if (!producto) {
    throw new ApiError(404, `Producto con id ${id} no encontrado`);
  }

  res.json(producto);
}

async function actualizarProducto(req, res) {
  const id = Number(req.params.id);
  const producto = await productoModel.actualizarPorId(id, req.body);

  if (!producto) {
    throw new ApiError(404, `Producto con id ${id} no encontrado`);
  }

  res.json(producto);
}

async function eliminarProducto(req, res) {
  const { id } = req.body;
  const producto = await productoModel.eliminarPorId(id);

  if (!producto) {
    throw new ApiError(404, "Producto no encontrado");
  }

  res.json({ mensaje: `${producto.nombre} eliminado correctamente` });
}

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};
