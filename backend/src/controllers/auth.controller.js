const usuarioModel = require("../models/usuario.model");
const { verificarPassword } = require("../utils/password");
const { generarToken } = require("../utils/token");

function bodyEsObjeto(body) {
  return body !== null && typeof body === "object" && !Array.isArray(body);
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

    const passwordCorrecto = await verificarPassword(
      password,
      usuario.password_hash
    );

    if (!passwordCorrecto) {
      return res.status(401).json({
        error: "Email o contraseña incorrectos",
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        error: "Usuario inactivo",
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

module.exports = {
  login,
};
