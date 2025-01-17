const API_URL = "http://localhost:4000/api/products";

/**
 * Obtiene productos desde la API según un término de búsqueda.
 * @param {string} query - Medicamento a buscar.
 * @returns {Promise<Array>} - Lista de productos encontrados.
 */
export async function fetchProducts(query) {
  try {
    const response = await fetch(`${API_URL}?query=${query}`);
    if (!response.ok) throw new Error("Error al obtener los datos");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchProducts:", error);
    return [];
  }
}
