const pool = require("../config/db.config");

async function listar() {
  const [filas] = await pool.execute("SELECT * FROM variantes ORDER BY id");
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute("SELECT * FROM variantes WHERE id = ?", [id]);
  return filas[0];
}

async function crear({ producto_id, color_id, talle_id, sku, stock }) {
  const [resultado] = await pool.execute(
    "INSERT INTO variantes (producto_id, color_id, talle_id, sku, stock) VALUES (?, ?, ?, ?, ?)",
    [producto_id, color_id, talle_id, sku ?? null, stock ?? 0]
  );
  return buscarPorId(resultado.insertId);
}

async function actualizar(id, { producto_id, color_id, talle_id, sku, stock }) {
  await pool.execute(
    "UPDATE variantes SET producto_id = ?, color_id = ?, talle_id = ?, sku = ?, stock = COALESCE(?, stock), updated_at = NOW() WHERE id = ?",
    [producto_id, color_id, talle_id, sku ?? null, stock ?? null, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const registro = await buscarPorId(id);
  if (!registro) return null;

  await pool.execute("DELETE FROM variantes WHERE id = ?", [id]);
  return registro;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
