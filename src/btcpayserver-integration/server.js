// ... [your imports and setup remain the same]

const express = require('express');
const app = express(); // ✅ Important line
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();


app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Store a reference to the io instance
let ioInstance = io;

// Create invoice endpoint
app.post('/create-invoice', async (req, res) => {
  const { price, currency } = req.body;
  const storeId = process.env.BTCPAY_STORE_ID;
  const apiKey = process.env.BTCPAY_API_KEY;
  const btcpayServerUrl = process.env.BTCPAY_SERVER_URL;

  try {
    const response = await axios.post(
      `${btcpayServerUrl}api/v1/stores/${storeId}/invoices`,
      { amount: price, currency },
      { headers: { Authorization: `token ${apiKey}` } }
    );

    const paymentLink = response.data.checkoutLink;
    const invoiceId = response.data.id;
    console.log('BTCPayServer response:', response.data);
    res.json({ paymentLink, invoiceId });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Error creating invoice' });
  }
});

app.post('/webhook', (req, res) => {
  const webhook = req.body;
  console.log('Webhook received:', webhook);

  if (webhook.type === 'InvoiceSettled') {
    const invoiceId = webhook.invoiceId;
    io.emit('paymentConfirmed', { invoiceId });
    console.log('✅ Emitted paymentConfirmed for:', invoiceId);
  }

  if (webhook.type === 'InvoiceInvalid') {
    const invoiceId = webhook.invoiceId;
    io.emit('paymentFailed', { invoiceId });
    console.log('❌ Emitted paymentFailed for:', invoiceId);
  }

  res.status(200).send('OK');
});


// Handle new socket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
