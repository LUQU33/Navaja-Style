const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, { status, errores = [] } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errores = errores;
  }
}

// Hace el fetch contra el backend y devuelve `data` de { success, data, message, errores }.
// Si la respuesta no es exitosa lanza un ApiError con el mensaje del backend.
export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor", { status: 0 });
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const errores = json?.errores ?? [];
    const detalle = errores.map((e) => e.msg).join(". ");
    throw new ApiError(detalle || json?.message || `Error ${res.status}`, {
      status: res.status,
      errores,
    });
  }

  return json.data;
}
