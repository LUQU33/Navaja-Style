const usuarioModel = require("../models/usuario.model");
const { verificarPassword } = require("../utils/password");
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

module.exports = {
  login,
};