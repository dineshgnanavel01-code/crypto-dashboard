
import { useEffect, useMemo, useState } from "react";
import { COINS, formatPrice, generateOrderBook } from "../data/mockData";

export default function OrderBook({ bySymbol, selectedSymbol }) {
  const coin = COINS.find((c) => c.symbol === selectedSymbol) ?? COINS[0];
  const market = bySymbol?.[coin.symbol];
  const mid = market?.current_price ?? 0;
  const decimals = mid < 1 ? 4 : 2;

  const [book, setBook] = useState(() => generateOrderBook(mid || 64000, decimals));

  useEffect(() => {
    if (!mid) return;
    setBook(generateOrderBook(mid, decimals));
    const t = window.setInterval(() => setBook(generateOrderBook(mid, decimals)), 2000);
    return () => window.clearInterval(t);

  }, [mid]);

  const rows = useMemo(() => {
    let askTotal = 0;
    const asks = [...book].reverse().map((r) => {
      askTotal += r.askAmount * r.askPrice;
      return { ...r, askTotal };
    });
    let bidTotal = 0;
    const bids = book.map((r) => {
      bidTotal += r.bidAmount * r.bidPrice;
      return { ...r, bidTotal };
    });
    const maxDepth = Math.max(
      ...asks.map((r) => r.askAmount),
      ...bids.map((r) => r.bidAmount),
    );
    return { asks, bids, maxDepth };
  }, [book]);

  return (
    <section className="panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold">Order Book</h3>
        <span className="micro-label">{coin.symbol}/USDT</span>
      </div>

      {}
      <div className="micro-label mb-1 grid grid-cols-3 gap-2 px-1">
        <span>Price (USDT)</span>
        <span className="text-right">{coin.symbol}</span>
        <span className="text-right">Total</span>
      </div>

      {}
      <div className="space-y-px">
        {rows.asks.map((r, i) => (
          <div key={`a${i}`} className="relative grid grid-cols-3 gap-2 px-1 py-[3px] text-xs font-mono">
            <div
              className="absolute inset-y-0 right-0 bg-down-dim"
              style={{ width: `${(r.askAmount / rows.maxDepth) * 100}%` }}
            />
            <span className="relative down-text">{formatPrice(r.askPrice)}</span>
            <span className="relative text-right">{r.askAmount.toFixed(decimals)}</span>
            <span className="relative text-right text-muted-foreground">
              {(r.askAmount * r.askPrice).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>

      {}
      <div className="my-1.5 flex items-center justify-center gap-2 border-y border-border py-1.5">
        <span className="font-mono text-sm font-semibold cyan-text">
          ${mid ? formatPrice(mid) : "—"}
        </span>
        <span className="text-[10px] text-muted-foreground">
          spread ≈ ${(mid * 0.0004).toFixed(mid < 1 ? 5 : 2)}
        </span>
      </div>

      {}
      <div className="space-y-px">
        {rows.bids.map((r, i) => (
          <div key={`b${i}`} className="relative grid grid-cols-3 gap-2 px-1 py-[3px] text-xs font-mono">
            <div
              className="absolute inset-y-0 right-0 bg-up-dim"
              style={{ width: `${(r.bidAmount / rows.maxDepth) * 100}%` }}
            />
            <span className="relative up-text">{formatPrice(r.bidPrice)}</span>
            <span className="relative text-right">{r.bidAmount.toFixed(decimals)}</span>
            <span className="relative text-right text-muted-foreground">
              {(r.bidAmount * r.bidPrice).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
