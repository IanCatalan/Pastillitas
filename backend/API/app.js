import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "../models/index.js"; 
const { sequelize } = db; // Obtiene la instancia de Sequelize

import productRoutes from "./routes/products.js"; // Importamos las rutas

dotenv.config(); // Carga las variables de entorno

const app = express();

// 🔹 Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en las peticiones

// 🔹 Rutas
app.use("/api/products", productRoutes);

// 🔹 Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Comparador de Precios funcionando");
});

// 🔹 Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 🔹 Manejo de errores generales
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) // Conecta la base de datos sin eliminar datos
  .then(() => {
    console.log("Base de datos sincronizada 🚀");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar la base de datos:", error);
  });

export default app;
