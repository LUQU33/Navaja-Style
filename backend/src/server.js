require("dotenv").config();

const app = require("./app");
const pool = require("./config/db.config");

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await pool.execute("SELECT 1");
    console.log("Conexion a la base de datos establecida");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

iniciar();
