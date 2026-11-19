import { apiFetch } from "./client";

export function listarCategorias() {
  return apiFetch("/categorias");
}