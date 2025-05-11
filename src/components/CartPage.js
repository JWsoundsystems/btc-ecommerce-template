import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import QRCode from 'qrcode.react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';


const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [orderId, setOrderId] = useState('');
  const orderIdRef = useRef('');
  const [total, setTotal] = useState('0.00');
  const navigate = useNavigate();
  const storeId = process.env.BTCPAY_STORE_ID;
  const apiKey = process.env.BTCPAY_API_KEY;
  const [invoiceInvalid, setInvoiceInvalid] = useState(false);
  


  useEffect(() => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    setTotal(totalAmount);
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/create-invoice', {
        price: total,
        currency: 'USD',
      });
      setInvoiceUrl(response.data.paymentLink);
      setOrderId(response.data.invoiceId);
      localStorage.setItem('lastInvoiceId', response.data.invoiceId); // persist
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleInvoicePaid = (invoiceId) => {
    setInvoicePaid(true);
    setOrderId(invoiceId);
    localStorage.removeItem('lastInvoiceId');
  };

  useEffect(() => {
    const socket = io('http://localhost:5000');
  
    socket.on('paymentConfirmed', ({ invoiceId }) => {
      console.log('Received paymentConfirmed for', invoiceId);
      if (invoiceId === orderId) {
        setInvoicePaid(true);
      }
    });

    socket.on('paymentFailed', ({ invoiceId }) => {
      if (invoiceId === orderId) {
        setInvoicePaid(false);
        setInvoiceInvalid(true);  // ✅ You need this state variable
      }
    });
    
    return () => socket.disconnect();
  }, [orderId]);
  
  

  

  // Fallback in case the frontend misses the WebSocket event
  useEffect(() => {
    const lastInvoiceId = localStorage.getItem('lastInvoiceId');
    if (lastInvoiceId) {
      axios
        .get(`https://mainnet.demo.btcpayserver.org/api/v1/stores/${process.env.STORE_ID}/invoices/${lastInvoiceId}`, {
          headers: {
            Authorization: `token ${process.env.API_KEY}`,
          },
        })
        .then((res) => {
          if (res.data.status === 'Settled') {
            handleInvoicePaid(lastInvoiceId);
          }
        })
        .catch((err) => console.warn('Invoice check fallback failed', err));
    }
  }, []);

  const handleBackToHome = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info">
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <button onClick={() => removeFromCart(item.id)} className="btn-primary">Remove</button>
        </div>
      ))}

      <div className="total-checkout-container">
        <div className="total">
          <h3>Total: ${total}</h3>
        </div>
        {!invoiceUrl && !invoicePaid && (
          <button onClick={handleCheckout} className="btn-primary">Proceed to Checkout</button>
        )}
      </div>

      {invoiceUrl && !invoicePaid && (
        <div className="invoice-details">
          <p>Invoice created! Pay using the link below:</p>
          <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">{invoiceUrl}</a>
          <p>Or scan the QR code below:</p>
          <QRCode value={invoiceUrl} />
        </div>
      )}

      {invoicePaid && (
        <div className="invoice-details">
          <p>✅ Payment received!</p>
          <p>Your order number is: {orderId}</p>
          <button onClick={handleBackToHome} className="btn-primary">Back to Home</button>
        </div>
      )}

      {invoiceInvalid && (
        <div className="invoice-details">
          <p className="error-text">❌ Payment failed or expired.</p>
          <button onClick={handleBackToHome} className="btn-primary">Back to Home</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
