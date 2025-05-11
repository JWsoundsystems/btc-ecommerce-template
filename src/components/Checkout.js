// src/components/Checkout.js
import React, { useContext, useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import QRCode from 'qrcode.react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [total, setTotal] = useState('0.00');
  const navigate = useNavigate();

  useEffect(() => {
    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0).toFixed(2);
    setTotal(totalAmount);
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/create-invoice', {
        price: total,
        currency: 'USD',
      });

      setInvoiceUrl(response.data.checkoutLink);
      setInvoiceId(response.data.invoiceId);
      console.log('Invoice URL:', response.data.checkoutLink);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('paymentConfirmed', ({ invoiceId: confirmedId }) => {
      console.log('Payment confirmed for invoice:', confirmedId);
      if (confirmedId === invoiceId) {
        setInvoicePaid(true);
        clearCart();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [invoiceId, clearCart]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <h3>Total: ${total}</h3>

      {!invoiceUrl && !invoicePaid && (
        <button onClick={handleCheckout} className="btn-primary">
          Proceed to Checkout
        </button>
      )}

      {invoiceUrl && !invoicePaid && (
        <div className="invoice-container">
          <p>Invoice created! Pay using the link below:</p>
          <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
            {invoiceUrl}
          </a>
          <p>Or scan the QR code below:</p>
          <QRCode value={invoiceUrl} size={200} />
        </div>
      )}

      {invoicePaid && (
        <div className="confirmation-container">
          <h3>Invoice paid successfully!</h3>
          <p>Your order number is: <strong>{invoiceId}</strong></p>
          <button onClick={handleBackToHome} className="btn-primary mt-3">
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
