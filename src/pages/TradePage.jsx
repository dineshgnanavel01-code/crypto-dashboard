/**
 * VOLTEX — Trade page (/trade, /trade/:pair)
 * Dedicated trading desk: TradePanel + OrderBook with optional pair
 * preselection from the URL param. Trades record into the session list.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { FiZap } from "react-icons/fi";
import { COINS } from "../data/mockData";
import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import TradePanel from "../components/TradePanel";
import OrderBook from "../components/OrderBook";
import { useMarketData } from "../hooks/useMarketData";

export default function TradePage() {
  const { pair } = useParams();
  const { market, bySymbol, live, loading, flashes } = useMarketData();

  const initial = useMemo(() => {
    if (pair) {
      const c = COINS.find((c) => c.id === pair || c.symbol === pair.toUpperCase());
      if (c) return c.symbol;
    }
    return "BTC";
  }, [pair]);

  const [selectedSymbol, setSelectedSymbol] = useState(initial);

  return (
    <div className="min-h-screen">
      <Header bySymbol={bySymbol} onSearchSelect={(s) => setSelectedSymbol(s)} />
      <TickerTape market={market} />

      <main className="container py-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FiZap size={13} className="cyan-text" />
            Trade Desk
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-muted-foreground"}`} />
            <span className={live ? "up-text" : "text-muted-foreground"}>
              {loading ? "Connecting…" : live ? "Live · CoinGecko" : "Demo mode"}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <TradePanel
            bySymbol={bySymbol}
            selectedSymbol={selectedSymbol}
            flashes={flashes}
            loading={loading}
            onSelectPair={(s) => setSelectedSymbol(s)}
            onTrade={() => {}}
          />
          <OrderBook bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
        </div>

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Voltex Terminal · Order book is a simulated live feed · Simulated trading for demonstration.
        </footer>
      </main>
    </div>
  );
}
