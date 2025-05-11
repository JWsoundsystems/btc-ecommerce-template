import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import ProductDetails from './components/ProductDetails';
import SearchBar from './components/SearchBar';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <CartProvider>
      <Router>
        <div id="root">
          <Header />
          <main className="container my-4">
            <ConditionalSortSearchContainer onSearch={handleSearch} sort={sort} onSortChange={handleSortChange} />
            <Routes>
              <Route path="/" element={<ProductList searchQuery={searchQuery} sort={sort} />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

const ConditionalSortSearchContainer = ({ onSearch, sort, onSortChange }) => {
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <div className="sort-search-container">
      <div className="sort">
        <h5>Sort By</h5>
        <select value={sort} onChange={onSortChange}>
          <option value="">None</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>
      <SearchBar onSearch={onSearch} />
    </div>
  );
};

export default App;
