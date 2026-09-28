const usuarioModel = require("../models/usuario.model");
const {
  generarHash,
  verificarPassword,
} = require("../utils/password");
const { generarToken } = require("../utils/token");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña son obligatorios",
      });
    }

    const usuario = await usuarioModel.buscarPorEmail(email);

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
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
    } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        error: "Nombre, apellido, email y contraseña son obligatorios",
      });
    }

    const usuarioExistente = await usuarioModel.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({
        error: "El email ya está registrado",
      });
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
      mensaje: "Usuario registrado correctamente",
      usuario: {
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