import { useProducts } from "../hooks/useProducts.js";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import styles from "./Home.module.css";

const Home = () => {
  const { products, totalPages, loading, query, setQuery, filters, setFilters } = useProducts();
  return (
    <div className="home">
      <h1 className={styles.title}>Comparador de Medicamentos</h1>
      <SearchBar setQuery={setQuery} />
      <Filters filters={filters} setFilters={setFilters} />
      <ProductList products={products} loading={loading} />
      <Pagination totalPages={totalPages} filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default Home;
