const categoriaModel = require("../models/categoria.model");
const ApiError = require("../utils/ApiError");

async function crearCategoria(req, res) {
  const { nombre } = req.body
  const categoria = await categoriaModel.crear({ nombre });
  res.status(201).json(categoria);
}

async function listarCategorias(req, res) {
  const categorias = await categoriaModel.listar();
  res.json(categorias);
}

async function obtenerCategoriaPorId(req, res) {
  const id = Number(req.params.id);
  const categoria = await categoriaModel.buscarPorId(id);

  if (!categoria) {
    throw new ApiError(404, `Categoria con id ${id} no encontrada`);
  }

  res.json(categoria);
}

async function actualizarCategoria(req, res) {
  const id = Number(req.params.id);
  const categoria = await categoriaModel.actualizarPorId(id, req.body);

  if (!categoria) {
    throw new ApiError(404, `Categoria con id ${id} no encontrada`);
  }

  res.json(categoria);
}

async function eliminarCategoria(req, res) {
  const { id } = req.body;
  const categoria = await categoriaModel.eliminarPorId(id);

  if (!categoria) {
    throw new ApiError(404, `Categoria no encontrada`)
  }

  res.json({ mensaje: `${categoria.nombre} eliminada correctamente` });
}

module.exports = {
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria
}
