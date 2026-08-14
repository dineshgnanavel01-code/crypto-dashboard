/**
 * VOLTEX — Market Detail (/markets/:id)
 * Coin detail view: live price hero, stat grid, price chart, and a quick
 * buy/sell strip. Resolves id -> coin via COINS and the live data hook.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { Link, useParams } from "wouter";
import { FiArrowLeft, FiArrowUpRight, FiArrowDownRight, FiZap } from "react-icons/fi";
import { COINS, formatCompact, formatPrice } from "../data/mockData";
import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import PriceChart from "../components/PriceChart";
import TradePanel from "../components/TradePanel";
import NotFound from "./NotFound";
import { useMarketData } from "../hooks/useMarketData";

export default function MarketDetail() {
  const { id } = useParams();
  const { market, bySymbol, live, loading, flashes } = useMarketData();
  const coin = COINS.find((c) => c.id === id) ?? null;

  if (!coin) return <NotFound />;

  const m = bySymbol?.[coin.symbol];
  const up24 = (m?.price_change_percentage_24h ?? 0) >= 0;
  const up7 = (m?.price_change_percentage_7d_in_currency ?? 0) >= 0;
  const athUp = ((m?.ath_change_percentage ?? 0) * -1) <= 0;

  const waitNote = !m || !m.current_price;

  const stats = [
    { label: "Market Cap", value: waitNote ? "—" : formatCompact(m?.market_cap) },
    { label: "24h Volume", value: waitNote ? "—" : formatCompact(m?.total_volume) },
    { label: "24h High", value: waitNote ? "—" : `$${formatPrice(m?.high_24h)}` },
    { label: "24h Low", value: waitNote ? "—" : `$${formatPrice(m?.low_24h)}` },
    { label: "7d Change", value: waitNote ? "—" : `${up7 ? "+" : ""}${(m?.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}%`, tone: up7 ? "up" : "down" },
    { label: "From ATH", value: waitNote ? "—" : `${(m?.ath_change_percentage ?? 0).toFixed(2)}%`, tone: athUp ? "up" : "down" },
  ];

  return (
    <div className="min-h-screen">
      <Header bySymbol={bySymbol} />
      <TickerTape market={market} />

      <main className="container py-6">
        {/* Breadcrumb + status */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Link href="/markets" className="btn-press flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <FiArrowLeft size={13} />
            All Markets
          </Link>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FiZap size={13} className="cyan-text" />
            Voltex Terminal
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-muted-foreground"}`} />
            <span className={live ? "up-text" : "text-muted-foreground"}>
              {loading ? "Connecting…" : live ? "Live · CoinGecko" : "Demo mode"}
            </span>
          </span>
        </div>

        {/* Price hero */}
        <div className="panel panel-active mb-4 flex flex-wrap items-end gap-4 p-5">
          <div className="flex items-center gap-3">
            <img src={coin.icon} alt={coin.name} className="h-10 w-10 rounded-full" loading="lazy" />
            <div className="leading-tight">
              <div className="font-display text-xl font-bold">
                {coin.symbol}/USDT
              </div>
              <div className="text-xs text-muted-foreground">{coin.name}</div>
            </div>
          </div>
            <div className="ml-auto flex items-end gap-4">
              <div>
                <div className="font-mono text-3xl font-bold">
                  ${waitNote ? (loading ? "—" : "...") : formatPrice(m.current_price)}
                </div>
            </div>
            {!waitNote && (
            <span
              className={`mb-1 inline-flex items-center gap-0.5 rounded px-2 py-1 text-sm font-medium ${up24 ? "up-text bg-up-dim" : "down-text bg-down-dim"}`}
            >
              {up24 ? <FiArrowUpRight size={15} /> : <FiArrowDownRight size={15} />}
              {up24 ? "+" : ""}
              {(m.price_change_percentage_24h ?? 0).toFixed(2)}% (24h)
            </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="panel p-4">
                  <div className="micro-label mb-1 text-muted-foreground">{s.label}</div>
                  <div
                    className={`font-mono text-sm font-medium ${
                      s.tone === "up" ? "up-text" : s.tone === "down" ? "down-text" : ""
                    }`}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <PriceChart bySymbol={bySymbol} selectedSymbol={coin.symbol} />
          </div>

          {!waitNote && (
          <TradePanel
            bySymbol={bySymbol}
            selectedSymbol={coin.symbol}
            onSelectPair={() => {}}
            onTrade={() => {}}
            flashes={flashes}
            loading={loading}
          />
          )}
        </div>

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Voltex Terminal · Market data via CoinGecko public API · Simulated trading for demonstration.
        </footer>
      </main>
    </div>
  );
}
