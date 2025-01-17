const API_URL = "http://localhost:3000/api/products"; // Ajusta según tu backend

export const fetchAllProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error obteniendo productos");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchAllProducts:", error);
    return [];
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_URL}/buscar?query=${query}`);
    if (!response.ok) throw new Error("Error buscando productos");
    return await response.json();
  } catch (error) {
    console.error("Error en searchProducts:", error);
    return [];
  }
};
