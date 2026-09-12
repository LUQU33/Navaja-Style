const { verificarToken } = require("../utils/token");

function verificarAutenticacion(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: "Token no enviado",
    });
  }

  const partes = header.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      error: "Formato de token invalido",
    });
  }

  const token = partes[1];

  const payload = verificarToken(token);

  if (!payload) {
    return res.status(401).json({
      error: "Token invalido o vencido",
    });
  }

  req.usuario = payload;

  next();
}

module.exports = {
  verificarAutenticacion,
};