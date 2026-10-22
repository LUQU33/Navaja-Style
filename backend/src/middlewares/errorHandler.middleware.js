const ApiError = require("../utils/ApiError");

const ERRORES_MYSQL = {
  ER_DUP_ENTRY: [409, "Ya existe un registro con ese valor"],
  ER_ROW_IS_REFERENCED_2: [
    409,
    "No se puede eliminar o modificar: hay registros asociados",
  ],
  ER_NO_REFERENCED_ROW_2: [400, "Se hace referencia a un registro inexistente"],
  ER_CHECK_CONSTRAINT_VIOLATED: [400, "Los datos no cumplen las restricciones"],
};

function notFound(req, res, next) {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = "Error interno del servidor";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (ERRORES_MYSQL[err.code]) {
    [statusCode, message] = ERRORES_MYSQL[err.code];
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "El cuerpo de la solicitud no es un JSON válido";
  } else {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
