import express from "express";
import { Op } from "sequelize"; 
import db from "../../models/index.js"; 
import Fuse from "fuse.js"; 

const { Product, Price, Store } = db;
const router = express.Router();

let fuse = null;

async function loadProducts() {
  const products = await Product.findAll({
    include: [{ model: Price, include: [Store] }],
  });
  
  fuse = new Fuse(products, {
    keys: ["name"], 
    threshold: 0.3, 
    includeScore: true, 
  });
}

loadProducts();


router.get("/", async (req, res) => {
  try {
    const { orderBy, orderDirection, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

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

router.get("/buscar", async (req, res) => {
  try {
    const { query, orderBy, orderDirection, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Debe proporcionar un término de búsqueda." });
    }

    if (!fuse) {
      await loadProducts();
    }

    const result = fuse.search(query);
    let filteredProducts = result.map((r) => r.item); 

    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter((p) => {
        const price = p.Prices?.[0]?.price || 0;
        return (!minPrice || price >= parseFloat(minPrice)) && (!maxPrice || price <= parseFloat(maxPrice));
      });
    }

    if (orderBy === "price") {
      filteredProducts.sort((a, b) => {
        const priceA = a.Prices?.[0]?.price || 0;
        const priceB = b.Prices?.[0]?.price || 0;
        return orderDirection === "desc" ? priceB - priceA : priceA - priceB;
      });
    }

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
