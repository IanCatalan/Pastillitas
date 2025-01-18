import { useProducts } from "../hooks/useProducts.js";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";

const Home = () => {
  const { products, totalPages, loading, query, setQuery, filters, setFilters } = useProducts();
  return (
    <div className="home">
      <h1>Comparador de Medicamentos</h1>
      <SearchBar setQuery={setQuery} />
      <Filters filters={filters} setFilters={setFilters} />
      <ProductList products={products} loading={loading} />
      <Pagination totalPages={totalPages} filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default Home;
