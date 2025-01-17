import express from "express";
import { Op } from "sequelize"; // Importa Op para las búsquedas
import db from "../../models/index.js"; // Importa los modelos

const { Product, Price, Store } = db; // Obtiene los modelos
const router = express.Router();

/**
 * GET /api/productos
 * Obtiene todos los productos con sus precios y tiendas asociadas
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Price,
          include: [Store], // Incluye la tienda asociada al precio
        },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * GET /api/productos/buscar
 * Obtiene productos según un query (búsqueda por nombre)
 */
router.get("/buscar", async (req, res) => {
  try {
    const { query } = req.query; // Obtiene el término de búsqueda

    if (!query) {
      return res.status(400).json({ error: "Debe proporcionar un término de búsqueda." });
    }

    // Busca los productos cuyo nombre contenga el query
    const products = await Product.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }, // Búsqueda insensible a mayúsculas/minúsculas
      },
      include: [
        {
          model: Price,
          include: [Store], // Incluye la tienda asociada al precio
        },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error("Error al buscar los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
