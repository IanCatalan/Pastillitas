import { useState, useEffect } from "react";
import { fetchProducts, searchProducts } from "../services/api.js";
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    orderBy: "relevance",
    orderDirection: "asc",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 15,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = query
        ? await searchProducts(query, filters)
        : await fetchProducts(filters);
      setProducts(data.products || []); // Si data.products es undefined, usa []
      setTotalPages(data.pages || 1); // Si data.pages es undefined, usa 1
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]); // Evita que sea undefined en caso de error
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [query, filters]);

  return {
    products,
    totalPages,
    loading,
    query,
    setQuery,
    filters,
    setFilters,
  };
};
