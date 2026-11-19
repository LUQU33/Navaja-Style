import { apiFetch } from "./client";

export function listarProductos(categoriaId) {
  const query = categoriaId ? `?categoria=${categoriaId}` : "";
  return apiFetch(`/productos${query}`);
}

export function obtenerProducto(id) {
  return apiFetch(`/productos/${id}`);
}
