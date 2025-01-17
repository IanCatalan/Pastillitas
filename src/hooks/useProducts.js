import { useState } from "react";
import { fetchProducts } from "../services/api"; // Importamos la API

export function useFetchProducts() {
  const [products, setProducts] = useState([]);

  const getProducts = async (query) => {
    const data = await fetchProducts(query);
    setProducts(data);
  };

  return { products, getProducts };
}
