const pool = require("../config/db.config");

async function listar() {
  const [filas] = await pool.execute("SELECT * FROM categorias ORDER BY id");
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute("SELECT * FROM categorias WHERE id = ?", [id]);
  return filas[0];
}

async function crear({ nombre }) {
  const [resultado] = await pool.execute(
    "INSERT INTO categorias (nombre) VALUES (?)",
    [nombre]
  );
  return buscarPorId(resultado.insertId);
}

async function actualizar(id, { nombre }) {
  await pool.execute(
    "UPDATE categorias SET nombre = ? WHERE id = ?",
    [nombre, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const registro = await buscarPorId(id);
  if (!registro) return null;

  await pool.execute("DELETE FROM categorias WHERE id = ?", [id]);
  return registro;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
