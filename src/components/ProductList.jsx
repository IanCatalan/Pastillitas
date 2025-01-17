import { useEffect, useState } from "react";
import { fetchAllProducts, searchProducts } from "../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAllProducts().then(setProducts);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      const results = await searchProducts(query);
      setProducts(results);
    } else {
      fetchAllProducts().then(setProducts);
    }
  };

  return (
    <div>
      <h2>Comparar Precios de Medicamentos</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar medicamento..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <ul>
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          products.map((product) => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <ul>
                {product.Prices.map((price) => (
                  <li key={price.id}>
                    {price.store?.name}: ${price.price}
                    <a href={price.url} target="_blank" rel="noopener noreferrer">
                      Ver en tienda
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProductList;
