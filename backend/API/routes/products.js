import express from "express";
import { Op } from "sequelize"; // Para consultas en PostgreSQL
import db from "../../models/index.js"; // Importa los modelos
import Fuse from "fuse.js"; // Para búsqueda flexible

const { Product, Price, Store } = db;
const router = express.Router();

// Configurar Fuse.js para la búsqueda de productos
let fuse = null;

// Cargar los productos en memoria para la búsqueda con Fuse.js
async function loadProducts() {
  const products = await Product.findAll({
    include: [{ model: Price, include: [Store] }],
  });
  
  // Configurar Fuse.js con las opciones de búsqueda
  fuse = new Fuse(products, {
    keys: ["name"], // Buscar solo en el nombre del producto
    threshold: 0.3, // Nivel de similitud (0 = exacto, 1 = coincidencias amplias)
    includeScore: true, // Incluye la puntuación de relevancia
  });
}

// Cargar los productos al inicio
loadProducts();

/**
 * GET /api/productos
 * Obtiene todos los productos con paginación y filtros
 */
router.get("/", async (req, res) => {
  try {
    const { orderBy, orderDirection, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    // Convertir a números
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Filtros de precio
    let priceFilter = {};
    if (minPrice) priceFilter[Op.gte] = parseFloat(minPrice);
    if (maxPrice) priceFilter[Op.lte] = parseFloat(maxPrice);

    const products = await Product.findAndCountAll({
      include: [{ 
        model: Price, 
        where: Object.keys(priceFilter).length ? { price: priceFilter } : undefined, 
        include: [Store] 
      }],
      offset,
      limit: limitNumber,
      order: orderBy === "price" ? [["Prices", "price", orderDirection === "desc" ? "DESC" : "ASC"]] : [],
    });

    res.json({
      total: products.count,
      pages: Math.ceil(products.count / limitNumber),
      currentPage: pageNumber,
      products: products.rows,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * GET /api/productos/buscar
 * Búsqueda avanzada con Fuse.js y paginación
 */
router.get("/buscar", async (req, res) => {
  try {
    const { query, orderBy, orderDirection, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Debe proporcionar un término de búsqueda." });
    }

    if (!fuse) {
      await loadProducts();
    }

    // Realizar la búsqueda con Fuse.js
    const result = fuse.search(query);
    let filteredProducts = result.map((r) => r.item); // Obtener solo los productos

    // Aplicar filtros de precio
    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter((p) => {
        const price = p.Prices?.[0]?.price || 0;
        return (!minPrice || price >= parseFloat(minPrice)) && (!maxPrice || price <= parseFloat(maxPrice));
      });
    }

    // Ordenar resultados según relevancia o precio
    if (orderBy === "price") {
      filteredProducts.sort((a, b) => {
        const priceA = a.Prices?.[0]?.price || 0;
        const priceB = b.Prices?.[0]?.price || 0;
        return orderDirection === "desc" ? priceB - priceA : priceA - priceB;
      });
    }

    // Paginación
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      total,
      pages: totalPages,
      currentPage: parseInt(page, 10),
      products: paginatedProducts,
    });
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



export default router;
