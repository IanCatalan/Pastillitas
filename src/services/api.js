const API_URL = "http://localhost:3000/api/productos";

export const fetchProducts = async (params) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}?${query}`);
  return response.json();
};

export const searchProducts = async (query, params) => {
  const queryString = new URLSearchParams({ query, ...params }).toString();
  const response = await fetch(`${API_URL}/buscar?${queryString}`);
  return response.json();
};
