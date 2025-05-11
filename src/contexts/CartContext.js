// src/contexts/CartContext.js
import React, { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        const updatedCartItems = state.cartItems.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { ...state, cartItems: updatedCartItems };
      } else {
        const updatedCart = [...state.cartItems, { ...action.payload, quantity: 1 }];
        return { ...state, cartItems: updatedCart };
      }
    case 'REMOVE_FROM_CART':
      const filteredCart = state.cartItems.filter(item => item.id !== action.payload);
      return { ...state, cartItems: filteredCart };
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });
  const [modal, setModal] = useState({ show: false, message: '' });

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setModal({ show: true, message: `${product.name} has been added to your cart!` });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const closeModal = () => {
    setModal({ show: false, message: '' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart, modal, closeModal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
