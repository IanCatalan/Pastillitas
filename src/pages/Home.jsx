import { useFetchProducts } from "../hooks/useFetchProducts";
import SearchBar from "../components/SearchBar";
import ProductList from "../components/ProductList";

function Home() {
  const { products, getProducts } = useFetchProducts(); // Usamos el hook

  return (
    <div>
      <h1>Comparador de Precios de Medicamentos</h1>
      <SearchBar onSearch={getProducts} />
      <ProductList products={products} />
    </div>
  );
}

export default Home;
