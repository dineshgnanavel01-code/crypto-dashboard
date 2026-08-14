# Dinoc Currency — Crypto Exchange Dashboard

## Description
Modern responsive cryptocurrency exchange dashboard built with React, Vite and Tailwind CSS. Live market prices refresh every 15 seconds from the CoinGecko public API with micro-tick flashes in between. Navbar links (Market, Portfolio, Trade, History) jump to their sections, the profile avatar opens a user dropdown, and the BTC/USDT price chart shows real historical data. Includes a simulated trading flow, live order book, and a responsive mobile layout.

## Technologies

- React
- Vite
- Tailwind CSS
- JavaScript
- React Icons

## Features

- Market overview
- Crypto search
- Trading interface
- Buy/Sell functionality
- Price chart
- Order book
- Transactions
- Portfolio
- Deposit system
- Responsive mobile navigation

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
crypto-exchange-dashboard/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Logo.jsx
│   │   ├── IconButton.jsx
│   │   ├── MarketOverview.jsx
│   │   ├── PriceChart.jsx
│   │   ├── OrderBook.jsx
│   │   ├── TradePanel.jsx
│   │   ├── Portfolio.jsx
│   │   └── Transactions.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── Home.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── .gitignore
```
