const Filters = ({ filters, setFilters }) => {
    const handleChange = (e) => {
      setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleStore = (e) => {
        
    }
  
    return (
      <div className="filters">
        <select name="orderBy" value={filters.orderBy} onChange={handleChange}>
          <option value="relevance">Relevancia</option>
          <option value="price">Precio</option>
        </select>
  
        <select name="orderDirection" value={filters.orderDirection} onChange={handleChange}>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

        <select name="store" value={filters.Store} onChange={handleChange}>
          <option value="relevance">Relevancia</option>
          <option value="price">Precio</option>
        </select>
  
        <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder="Precio Mínimo" />
        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="Precio Máximo" />
      </div>
    );
  };
  
  export default Filters;
  