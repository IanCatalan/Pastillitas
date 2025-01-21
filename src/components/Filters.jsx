import styles from "./Filters.module.css";
const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={`filters ${styles.filters}`}>
      <select
        name="orderBy"
        value={filters.orderBy}
        onChange={handleChange}
        className={styles.selectRelevance}
      >
        <option value="relevance">Relevancia</option>
        <option value="price">Precio</option>
      </select>

      <select
        name="orderDirection"
        value={filters.orderDirection}
        onChange={handleChange}
        className={styles.selectOrder}
      >
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>

      <input
        type="number"
        name="minPrice"
        className={styles.inputMin}
        value={filters.minPrice}
        onChange={handleChange}
        placeholder="Precio Mínimo"
      />
      <input
        className={styles.inputMax}
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleChange}
        placeholder="Precio Máximo"
      />
    </div>
  );
};

export default Filters;
