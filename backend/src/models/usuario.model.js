const pool = require("../config/db.config");

async function buscarPorEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );

  return rows[0];
}

async function buscarPorId(id) {
  const [rows] = await pool.query(
    "SELECT id, nombre, apellido, email, rol, activo FROM usuarios WHERE id = ?",
    [id]
  );

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

module.exports = {
  buscarPorEmail, crearUsuario, buscarPorId,
  
};
