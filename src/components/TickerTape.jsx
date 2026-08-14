/**
 * VOLTEX — TickerTape
 * Scrolling marquee of live prices beneath the header — a signature
 * terminal element that confirms the tape is alive at a glance.
 */
import { COINS, formatPrice, formatPct } from "../data/mockData";

export default function TickerTape({ market }) {
  const rows = (market ?? []).map((m) => {
    const c = COINS.find((x) => x.symbol === m.symbol);
    const up = (m.price_change_percentage_24h ?? 0) >= 0;
    return (
      <span key={m.symbol} className="flex items-center gap-2 whitespace-nowrap px-5 text-xs">
        <span className="font-semibold">{m.symbol}</span>
        <span className="font-mono text-muted-foreground">${formatPrice(m.current_price)}</span>
        <span className={`font-mono font-medium ${up ? "up-text" : "down-text"}`}>
          {formatPct(m.price_change_percentage_24h ?? 0)}
        </span>
      </span>
    );
  });

  return (
    <div className="overflow-hidden border-b border-border bg-secondary/30 py-1.5" aria-hidden>
      <div className="ticker-track flex w-max items-center">
        {[...rows, ...rows]}
      </div>
    </div>
  );
}
