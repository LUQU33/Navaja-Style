const pool = require("../config/db.config");
const ApiError = require("../utils/ApiError");

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

async function agregarItem(usuarioId, varianteId, cantidad) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute("SELECT id FROM usuarios WHERE id = ? FOR UPDATE", [usuarioId]);

    const [variantes] = await connection.execute(
      `SELECT v.stock, p.estado
       FROM variantes v
       JOIN productos p ON p.id = v.producto_id
       WHERE v.id = ? FOR UPDATE`,
      [varianteId]
    );

    if (variantes.length === 0 || variantes[0].estado !== "activo") {
      throw new ApiError(404, "Variante no disponible");
    }

    const [carritos] = await connection.execute(
      "SELECT id FROM carritos WHERE usuario_id = ? ORDER BY id LIMIT 1",
      [usuarioId]
    );
    let carritoId = carritos[0]?.id;
    let cantidadActual = 0;

    if (carritoId) {
      const [items] = await connection.execute(
        "SELECT cantidad FROM carrito_items WHERE carrito_id = ? AND variante_id = ?",
        [carritoId, varianteId]
      );
      cantidadActual = items[0]?.cantidad || 0;
    }

    if (cantidadActual + cantidad > variantes[0].stock) {
      throw new ApiError(400, "Stock insuficiente");
    }

    if (!carritoId) {
      const [resultado] = await connection.execute(
        "INSERT INTO carritos (usuario_id) VALUES (?)",
        [usuarioId]
      );
      carritoId = resultado.insertId;
    }

    await connection.execute(
      `INSERT INTO carrito_items (carrito_id, variante_id, cantidad)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
      [carritoId, varianteId, cantidad, cantidad]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return obtenerPorUsuario(usuarioId);
}

async function actualizarItem(usuarioId, itemId, cantidad) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute("SELECT id FROM usuarios WHERE id = ? FOR UPDATE", [usuarioId]);

    const [items] = await connection.execute(
      `SELECT ci.carrito_id, ci.variante_id
       FROM carrito_items ci
       JOIN carritos c ON c.id = ci.carrito_id
       WHERE ci.id = ? AND c.usuario_id = ? FOR UPDATE`,
      [itemId, usuarioId]
    );

    if (items.length === 0) {
      throw new ApiError(404, "Artículo no encontrado en el carrito");
    }

    const [variantes] = await connection.execute(
      `SELECT v.stock, p.estado
       FROM variantes v
       JOIN productos p ON p.id = v.producto_id
       WHERE v.id = ? FOR UPDATE`,
      [items[0].variante_id]
    );

    if (variantes.length === 0 || variantes[0].estado !== "activo") {
      throw new ApiError(404, "Variante no disponible");
    }
    if (cantidad > variantes[0].stock) {
      throw new ApiError(400, "Stock insuficiente");
    }

    await connection.execute(
      "UPDATE carrito_items SET cantidad = ? WHERE id = ? AND carrito_id = ?",
      [cantidad, itemId, items[0].carrito_id]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return obtenerPorUsuario(usuarioId);
}

async function eliminarItem(usuarioId, itemId) {
  const [resultado] = await pool.execute(
    `DELETE ci FROM carrito_items ci
     JOIN carritos c ON c.id = ci.carrito_id
     WHERE ci.id = ? AND c.usuario_id = ?`,
    [itemId, usuarioId]
  );

  return resultado.affectedRows > 0;
}

module.exports = { obtenerPorUsuario, agregarItem, actualizarItem, eliminarItem };
