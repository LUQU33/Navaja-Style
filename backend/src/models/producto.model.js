const pool = require("../config/db.config");

async function listar() {
  const [filas] = await pool.execute("SELECT * FROM productos ORDER BY id");
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute("SELECT * FROM productos WHERE id = ?", [id]);
  return filas[0];
}

async function crear({ nombre, descripcion, precio, categoria_id, estado }) {
  const [resultado] = await pool.execute(
    "INSERT INTO productos (nombre, descripcion, precio, categoria_id, estado) VALUES (?, ?, ?, ?, ?)",
    [nombre, descripcion ?? null, precio, categoria_id, estado ?? "activo"]
  );
  return buscarPorId(resultado.insertId);
}

async function actualizar(id, { nombre, descripcion, precio, categoria_id, estado }) {
  await pool.execute(
    "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, estado = COALESCE(?, estado), updated_at = NOW() WHERE id = ?",
    [nombre, descripcion ?? null, precio, categoria_id, estado ?? null, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const registro = await buscarPorId(id);
  if (!registro) return null;

  await pool.execute("DELETE FROM productos WHERE id = ?", [id]);
  return registro;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
