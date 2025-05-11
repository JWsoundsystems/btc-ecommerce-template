// src/components/ProductDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductDetails.css';

const products = [
  { id: 1, name: 'Product 1', price: 1.00, description: 'Description of product 1', image: 'https://loremflickr.com/320/240/dog' },
  { id: 2, name: 'Product 2', price: 1.50, description: 'Description of product 2', image: 'https://loremflickr.com/320/240/cat' },
  { id: 3, name: 'Product 3', price: 2.00, description: 'Description of product 3', image: 'https://loremflickr.com/320/240/moose' },
  { id: 4, name: 'Product 4', price: 4.20, description: 'Description of product 4', image: 'https://loremflickr.com/320/240/horse' },
  { id: 5, name: 'Product 5', price: 0.69, description: 'Description of product 5', image: 'https://loremflickr.com/320/240/pig' },
  { id: 6, name: 'Product 6', price: 0.35, description: 'Description of product 6', image: 'https://loremflickr.com/320/240/wolf' },
  { id: 7, name: 'Product 7', price: 2.50, description: 'Description of product 4', image: 'https://loremflickr.com/320/240/owl' },
  { id: 8, name: 'Product 8', price: 3.00, description: 'Description of product 5', image: 'https://loremflickr.com/320/240/hawk' },
  { id: 9, name: 'Product 9', price: 3.50, description: 'Description of product 6', image: 'https://loremflickr.com/320/240/monkey' },
];

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((product) => product.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
