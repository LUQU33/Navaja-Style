const pool = require("../config/db.config");

async function listar() {
  const [filas] = await pool.execute("SELECT * FROM metodos_pago ORDER BY id");
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute("SELECT * FROM metodos_pago WHERE id = ?", [id]);
  return filas[0];
}

async function crear({ codigo, nombre_visible, activo, orden }) {
  const [resultado] = await pool.execute(
    "INSERT INTO metodos_pago (codigo, nombre_visible, activo, orden) VALUES (?, ?, ?, ?)",
    [codigo, nombre_visible, activo ?? true, orden ?? 0]
  );
  return buscarPorId(resultado.insertId);
}

async function actualizar(id, { codigo, nombre_visible, activo, orden }) {
  await pool.execute(
    "UPDATE metodos_pago SET codigo = ?, nombre_visible = ?, activo = COALESCE(?, activo), orden = COALESCE(?, orden) WHERE id = ?",
    [codigo, nombre_visible, activo ?? null, orden ?? null, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const registro = await buscarPorId(id);
  if (!registro) return null;

  await pool.execute("DELETE FROM metodos_pago WHERE id = ?", [id]);
  return registro;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
