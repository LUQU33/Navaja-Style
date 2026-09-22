const pool = require("../config/db.config");

function crearModeloCRUD({ tabla, camposCreables, camposActualizables, conTimestamps = false }) {
  async function crear(datos) {
    const campos = [];
    const marcadores = [];
    const valores = [];

    for (const campo of camposCreables) {
      if (datos[campo] !== undefined) {
        campos.push(campo);
        marcadores.push("?");
        valores.push(datos[campo]);
      }
    }

    const [resultado] = await pool.query(
      `INSERT INTO ${tabla} (${campos.join(", ")}) VALUES (${marcadores.join(", ")})`,
      valores
    );

    return buscarPorId(resultado.insertId);
  }

  async function listar() {
    const [rows] = await pool.query(`SELECT * FROM ${tabla} ORDER BY id`);
    return rows;
  }

  async function buscarPorId(id) {
    const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id]);
    return rows[0];
  }

  async function eliminarPorId(id) {
    const registro = await buscarPorId(id);
    if (!registro) return null;

    await pool.query(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
    return registro;
  }

  async function actualizarPorId(id, campos) {
    const sets = [];
    const valores = [];

    for (const campo of camposActualizables) {
      if (campos[campo] !== undefined) {
        sets.push(`${campo} = ?`);
        valores.push(campos[campo]);
      }
    }

    if (sets.length === 0) return null;

    if (conTimestamps) sets.push("updated_at = NOW()");

    valores.push(id);

    await pool.query(
      `UPDATE ${tabla} SET ${sets.join(", ")} WHERE id = ?`,
      valores
    );

    return buscarPorId(id);
  }

  return { crear, listar, buscarPorId, eliminarPorId, actualizarPorId };
}

module.exports = { crearModeloCRUD };
