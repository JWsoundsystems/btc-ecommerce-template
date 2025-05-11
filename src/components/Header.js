// src/components/Header.js
// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-dark text-white p-3 mb-4">
    <div className="container d-flex justify-content-between align-items-center">
      <h1>The Basic Bitcoin E-Commerce Store</h1>
      <nav>
        <Link to="/" className="text-white me-3">Home</Link>
        <Link to="/cart" className="text-white">Cart</Link>
      </nav>
    </div>
  </header>
);

export default Header;

