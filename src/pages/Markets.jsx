/**
 * VOLTEX — Markets page (/markets)
 * Full live market table: searchable, sortable-by-click rows that route
 * to /markets/:id coin detail. Reuses the live data hook.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { FiSearch, FiArrowUpRight, FiArrowDownRight, FiZap } from "react-icons/fi";
import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import Sparkline from "../components/Sparkline";
import { useMarketData } from "../hooks/useMarketData";
import { COINS, formatCompact, formatPrice } from "../data/mockData";

export default function Markets() {
  const { market, bySymbol, live, loading, flashes } = useMarketData();
  const [query, setQuery] = useState("");
  const byId = useMemo(() => {
    const map = {};
    for (const m of market ?? []) map[m.id] = m;
    return map;
  }, [market]);

  const q = query.trim().toLowerCase();
  const rows = q
    ? COINS.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
      )
    : COINS;

  return (
    <div className="min-h-screen">
      <Header bySymbol={bySymbol} />
      <TickerTape market={market} />

      <main className="container py-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FiZap size={13} className="cyan-text" />
            Markets
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-muted-foreground"}`} />
            <span className={live ? "up-text" : "text-muted-foreground"}>
              {loading ? "Connecting to market data…" : live ? "Live market data · CoinGecko" : "Demo mode · offline feed"}
            </span>
          </span>
        </div>

        <section className="panel panel-active p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-lg font-bold">All Markets</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Live spot prices · click a row for detail
              </p>
            </div>
            <div className="relative">
              <FiSearch
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter markets..."
                className="h-9 w-52 rounded-md border border-input bg-secondary/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none transition-colors"
                aria-label="Filter markets"
              />
            </div>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Asset", "Price", "24h %", "7d %", "Market Cap", "Volume (24h)"].map((h) => (
                    <th key={h} className="micro-label px-2 py-2.5 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c, i) => {
                  const m = byId[c.id];
                  const up24 = (m?.price_change_percentage_24h ?? 0) >= 0;
                  const up7 = (m?.price_change_percentage_7d_in_currency ?? 0) >= 0;
                  const flash = flashes?.[c.symbol];
                  return (
                    <tr key={`${c.id}-${i}`} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                      <td className="px-2 py-3">
                        <Link
                          href={`/markets/${c.id}`}
                          className="flex items-center gap-2.5 transition-colors hover:text-primary"
                        >
                          <img src={c.icon} alt={c.name} className="h-6 w-6 rounded-full" loading="lazy" />
                          <span className="leading-tight">
                            <span className="block font-semibold">{c.symbol}</span>
                            <span className="block text-xs text-muted-foreground">{c.name}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3">
                        <Link href={`/markets/${c.id}`}>
                          <span
                            className={`font-mono font-medium ${flash === "up" ? "tick-flash-up" : flash === "down" ? "tick-flash-down" : ""}`}
                          >
                            {loading ? "—" : `$${formatPrice(m?.current_price)}`}
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium ${up24 ? "up-text bg-up-dim" : "down-text bg-down-dim"}`}
                        >
                          {up24 ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                          {up24 ? "+" : ""}
                          {(m?.price_change_percentage_24h ?? 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium ${up7 ? "up-text bg-up-dim" : "down-text bg-down-dim"}`}
                        >
                          {up7 ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                          {up7 ? "+" : ""}
                          {(m?.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-2 py-3 font-mono text-muted-foreground">
                        {loading ? "—" : formatCompact(m?.market_cap)}
                      </td>
                      <td className="px-2 py-3 font-mono text-muted-foreground">
                        {loading ? "—" : formatCompact(m?.total_volume)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:hidden">
            {rows.map((c) => {
              const m = byId[c.id];
              const up = (m?.price_change_percentage_24h ?? 0) >= 0;
              const flash = flashes?.[c.symbol];
              return (
                <Link
                  key={c.id}
                  href={`/markets/${c.id}`}
                  className="flex items-center gap-3 rounded-md border border-border bg-secondary/40 p-3 text-left transition-colors hover:border-primary/30"
                >
                  <img src={c.icon} alt={c.name} className="h-8 w-8 rounded-full" loading="lazy" />
                  <div className="flex-1 leading-tight">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {c.symbol} <span className="text-muted-foreground">{c.name}</span>
                      </span>
                      <span className={`text-xs font-medium ${up ? "up-text" : "down-text"}`}>
                        {up ? "+" : ""}
                        {(m?.price_change_percentage_24h ?? 0).toFixed(2)}%
                      </span>
                    </div>
                    <div
                      className={`font-mono text-sm ${flash === "up" ? "tick-flash-up" : flash === "down" ? "tick-flash-down" : ""}`}
                    >
                      {loading ? "—" : `$${formatPrice(m?.current_price)}`}
                    </div>
                  </div>
                  <div className="h-8 w-20">
                    <Sparkline up={up} small />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Voltex Terminal · Market data via CoinGecko public API · Prices refresh every 15s with live micro-ticks.
        </footer>
      </main>
    </div>
  );
}
