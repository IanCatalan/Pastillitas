import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "../models/index.js"; 
const { sequelize } = db; 

import productRoutes from "./routes/products.js"; 

dotenv.config(); 

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/api/productos", productRoutes);


app.get("/", (req, res) => {
  res.send("API de Comparador de Precios funcionando");
});


app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) 
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
