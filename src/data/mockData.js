/**
 * VOLTEX — data/cryptoData.js
 * Data layer: live CoinGecko public API (no key required), graceful fallback
 * to static mock data when rate-limited, plus a tick simulator that adds
 * realistic second-by-second price movement with flash notifications.
 *
 * Style: Midnight Precision Deck — data is the hero, color encodes direction.
 */

export const COINS = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    pair: "BTC/USDT",
    icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    pair: "ETH/USDT",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    pair: "SOL/USDT",
    icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "Binance Coin",
    pair: "BNB/USDT",
    icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    pair: "XRP/USDT",
    icon: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    pair: "ADA/USDT",
    icon: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    pair: "DOGE/USDT",
    icon: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    pair: "DOT/USDT",
    icon: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  },
];

/** Fallback mock market snapshot used when the API is unavailable. */
export const MOCK_MARKET = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", current_price: 64218.44, price_change_percentage_24h: 2.36, market_cap: 1268440000000, total_volume: 31420000000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", current_price: 3452.18, price_change_percentage_24h: 1.84, market_cap: 414920000000, total_volume: 18340000000 },
  { id: "solana", symbol: "SOL", name: "Solana", current_price: 148.72, price_change_percentage_24h: 4.12, market_cap: 68540000000, total_volume: 3210000000 },
  { id: "binancecoin", symbol: "BNB", name: "Binance Coin", current_price: 602.35, price_change_percentage_24h: -0.54, market_cap: 89210000000, total_volume: 1640000000 },
  { id: "ripple", symbol: "XRP", name: "XRP", current_price: 0.5218, price_change_percentage_24h: -1.22, market_cap: 28740000000, total_volume: 1280000000 },
  { id: "cardano", symbol: "ADA", name: "Cardano", current_price: 0.4412, price_change_percentage_24h: 0.87, market_cap: 15620000000, total_volume: 412000000 },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", current_price: 0.1244, price_change_percentage_24h: 5.63, market_cap: 17850000000, total_volume: 982000000 },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", current_price: 7.14, price_change_percentage_24h: -2.08, market_cap: 9820000000, total_volume: 264000000 },
];

/** Sample portfolio holdings (base currency amounts). */
export const MOCK_HOLDINGS = [
  { symbol: "BTC", amount: 0.42 },
  { symbol: "ETH", amount: 6.5 },
  { symbol: "SOL", amount: 48 },
  { symbol: "XRP", amount: 2400 },
];

export const MOCK_DEPOSIT_BALANCE = 12500;

/** Sample transactions. */
export const MOCK_TRANSACTIONS = [
  { id: "TX-8A21F4", symbol: "BTC", type: "BUY", amount: 0.05, price: 63840.22, status: "completed", time: "2026-08-13 18:42" },
  { id: "TX-8A21F5", symbol: "ETH", type: "SELL", amount: 1.2, price: 3418.9, status: "completed", time: "2026-08-13 17:05" },
  { id: "TX-8A21F6", symbol: "SOL", type: "BUY", amount: 12, price: 145.3, status: "pending", time: "2026-08-13 15:21" },
  { id: "TX-8A21F7", symbol: "XRP", type: "SELL", amount: 800, price: 0.5244, status: "completed", time: "2026-08-13 12:58" },
  { id: "TX-8A21F8", symbol: "BTC", type: "SELL", amount: 0.02, price: 64102.88, status: "failed", time: "2026-08-12 22:14" },
];

/** Static mock price history (hourly close, last 24 points) when chart API fails. */
export const MOCK_HISTORY = (() => {
  const pts = [];
  let p = 61200;
  const seed = [1.02, -0.8, 1.4, -1.2, 2.1, -0.4, 0.9, 1.6, -2.0, 0.6, 1.8, -0.7, 1.1, -1.5, 2.4, -0.3, 0.8, 1.2, -1.8, 1.5, 0.4, -0.9, 1.9, -0.5];
  for (let i = 0; i < seed.length; i++) {
    p += seed[i] * 90;
    pts.push({ time: i, close: p });
  }
  return pts;
})();

/** Generate a synthetic order book around a mid price. */
export function generateOrderBook(midPrice, decimals = 2) {
  const rows = [];
  for (let i = 1; i <= 12; i++) {
    const spread = midPrice * 0.0004 * i;
    rows.push({
      askPrice: midPrice + spread,
      askAmount: +(Math.random() * 2.4 + 0.02).toFixed(decimals > 0 ? decimals : 4),
      bidPrice: midPrice - spread,
      bidAmount: +(Math.random() * 2.4 + 0.02).toFixed(decimals > 0 ? decimals : 4),
    });
  }
  return rows;
}

/** Format helpers with tabular-nums friendly output. */
export function formatPrice(price) {
  if (price == null || Number.isNaN(price)) return "—";
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export function formatCompact(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export function formatPct(p) {
  return `${p >= 0 ? "+" : ""}${p.toFixed(2)}%`;
}

/** Fetch live market data from CoinGecko public API. */
export async function fetchLiveMarket(ids) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const data = await res.json();
  return data.map((c) => ({
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    current_price: c.current_price,
    price_change_percentage_24h: c.price_change_percentage_24h ?? 0,
    market_cap: c.market_cap,
    total_volume: c.total_volume,
  }));
}

/** Fetch price history (candles) for the chart, in daily granularity. */
export async function fetchHistory(id, days = 30) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const data = await res.json();
  return data.prices.map((p) => ({ time: p[0], close: p[1] }));
}
