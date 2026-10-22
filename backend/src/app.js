const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const logger = require("./middlewares/logger.middleware");
const { notFound, errorHandler } = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
