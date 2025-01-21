import styles from "./Pagination.module.css";
const Pagination = ({ totalPages, filters, setFilters }) => {
  const changePage = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className={`pagination ${styles.pagination}`}>
      <button
        className={styles.buttonPrev}
        disabled={filters.page === 1}
        onClick={() => changePage(filters.page - 1)}
      >
        Anterior
      </button>
      <span className={styles.pageNumber}>
        Página {filters.page} de {totalPages}
      </span>
      <button
        className={styles.buttonNext}
        disabled={filters.page === totalPages}
        onClick={() => changePage(filters.page + 1)}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
