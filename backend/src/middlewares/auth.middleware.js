const { verificarToken } = require("../utils/token");

function verificarAutenticacion(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      success: false,
      message: "Token no enviado",
    });
  }

  const partes = header.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Formato de token invalido",
    });
  }

  const token = partes[1];

  const payload = verificarToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Token invalido o vencido",
    });
  }

  req.usuario = payload;

  next();
}

function soloAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso restringido a administradores",
    });
  }

  next();
}

module.exports = {
  verificarAutenticacion,
  soloAdmin,
};