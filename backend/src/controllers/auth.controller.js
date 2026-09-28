const usuarioModel = require("../models/usuario.model");
const {
  generarHash,
  verificarPassword,
} = require("../utils/password");
const { generarToken } = require("../utils/token");

function bodyEsObjeto(body) {
  return body !== null && typeof body === "object" && !Array.isArray(body);
}

function emailEsValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function login(req, res, next) {
  try {
    if (!bodyEsObjeto(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON",
      });
    }

    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        error: "Email y contraseña deben ser texto",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado || password.length === 0) {
      return res.status(400).json({
        error: "Email y contraseña son obligatorios",
      });
    }

    const usuario = await usuarioModel.buscarPorEmail(emailNormalizado);

    if (!usuario) {
      return res.status(401).json({
        error: "Email o contraseña incorrectos",
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        error: "Usuario inactivo",
      });
    }

    const passwordCorrecto = await verificarPassword(
      password,
      usuario.password_hash
    );

    if (!passwordCorrecto) {
      return res.status(401).json({
        error: "Email o contraseña incorrectos",
      });
    }

    const token = generarToken(usuario);

    return res.json({
      mensaje: "Login correcto",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    if (!bodyEsObjeto(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON",
      });
    }

    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
    } = req.body;

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
      return res.status(409).json({
        error: "El email ya está registrado",
      });
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
    next(error);
  }
}

function me(req, res) {
  return res.json({
    usuario: req.usuario,
  });
}

module.exports = {
  login,
  register,
  me,
};
