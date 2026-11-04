const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // número máximo de conexiones simultáneas
  decimalNumbers: true, // si no se especifica, pool devuelve los números decimales se devuelven como str
});

module.exports = pool;
