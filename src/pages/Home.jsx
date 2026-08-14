/**
 * VOLTEX — Home (main dashboard page)
 * Asymmetric trading-grid layout: ticker tape, central chart column,
 * left rail (portfolio + market overview), right column (trade + order book),
 * transactions spanning full width. All data wired through useMarketData.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { useMemo, useState } from "react";
import { FiZap } from "react-icons/fi";
import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import MarketOverview from "../components/MarketOverview";
import TradePanel from "../components/TradePanel";
import PriceChart from "../components/PriceChart";
import OrderBook from "../components/OrderBook";
import Transactions from "../components/Transactions";
import Portfolio from "../components/Portfolio";
import { useMarketData } from "../hooks/useMarketData";
import { MOCK_TRANSACTIONS } from "../data/mockData";

export default function Home() {
  const { market, bySymbol, live, loading, flashes } = useMarketData();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [depositOpen, setDepositOpen] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState(12500);

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
      <Header bySymbol={bySymbol} onSearchSelect={(s) => setSelectedSymbol(s)} />
      <TickerTape market={market} />

      <main className="container py-6">
        {/* Status bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FiZap size={13} className="cyan-text" />
            Voltex Terminal
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-muted-foreground"}`} />
            <span className={live ? "up-text" : "text-muted-foreground"}>
              {loading ? "Connecting to market data…" : live ? "Live market data · CoinGecko" : "Demo mode · offline feed"}
            </span>
          </span>
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

        {/* Main grid: chart center, trade + order book right, portfolio + market left */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_320px]">
          {/* Left rail */}
          <div className="order-2 flex flex-col gap-4 xl:order-1">
            <Portfolio bySymbol={bySymbol} />
            <MarketOverview
              market={market}
              flashes={flashes}
              loading={loading}
              onSelect={(s) => setSelectedSymbol(s)}
            />
          </div>

          {/* Center: chart */}
          <div className="order-1 xl:order-2">
            <PriceChart bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
            <div className="mt-4">
              <Transactions transactions={transactions} />
            </div>
          </div>

          {/* Right column */}
          <div className="order-3 flex flex-col gap-4">
            <TradePanel
              bySymbol={bySymbol}
              selectedSymbol={selectedSymbol}
              onSelectPair={(s) => setSelectedSymbol(s)}
              onTrade={handleTrade}
            />
            <OrderBook bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
          </div>
        </div>

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Voltex Terminal · Market data via CoinGecko public API · Prices refresh every 15s with live micro-ticks ·
          Simulated trading for demonstration — not financial advice.
        </footer>
      </main>

    </div>
  );
}
