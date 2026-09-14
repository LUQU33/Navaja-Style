const pool = require("../config/db");

async function buscarPorEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
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
  buscarPorEmail,crearUsuario,
  
};
