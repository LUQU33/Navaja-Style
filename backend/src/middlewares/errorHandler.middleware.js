const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Error interno del servidor";

  if (!(err instanceof ApiError)) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = { notFound, errorHandler };
