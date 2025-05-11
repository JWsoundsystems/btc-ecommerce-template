// src/components/ProductList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Modal from './Modal';
import './ProductList.css';
import img1 from '../assets/btcman/001.png';
import img2 from '../assets/btcman/002.png';
import img3 from '../assets/btcman/003.png';
import img4 from '../assets/btcman/004.png';
import img5 from '../assets/btcman/005.png';
import img6 from '../assets/btcman/006.png';
import img7 from '../assets/btcman/007.png';
import img8 from '../assets/btcman/008.png';
import img9 from '../assets/btcman/009.png';


const products = [
  { id: 1, name: 'Product 1', price: 1.00, description: 'Description of product 1', image: img1 },
  { id: 2, name: 'Product 2', price: 1.50, description: 'Description of product 2', image: img2 },
  { id: 3, name: 'Product 3', price: 2.00, description: 'Description of product 3', image: img3 },
  { id: 4, name: 'Product 4', price: 4.20, description: 'Description of product 4', image: img4 },
  { id: 5, name: 'Product 5', price: 0.69, description: 'Description of product 5', image: img5 },
  { id: 6, name: 'Product 6', price: 0.35, description: 'Description of product 6', image: img6 },
  { id: 7, name: 'Product 7', price: 2.50, description: 'Description of product 4', image: img7 },
  { id: 8, name: 'Product 8', price: 3.00, description: 'Description of product 5', image: img8 },
  { id: 9, name: 'Product 9', price: 3.50, description: 'Description of product 6', image: img9 },
];

const ProductList = ({ searchQuery, sort }) => {
  const { addToCart, modal, closeModal } = useCart();

  const filteredProducts = products
    .sort((a, b) => {
      if (sort === 'priceAsc') return a.price - b.price;
      if (sort === 'priceDesc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    })
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="row justify-content-center">
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4 d-flex justify-content-center" key={product.id}>
            <div className="product-card">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="product-card-title">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h5>
                <p className="product-card-price">${product.price.toFixed(2)}</p>
                <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && <Modal show={modal.show} message={modal.message} onClose={closeModal} />}
    </div>
  );
};

export default ProductList;
