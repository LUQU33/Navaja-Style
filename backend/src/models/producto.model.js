const pool = require("../config/db.config");

async function listar() {
  const [filas] = await pool.execute("SELECT * FROM productos ORDER BY id");
  return filas;
}

async function listarCatalogo({ categoriaId, soloActivos }) {
  const [productos] = await pool.execute(
    `SELECT p.id, p.nombre, p.precio, p.estado, p.categoria_id, c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE (? = 0 OR p.estado = 'activo') AND (? IS NULL OR p.categoria_id = ?)
      ORDER BY p.id`,
    [soloActivos ? 1 : 0, categoriaId ?? null, categoriaId ?? null]
  );
  return productos;
}

// Vista publica (soloActivos=true): solo variantes con stock, sin stock ni sku.
// Vista admin (soloActivos=false): todas las variantes, con stock y sku.
async function buscarDetalle(id, { soloActivos }) {
  const [filas] = await pool.execute(
    `SELECT p.id, p.nombre, p.descripcion, p.precio, p.estado, p.categoria_id,
            c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE p.id = ? AND (? = 0 OR p.estado = 'activo')`,
    [id, soloActivos ? 1 : 0]
  );
  const producto = filas[0];
  if (!producto) return undefined;

  const [variantes] = await pool.execute(
    `SELECT v.id, v.sku, v.stock,
            co.id AS color_id, co.nombre AS color_nombre, co.hex AS color_hex,
            t.id AS talle_id, t.nombre AS talle_nombre, t.orden AS talle_orden
      FROM variantes v
      JOIN colores co ON co.id = v.color_id
      JOIN talles t ON t.id = v.talle_id
      WHERE v.producto_id = ? AND (? = 0 OR v.stock > 0)
      ORDER BY t.orden, co.nombre`,
    [id, soloActivos ? 1 : 0]
  );

  return {
    ...producto,
    variantes: variantes.map((v) => ({
      id: v.id,
      ...(soloActivos ? {} : { sku: v.sku, stock: v.stock }),
      color: { id: v.color_id, nombre: v.color_nombre, hex: v.color_hex },
      talle: { id: v.talle_id, nombre: v.talle_nombre, orden: v.talle_orden },
    })),
  };
}

async function buscarPorId(id) {
  const [filas] = await pool.execute("SELECT * FROM productos WHERE id = ?", [id]);
  return filas[0];
}

async function crear({ nombre, descripcion, precio, categoria_id, estado }) {
  const [resultado] = await pool.execute(
    "INSERT INTO productos (nombre, descripcion, precio, categoria_id, estado) VALUES (?, ?, ?, ?, ?)",
    [nombre, descripcion ?? null, precio, categoria_id, estado ?? "activo"]
  );
  return buscarPorId(resultado.insertId);
}

async function actualizar(id, { nombre, descripcion, precio, categoria_id, estado }) {
  await pool.execute(
    "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, estado = COALESCE(?, estado), updated_at = NOW() WHERE id = ?",
    [nombre, descripcion ?? null, precio, categoria_id, estado ?? null, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const registro = await buscarPorId(id);
  if (!registro) return null;

  await pool.execute("DELETE FROM productos WHERE id = ?", [id]);
  return registro;
}

module.exports = { listar, listarCatalogo, buscarDetalle, buscarPorId, crear, actualizar, eliminar };
