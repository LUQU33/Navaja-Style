const pool = require("../config/db.config");

async function buscarPorEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );

  return rows[0];
}
async function buscarPorId(id) {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
  return rows[0];
}

async function crearUsuario(nombre, apellido, email, passwordHash, telefono) {
  const [resultado] = await pool.query(
    `INSERT INTO usuarios
      (nombre, apellido, email, password_hash, telefono)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, apellido, email, passwordHash, telefono || null]
  );

  return resultado.insertId;
}

async function actualizarPorId(id, campos) {
  const permitidos = ["nombre", "apellido", "telefono", "password_hash"];
  const sets = [];
  const valores = [];

  for (const campo of permitidos) {
    if (campos[campo] !== undefined) {
      sets.push(`${campo} = ?`);
      valores.push(campos[campo]);
    }
  }

  if (sets.length === 0) return null;

  sets.push("updated_at = NOW()");
  valores.push(id);

  await pool.query(
    `UPDATE usuarios SET ${sets.join(", ")} WHERE id = ?`,
    valores
  );

  return buscarPorId(id);
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  crearUsuario,
  actualizarPorId,
};
