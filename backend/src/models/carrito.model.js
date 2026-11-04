const pool = require("../config/db.config");

async function obtenerPorUsuario(usuarioId) {
  const [carritos] = await pool.execute(
    "SELECT id FROM carritos WHERE usuario_id = ? ORDER BY id LIMIT 1",
    [usuarioId]
  );

  if (carritos.length === 0) {
    return { id: null, items: [] };
  }

  const [items] = await pool.execute(
    `SELECT ci.id, ci.variante_id, ci.cantidad,
            p.id AS producto_id, p.nombre AS producto_nombre, p.precio,
            co.id AS color_id, co.nombre AS color,
            t.id AS talle_id, t.nombre AS talle
     FROM carrito_items ci
     JOIN variantes v ON v.id = ci.variante_id
     JOIN productos p ON p.id = v.producto_id
     JOIN colores co ON co.id = v.color_id
     JOIN talles t ON t.id = v.talle_id
     WHERE ci.carrito_id = ?
     ORDER BY ci.id`,
    [carritos[0].id]
  );

  return { id: carritos[0].id, items };
}

module.exports = { obtenerPorUsuario };
