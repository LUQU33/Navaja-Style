const pool = require("../config/db");

async function crear({ nombre }) {
  const [resultado] = await pool.query(
    `INSERT INTO categorias (nombre)
    VALUES (?)`,
    [nombre]
  );

  return buscarPorId(resultado.insertId)
}

async function listar() {
  const [rows] = await pool.query("SELECT * FROM categorias ORDER BY id");
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
  return rows[0];
}

async function eliminarPorId(id) {
  const categoria = await buscarPorId(id);
  if (!categoria) return null;

  await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
  return categoria;
}

async function actualizarPorId(id, campos) {
  const permitidos = ["nombre"];
  const sets = [];
  const valores = [];

  for (const campo of permitidos) {
    if (campos[campo] !== undefined) {
      sets.push(`${campo} = ?`);
      valores.push(campos[campo]);
    }
  }

  if (sets.length === 0) return null;
  
  valores.push(id);

  await pool.query(
    `UPDATE categorias SET ${sets.join(", ")} WHERE id = ?`,
    valores
  );

  return buscarPorId(id);
}

module.exports = { crear, listar, buscarPorId, eliminarPorId, actualizarPorId };

