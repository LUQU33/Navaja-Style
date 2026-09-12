const crypto = require("crypto");

function generarHash(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (error, hash) => {
      if (error) {
        return reject(error);
      }

      const passwordGuardado = salt + ":" + hash.toString("hex");

      resolve(passwordGuardado);
    });
  });
}

function verificarPassword(password, passwordGuardado) {
  return new Promise((resolve, reject) => {
    const partes = passwordGuardado.split(":");

    const salt = partes[0];
    const hashGuardado = partes[1];

    if (!salt || !hashGuardado) {
      return resolve(false);
    }

    crypto.scrypt(password, salt, 64, (error, hashCalculado) => {
      if (error) {
        return reject(error);
      }

      const hashBuffer = Buffer.from(hashGuardado, "hex");

      if (hashBuffer.length !== hashCalculado.length) {
        return resolve(false);
      }

      const coinciden = crypto.timingSafeEqual(
        hashBuffer,
        hashCalculado
      );

      resolve(coinciden);
    });
  });
}

module.exports = {
  generarHash,
  verificarPassword,
};