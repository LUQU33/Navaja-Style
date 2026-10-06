const usuarioModel = require("../models/usuario.model");
const { generarHash } = require("../utils/password");

function bodyEsObjeto(body) {
  return body !== null && typeof body === "object" && !Array.isArray(body);
}

function emailEsValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function crear(req, res, next) {
  try {
    if (!bodyEsObjeto(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON",
      });
    }

    const { nombre, apellido, email, password, telefono } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof apellido !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Nombre, apellido, email y contraseña deben ser texto",
      });
    }

    if (
      telefono !== undefined &&
      telefono !== null &&
      typeof telefono !== "string"
    ) {
      return res.status(400).json({
        error: "El teléfono debe ser texto",
      });
    }

    const nombreNormalizado = nombre.trim();
    const apellidoNormalizado = apellido.trim();
    const emailNormalizado = email.trim().toLowerCase();

    if (
      !nombreNormalizado ||
      !apellidoNormalizado ||
      !emailNormalizado ||
      password.length === 0
    ) {
      return res.status(400).json({
        error: "Nombre, apellido, email y contraseña son obligatorios",
      });
    }

    if (nombreNormalizado.length > 100) {
      return res.status(400).json({
        error: "El nombre no puede superar los 100 caracteres",
      });
    }

    if (apellidoNormalizado.length > 100) {
      return res.status(400).json({
        error: "El apellido no puede superar los 100 caracteres",
      });
    }

    if (emailNormalizado.length > 255) {
      return res.status(400).json({
        error: "El email no puede superar los 255 caracteres",
      });
    }

    if (!emailEsValido(emailNormalizado)) {
      return res.status(400).json({
        error: "El formato del email no es válido",
      });
    }

    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({
        error: "La contraseña debe tener entre 6 y 128 caracteres",
      });
    }

    if (typeof telefono === "string" && telefono.length > 30) {
      return res.status(400).json({
        error: "El teléfono no puede superar los 30 caracteres",
      });
    }

    const usuarioExistente = await usuarioModel.buscarPorEmail(emailNormalizado);

    if (usuarioExistente) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const passwordHash = await generarHash(password);

    const id = await usuarioModel.crearUsuario(
      nombreNormalizado,
      apellidoNormalizado,
      emailNormalizado,
      passwordHash,
      telefono
    );

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id,
        nombre: nombreNormalizado,
        apellido: apellidoNormalizado,
        email: emailNormalizado,
        telefono: telefono || null,
        rol: "cliente",
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    next(error);
  }
}

async function obtenerMe(req, res, next) {
  try {
    const usuario = await usuarioModel.buscarPorId(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({
      usuario: {
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
    if (!bodyEsObjeto(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON",
      });
    }

    const { nombre, apellido, telefono, password } = req.body;
    const campos = {};

    if (nombre !== undefined) {
      if (typeof nombre !== "string" || !nombre.trim()) {
        return res.status(400).json({ error: "El nombre debe ser texto no vacío" });
      }
      if (nombre.trim().length > 100) {
        return res.status(400).json({ error: "El nombre no puede superar los 100 caracteres" });
      }
      campos.nombre = nombre.trim();
    }

    if (apellido !== undefined) {
      if (typeof apellido !== "string" || !apellido.trim()) {
        return res.status(400).json({ error: "El apellido debe ser texto no vacío" });
      }
      if (apellido.trim().length > 100) {
        return res.status(400).json({ error: "El apellido no puede superar los 100 caracteres" });
      }
      campos.apellido = apellido.trim();
    }

    if (telefono !== undefined) {
      if (telefono !== null && typeof telefono !== "string") {
        return res.status(400).json({ error: "El teléfono debe ser texto" });
      }
      if (typeof telefono === "string" && telefono.length > 30) {
        return res.status(400).json({ error: "El teléfono no puede superar los 30 caracteres" });
      }
      campos.telefono = telefono;
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6 || password.length > 128) {
        return res.status(400).json({ error: "La contraseña debe tener entre 6 y 128 caracteres" });
      }
      campos.password_hash = await generarHash(password);
    }

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({ error: "No se recibieron campos para actualizar" });
    }

    const usuario = await usuarioModel.actualizarPorId(req.usuario.id, campos);

    return res.json({
      mensaje: "Perfil actualizado correctamente",
      usuario: {
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
