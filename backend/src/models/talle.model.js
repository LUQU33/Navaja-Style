const pool = require("../config/db.config");

async function listar() {
  const [filas] = await pool.execute("SELECT * FROM talles ORDER BY id");
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute("SELECT * FROM talles WHERE id = ?", [id]);
  return filas[0];
}

async function crear({ nombre, orden }) {
  const [resultado] = await pool.execute(
    "INSERT INTO talles (nombre, orden) VALUES (?, ?)",
    [nombre, orden ?? 0]
  );
  return buscarPorId(resultado.insertId);
}

async function actualizar(id, { nombre, orden }) {
  await pool.execute(
    "UPDATE talles SET nombre = ?, orden = COALESCE(?, orden) WHERE id = ?",
    [nombre, orden ?? null, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const registro = await buscarPorId(id);
  if (!registro) return null;

  await pool.execute("DELETE FROM talles WHERE id = ?", [id]);
  return registro;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
