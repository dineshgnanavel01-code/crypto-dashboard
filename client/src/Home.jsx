/**
 * VOLTEX — Home (main dashboard page)
 * Asymmetric trading-grid layout: ticker tape, central chart column,
 * left rail (portfolio + market overview), right column (trade + order book),
 * transactions spanning full width. All data wired through useMarketData.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import Navbar from "./components/Navbar";
import { DashboardGrid, HistoryPage, MarketPage, PortfolioPage, TradePage } from "./components/Pages";
import { ProfilePage, SettingsPage, SignInPage } from "./components/AccountPages";
import MarketOverview from "./components/MarketOverview";
import TradePanel from "./components/TradePanel";
import PriceChart from "./components/PriceChart";
import OrderBook from "./components/OrderBook";
import Transactions from "./components/Transactions";
import Portfolio from "./components/Portfolio";
import { useMarketData, MOCK_TRANSACTIONS, COINS, formatPrice, formatPct } from "./data/mockData";

export default function Home() {
  const { market, bySymbol, live, loading, flashes } = useMarketData();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [depositOpen, setDepositOpen] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState(12500);

  // Market mood: average 24h change across all tracked coins (static sample data)
  const avgChange = useMemo(() => {
    if (!market || market.length === 0) return null;
    return market.reduce((sum, c) => sum + (c.price_change_percentage_24h ?? 0), 0) / market.length;
  }, [market]);

  const latestTx = useMemo(
    () =>
      transactions
        .filter((t) => t.id.startsWith("TX-APP"))
        .sort((a, b) => (a.time < b.time ? 1 : -1))[0],
    [transactions],
  );

  function handleTrade({ symbol, type, amount, price, orderType }) {
    const now = new Date();
    const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const id = `TX-APP${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setTransactions((prev) => [
      { id, symbol, type, amount, price, orderType, status: "completed", time },
      ...prev,
    ]);
    setUsdtBalance((b) => (type === "BUY" ? b - amount * price : b + amount * price));
  }

  return (
    <div className="min-h-screen">
      <Navbar bySymbol={bySymbol} onSearchSelect={(s) => setSelectedSymbol(s)} />
      <TickerTape market={market} />

      <main className="container py-6">
        <Routes>
          {/* / — full dashboard (default) */}
          <Route index element={<DashboardGrid market={market} bySymbol={bySymbol} flashes={flashes} loading={loading} selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} transactions={transactions} usdtBalance={usdtBalance} focus="all" />} />
          {/* Each nav item opens its OWN page: */}
          <Route path="portfolio" element={<PortfolioPage bySymbol={bySymbol} loading={loading} />} />
          <Route path="market" element={<MarketPage market={market} bySymbol={bySymbol} flashes={flashes} loading={loading} selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} />} />
          <Route path="trade" element={<TradePage bySymbol={bySymbol} selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} usdtBalance={usdtBalance} />} />
          <Route path="history" element={<HistoryPage transactions={transactions} bySymbol={bySymbol} />} />
          {/* Account pages (profile menu): */}
          <Route path="signin" element={<SignInPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Status bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FiZap size={13} className="cyan-text" />
            Dinoc Currency
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-muted-foreground"}`} />
            <span className={live ? "up-text" : "text-muted-foreground"}>
              {loading ? "Loading market data…" : "Live simulated prices · front end only"}
            </span>
          </span>
          {avgChange !== null && !loading && (
            <span className={`flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-mono font-medium ${avgChange >= 0 ? "bg-up/10 up-text" : "bg-down/10 down-text"}`}>
              {avgChange >= 0 ? "▲" : "▼"} {avgChange.toFixed(2)}% avg 24h — {avgChange >= 0 ? "green market day" : "red market day"}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              Available: ${usdtBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </span>
            <button
              onClick={() => setDepositOpen(true)}
              className="btn-press rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              Deposit
            </button>
          </div>
        </div>

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Dinoc Currency · Sample data · Prices tick live in the front end (no backend required) ·
          Simulated trading for demonstration — not financial advice.
        </footer>
      </main>

    </div>
  );
}

/**
 * VOLTEX — TickerTape
 * Scrolling marquee of live prices beneath the header — a signature
 * terminal element that confirms the tape is alive at a glance.
 */

function TickerTape({ market }) {
  const rows = (market ?? []).flatMap((m) => {
    const c = COINS.find((x) => x.symbol === m.symbol);
    const up = (m.price_change_percentage_24h ?? 0) >= 0;
    const content = (
      <span className="flex items-center gap-2 whitespace-nowrap px-5 text-xs">
        <span className="font-semibold">{m.symbol}</span>
        <span className="font-mono text-muted-foreground">${formatPrice(m.current_price)}</span>
        <span className={`font-mono font-medium ${up ? "up-text" : "down-text"}`}>
          {formatPct(m.price_change_percentage_24h ?? 0)}
        </span>
      </span>
    );
    // Duplicate the strip so the marquee scrolls seamlessly; the two passes
    // must carry distinct keys to keep React happy.
    return [
      { ...content, key: `tape-a-${m.symbol}` },
      { ...content, key: `tape-b-${m.symbol}` },
    ];
  });

  return (
    <div className="overflow-hidden border-b border-border bg-secondary/30 py-1.5" aria-hidden>
      <div className="ticker-track flex w-max items-center">
        {rows}
      </div>
    </div>
  );
}
