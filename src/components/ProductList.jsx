const ProductList = ({ products, loading }) => {
  if (loading) return <p>Cargando...</p>;

  if (!Array.isArray(products) || products.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div className="product-list">
      {products.map((p) => (
        <div key={p.id} className="product-item">
          <h3>{p.name}</h3>
          <p>Precio: ${p.Prices?.[0]?.price || "N/A"}</p>
          <p>Tienda: {p.Prices?.[0]?.Store?.name || "N/A"}</p>
          <p>Link : {p.Prices?.[0]?.url ? <a href={p.Prices[0].url} target="_blank" rel="noopener noreferrer">Ver producto</a> : 'No disponible'}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
