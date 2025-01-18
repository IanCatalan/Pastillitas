import { useState } from "react";

const SearchBar = ({ setQuery }) => {
  const [input, setInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(input);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Buscar medicamentos..." />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchBar;
