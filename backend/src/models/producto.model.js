const pool = require("../config/db");

async function crear({ nombre, descripcion, precio, categoria_id }) {
  const [resultado] = await pool.query(
    `INSERT INTO productos (nombre, descripcion, precio, categoria_id)
     VALUES (?, ?, ?, ?)`,
    [nombre, descripcion, precio, categoria_id]
  );

  return buscarPorId(resultado.insertId);
}

async function listar() {
  const [rows] = await pool.query("SELECT * FROM productos ORDER BY id");
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
  return rows[0];
}

async function eliminarPorId(id) {
  const producto = await buscarPorId(id);
  if (!producto) return null;

  await pool.query("DELETE FROM productos WHERE id = ?", [id]);
  return producto;
}

async function actualizarPorId(id, campos) {
  const permitidos = ["nombre", "descripcion", "precio", "categoria_id", "estado"];
  const sets = [];
  const valores = [];

  for (const campo of permitidos) {
    if (campos[campo] !== undefined) {
      sets.push(`${campo} = ?`);
      valores.push(campos[campo]);
    }
  }

  if (sets.length === 0) return null;

  sets.push(`updated_at = NOW()`);
  valores.push(id);

  await pool.query(
    `UPDATE productos SET ${sets.join(", ")} WHERE id = ?`,
    valores
  );

  return buscarPorId(id);
}

module.exports = { crear, listar, buscarPorId, eliminarPorId, actualizarPorId };
