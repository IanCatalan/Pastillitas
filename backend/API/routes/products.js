import express from "express";
import { Product, Price, Store } from "../../models/index;" // Importa los modelos

const router = express.Router();

// Endpoint para obtener productos según un query (búsqueda)
router.get("/", async (req, res) => {
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
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
