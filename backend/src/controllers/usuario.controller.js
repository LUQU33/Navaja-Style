const usuarioModel = require("../models/usuario.model");
const { generarHash } = require("../utils/password");

async function crear(req, res, next) {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;

    const usuarioExistente = await usuarioModel.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({ success: false, message: "El email ya está registrado" });
    }

    const passwordHash = await generarHash(password);

    const id = await usuarioModel.crearUsuario(
      nombre,
      apellido,
      email,
      passwordHash,
      telefono
    );

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        id,
        nombre,
        apellido,
        email,
        telefono: telefono || null,
        rol: "cliente",
      },
    });
  } catch (error) {
    next(error);
  }
}

async function obtenerMe(req, res, next) {
  try {
    const usuario = await usuarioModel.buscarPorId(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    return res.json({
      success: true,
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        activo: usuario.activo,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function actualizarMe(req, res, next) {
  try {
    const { nombre, apellido, telefono, password } = req.body;
    const campos = { nombre, apellido, telefono };

    if (password !== undefined) {
      campos.password_hash = await generarHash(password);
    }

    const usuario = await usuarioModel.actualizarPorId(req.usuario.id, campos);

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: "No se recibieron campos para actualizar",
      });
    }

    return res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crear,
  obtenerMe,
  actualizarMe,
};
