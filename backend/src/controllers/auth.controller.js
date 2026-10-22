const usuarioModel = require("../models/usuario.model");
const { verificarPassword } = require("../utils/password");
const { generarToken } = require("../utils/token");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Email o contraseña incorrectos",
      });
    }

    const passwordCorrecto = await verificarPassword(
      password,
      usuario.password_hash
    );

    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        message: "Email o contraseña incorrectos",
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo",
      });
    }

    const token = generarToken(usuario);

    return res.json({
      success: true,
      message: "Login correcto",
      data: {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
};
