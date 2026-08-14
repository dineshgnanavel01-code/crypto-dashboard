/**
 * VOLTEX — MarketOverview
 * Live market table: coin, symbol, price (flashing on tick), 24h change,
 * market cap, 24h volume, plus a compact sparkline per row.
 * Responsive: table on desktop, stacked cards on mobile.
 */
import { Link } from "wouter";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { COINS, formatCompact, formatPrice } from "../data/mockData";
import Sparkline from "./Sparkline";

export default function MarketOverview({ market, flashes, loading, onSelect }) {
  const byId = {};
  for (const m of market ?? []) byId[m.id] = m;

  return (
    <section className="panel panel-active p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Market Overview</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Live spot prices · USDT pairs</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-up" />
          </span>
          LIVE
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {["Asset", "Price", "24h %", "Market Cap", "Volume (24h)"].map((h) => (
                <th key={h} className="micro-label px-2 py-2.5 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COINS.map((c, i) => {
              const m = byId[c.id];
              const up = (m?.price_change_percentage_24h ?? 0) >= 0;
              const flash = flashes?.[c.symbol];
              return (
                <tr
                  key={`${c.id}-${i}`}
                  onClick={() => onSelect?.(c.symbol)}
                  className="cursor-pointer border-b border-border/60 transition-colors duration-150 last:border-0 hover:bg-accent/40"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={c.icon} alt={c.name} className="h-6 w-6 rounded-full" loading="lazy" />
                      <div className="leading-tight">
                        <div className="font-semibold">{c.symbol}</div>
                        <div className="text-xs text-muted-foreground">{c.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div
                      className={`font-mono font-medium ${flash === "up" ? "tick-flash-up" : flash === "down" ? "tick-flash-down" : ""}`}
                    >
                      {loading ? "—" : `$${formatPrice(m?.current_price)}`}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium ${up ? "up-text bg-up-dim" : "down-text bg-down-dim"}`}
                    >
                      {up ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                      {up ? "+" : ""}
                      {(m?.price_change_percentage_24h ?? 0).toFixed(2)}%
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

      {/* Mobile/tablet cards */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:hidden">
        {COINS.map((c) => {
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
                    {c.symbol}{" "}
                    <span className="text-muted-foreground">{c.name}</span>
                  </span>
                  <span
                    className={`text-xs font-medium ${up ? "up-text" : "down-text"}`}
                  >
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
  );
}
