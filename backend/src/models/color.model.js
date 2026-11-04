const pool = require("../config/db.config");

async function listar() {
  const [filas] = await pool.execute("SELECT * FROM colores ORDER BY id");
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute("SELECT * FROM colores WHERE id = ?", [id]);
  return filas[0];
}

async function crear({ nombre, hex }) {
  const [resultado] = await pool.execute(
    "INSERT INTO colores (nombre, hex) VALUES (?, ?)",
    [nombre, hex ?? null]
  );
  return buscarPorId(resultado.insertId);
}

async function actualizar(id, { nombre, hex }) {
  await pool.execute(
    "UPDATE colores SET nombre = ?, hex = ? WHERE id = ?",
    [nombre, hex ?? null, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const registro = await buscarPorId(id);
  if (!registro) return null;

  await pool.execute("DELETE FROM colores WHERE id = ?", [id]);
  return registro;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
