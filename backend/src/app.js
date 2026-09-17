const express = require("express");
const routes = require("./routes");
const logger = require("./middlewares/logger.middleware");
const { notFound, errorHandler } = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(logger);
app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
