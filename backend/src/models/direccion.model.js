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

async function crear(usuarioId, direccion) {
  const [resultado] = await pool.query(
    `INSERT INTO direcciones
      (usuario_id, calle, numero, piso_depto, ciudad, provincia, codigo_postal, referencia)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuarioId,
      direccion.calle,
      direccion.numero,
      direccion.piso_depto || null,
      direccion.ciudad,
      direccion.provincia,
      direccion.codigo_postal,
      direccion.referencia || null,
    ]
  );

  const [rows] = await pool.query(
    `SELECT id, calle, numero, piso_depto, ciudad, provincia,
            codigo_postal, referencia, es_principal, created_at
     FROM direcciones WHERE id = ? AND usuario_id = ?`,
    [resultado.insertId, usuarioId]
  );

  return rows[0];
}

async function actualizar(id, usuarioId, campos) {
  const permitidos = ["calle", "numero", "ciudad", "provincia", "codigo_postal"];
  const nombres = permitidos.filter((campo) => campos[campo] !== undefined);
  const valores = nombres.map((campo) => campos[campo]);

  await pool.query(
    `UPDATE direcciones SET ${nombres.map((campo) => `${campo} = ?`).join(", ")}
     WHERE id = ? AND usuario_id = ?`,
    [...valores, id, usuarioId]
  );

  const [rows] = await pool.query(
    `SELECT id, calle, numero, piso_depto, ciudad, provincia,
            codigo_postal, referencia, es_principal, created_at
     FROM direcciones WHERE id = ? AND usuario_id = ?`,
    [id, usuarioId]
  );

  return rows[0];
}

module.exports = { listarPorUsuario, crear, actualizar };
