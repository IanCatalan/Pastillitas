import { useState } from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ setQuery }) => {
  const [input, setInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(input);
  };

  return (
    <form onSubmit={handleSearch} className={`search-bar ${styles.form}`}>
      <input
        className={styles.input}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Buscar medicamentos..."
      />
      <button
      className={styles.button}
       type="submit">🔍</button>
    </form>
  );
}; 

export default SearchBar;
