const { param, validationResult } = require("express-validator");

const validarId = param("id", "El id debe ser un entero positivo").isInt({ min: 1 });

function verificarValidaciones(req, res, next) {
  const validacion = validationResult(req);

  if (!validacion.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Falla de validacion",
      errores: validacion.array({ onlyFirstError: true }),
    });
  }

  next();
}

module.exports = { validarId, verificarValidaciones };
