/**
 * VOLTEX — Portfolio page (/portfolio)
 * Full-width portfolio view: balance hero, P/L, allocation bars and holdings
 * list, reusing the Portfolio panel.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { FiZap } from "react-icons/fi";
import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import Portfolio from "../components/Portfolio";
import { useMarketData } from "../hooks/useMarketData";

export default function PortfolioPage() {
  const { market, bySymbol, live, loading } = useMarketData();

  return (
    <div className="min-h-screen">
      <Header bySymbol={bySymbol} />
      <TickerTape market={market} />

      <main className="container py-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FiZap size={13} className="cyan-text" />
            Portfolio
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-muted-foreground"}`} />
            <span className={live ? "up-text" : "text-muted-foreground"}>
              {loading ? "Connecting…" : live ? "Live · CoinGecko" : "Demo mode"}
            </span>
          </span>
        </div>

        <Portfolio bySymbol={bySymbol} />

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Voltex Terminal · Valuations use live market prices · Holdings are simulated for demonstration.
        </footer>
      </main>
    </div>
  );
}
