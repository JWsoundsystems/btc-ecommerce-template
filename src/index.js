// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importing the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import App from './App';

// Create a root element for React to render the app into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component to the DOM
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


