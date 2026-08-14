/**
 * VOLTEX — History page (/history)
 * Full transaction history: complete table with filters, reusing the
 * Transactions panel.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { useMemo, useState } from "react";
import { FiZap } from "react-icons/fi";
import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import Transactions from "../components/Transactions";
import { useMarketData } from "../hooks/useMarketData";
import { MOCK_TRANSACTIONS } from "../data/mockData";

const FILTERS = ["All", "Buy", "Sell"];

export default function HistoryPage() {
  const { market, bySymbol, live, loading } = useMarketData();
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [filter, setFilter] = useState("All");

  const rows = useMemo(() => {
    if (filter === "All") return transactions;
    return transactions.filter((t) => t.type.toUpperCase() === filter.toUpperCase());
  }, [transactions, filter]);

  return (
    <div className="min-h-screen">
      <Header bySymbol={bySymbol} />
      <TickerTape market={market} />

      <main className="container py-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FiZap size={13} className="cyan-text" />
            Transaction History
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-muted-foreground"}`} />
            <span className={live ? "up-text" : "text-muted-foreground"}>
              {loading ? "Connecting…" : live ? "Live · CoinGecko" : "Demo mode"}
            </span>
          </span>
        </div>

        <section className="panel panel-active p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-lg font-bold">History</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {rows.length} {rows.length === 1 ? "transaction" : "transactions"}
              </p>
            </div>
            <div className="flex rounded-md border border-border p-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn-press rounded px-3 py-1 text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Transactions transactions={rows} />
        </section>

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Voltex Terminal · Transaction history is simulated for demonstration.
        </footer>
      </main>
    </div>
  );
}
