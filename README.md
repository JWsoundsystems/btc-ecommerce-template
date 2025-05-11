# Basic Bitcoin E-Commerce Store

This is a full-stack e-commerce web application that allows users to browse products, add items to a cart, and check out using Bitcoin through BTCPay Server. Built with React on the frontend and Node.js/Express on the backend, it uses BTCPay's API and webhooks to create and monitor Bitcoin payment invoices.

---

## Features

* Product listing and details
* Shopping cart functionality
* Bitcoin checkout with BTCPay Server integration
* Real-time invoice status updates via WebSocket and webhooks
* Webhook handling for both settled and invalid payments

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/JWsoundsystems/btc-ecommerce-template
cd btc-ecommerce-template
```

### 2. Install dependencies

```bash
# For frontend
cd btc-ecommerce-template
npm install

# For backend
cd src/btcpayserver-integration
npm install
```

### 3. Configure environment

<!-- You will need to set up your own BTC Pay Server API Key and Store ID and fill it in your .env file -->

Create a `.env` file inside `src/btcpayserver-integration/` and add:

```
BTCPAY_API_KEY=your_btcpay_api_key
BTCPAY_STORE_ID=your_store_id
BTCPAY_HOST=https://your-btcpay-host.example.com
```

> 💡 If using the demo BTCPay server for testing, you can use:

```
BTCPAY_HOST=https://mainnet.demo.btcpayserver.org
```

---

### 4. Start the development servers

#### Start frontend

```bash
cd btc-ecommerce-template
npm start
```

#### Start backend with Ngrok

```bash
cd src/btcpayserver-integration
npm start
```

In another terminal tab, expose backend port (default 5000) with Ngrok:

```bash
ngrok http 5000
```

Copy the HTTPS forwarding URL shown by Ngrok.

---

### 5. Configure BTCPay Webhook

In your BTCPay dashboard:

1. Go to your store > Webhooks
2. Create a new webhook with:

   * URL: `https://your-ngrok-url/webhook`
   * Events: `Invoice Settled`, `Invoice Invalid`
3. Save and test.

> ⚠️ Make sure to update your Ngrok URL in your code and BTCPay settings each time it changes!

---

## Usage

1. Browse and add products to your cart.
2. Click "Proceed to Checkout" to generate a Bitcoin invoice.
3. Scan the QR code or pay via the provided BTCPay URL.
4. The UI will automatically update once the payment is settled or marked invalid.

---

## Notes

* WebSocket is used for real-time invoice updates.
* Make sure to whitelist your Ngrok domain if running a firewall or CORS policy.
* Backend webhook listens for `InvoiceSettled` and `InvoiceInvalid` events to update frontend.

---

## License

MIT

---

## Contributors

* @YourGitHubName
