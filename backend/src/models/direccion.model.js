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
  const permitidos = [
    "calle", "numero", "piso_depto", "ciudad", "provincia",
    "codigo_postal", "referencia",
  ];
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

async function eliminar(id, usuarioId) {
  const [resultado] = await pool.query(
    "DELETE FROM direcciones WHERE id = ? AND usuario_id = ?",
    [id, usuarioId]
  );

  return resultado.affectedRows > 0;
}

async function marcarPrincipal(id, usuarioId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("SELECT id FROM usuarios WHERE id = ? FOR UPDATE", [usuarioId]);

    const [existentes] = await connection.query(
      "SELECT id FROM direcciones WHERE id = ? AND usuario_id = ? FOR UPDATE",
      [id, usuarioId]
    );

    if (existentes.length === 0) {
      await connection.rollback();
      return null;
    }

    await connection.query(
      "UPDATE direcciones SET es_principal = FALSE WHERE usuario_id = ? AND es_principal = TRUE",
      [usuarioId]
    );
    const [resultado] = await connection.query(
      "UPDATE direcciones SET es_principal = TRUE WHERE id = ? AND usuario_id = ?",
      [id, usuarioId]
    );

    if (resultado.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    const [rows] = await connection.query(
      `SELECT id, calle, numero, piso_depto, ciudad, provincia,
              codigo_postal, referencia, es_principal, created_at
       FROM direcciones WHERE id = ? AND usuario_id = ?`,
      [id, usuarioId]
    );

    await connection.commit();
    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { listarPorUsuario, crear, actualizar, eliminar, marcarPrincipal };
