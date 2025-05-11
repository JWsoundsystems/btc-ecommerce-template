// src/components/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css'; // Import custom CSS

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-bar-button">Search</button>
    </form>
  );
};

export default SearchBar;
