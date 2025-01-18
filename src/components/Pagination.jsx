const Pagination = ({ totalPages, filters, setFilters }) => {
    const changePage = (newPage) => {
      setFilters((prev) => ({ ...prev, page: newPage }));
    };
  
    return (
      <div className="pagination">
        <button disabled={filters.page === 1} onClick={() => changePage(filters.page - 1)}>Anterior</button>
        <span>Página {filters.page} de {totalPages}</span>
        <button disabled={filters.page === totalPages} onClick={() => changePage(filters.page + 1)}>Siguiente</button>
      </div>
    );
  };
  
  export default Pagination;
  