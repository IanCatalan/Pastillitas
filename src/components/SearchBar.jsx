import { useState } from "react";


function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query); // Llama a `getProducts(query)`
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Buscar medicamento..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;
