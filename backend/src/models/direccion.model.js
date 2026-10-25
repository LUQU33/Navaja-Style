const pool = require("../config/db.config");

async function listarPorUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT id, calle, numero, piso_depto, ciudad, provincia,
            codigo_postal, referencia, es_principal, created_at
     FROM direcciones
     WHERE usuario_id = ?
     ORDER BY es_principal DESC, id ASC`,
    [usuarioId]
  );

  return rows;
}

module.exports = { listarPorUsuario };
