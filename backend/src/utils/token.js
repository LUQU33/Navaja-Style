const crypto = require("crypto");

const SECRETO = process.env.AUTH_SECRET;
const DURACION_SEGUNDOS = 60 * 60;

function base64Url(texto) {
  return Buffer.from(texto).toString("base64url");
}

function crearFirma(datos) {
  return crypto
    .createHmac("sha256", SECRETO)
    .update(datos)
    .digest("base64url");
}

function generarToken(usuario) {
  const ahora = Math.floor(Date.now() / 1000);

  const payload = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
    exp: ahora + DURACION_SEGUNDOS,
  };

  const payloadCodificado = base64Url(JSON.stringify(payload));
  const firma = crearFirma(payloadCodificado);

  return payloadCodificado + "." + firma;
}

module.exports = {
  generarToken,
};