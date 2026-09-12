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

function verificarToken(token) {
  const partes = token.split(".");

  if (partes.length !== 2) {
    return null;
  }

  const payloadCodificado = partes[0];
  const firmaRecibida = partes[1];

  const firmaEsperada = crearFirma(payloadCodificado);

  const firmaRecibidaBuffer = Buffer.from(firmaRecibida);
  const firmaEsperadaBuffer = Buffer.from(firmaEsperada);

  if (firmaRecibidaBuffer.length !== firmaEsperadaBuffer.length) {
    return null;
  }

  const firmaValida = crypto.timingSafeEqual(
    firmaRecibidaBuffer,
    firmaEsperadaBuffer
  );

  if (!firmaValida) {
    return null;
  }

  const payloadTexto = Buffer.from(
    payloadCodificado,
    "base64url"
  ).toString("utf8");

  const payload = JSON.parse(payloadTexto);

  const ahora = Math.floor(Date.now() / 1000);

  if (payload.exp < ahora) {
    return null;
  }

  return payload;
}

module.exports = {
  generarToken,
  verificarToken,
};