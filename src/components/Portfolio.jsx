/**
 * VOLTEX — Portfolio
 * Total balance, available USDT balance, 24h P/L, per-asset allocation
 * bars (visual indicators) and holdings list — all re-priced live.
 */
import { FiArrowDownRight, FiArrowUpRight, FiTrendingUp } from "react-icons/fi";
import { MOCK_HOLDINGS } from "../data/mockData";

const ALLOC_COLORS = ["var(--primary)", "var(--up)", "#a78bfa", "#fbbf24"];

export default function Portfolio({ bySymbol }) {
  const rows = MOCK_HOLDINGS.map((h) => {
    const m = bySymbol?.[h.symbol];
    const value = (m?.current_price ?? 0) * h.amount;
    return { ...h, value, change: m?.price_change_percentage_24h ?? 0 };
  });

  const total = rows.reduce((s, r) => s + r.value, 0);
  const usdt = 12500;
  const grandTotal = total + usdt;
  const dailyPL = rows.reduce((s, r) => s + (r.value * r.change) / 100, 0);

  return (
    <section className="panel panel-active p-5">
      <h3 className="mb-4 font-display text-sm font-bold">Portfolio</h3>

      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-md border border-border bg-secondary/40 p-3">
          <div className="micro-label mb-1">Total Balance</div>
          <div className="font-mono text-base font-semibold sm:text-lg">
            ${grandTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="rounded-md border border-border bg-secondary/40 p-3">
          <div className="micro-label mb-1">Available (USDT)</div>
          <div className="font-mono text-base font-semibold sm:text-lg">${usdt.toLocaleString()}</div>
        </div>
      </div>

      <div
        className={`mb-4 flex items-center justify-between rounded-md border p-3 ${
          dailyPL >= 0 ? "border-up/30 bg-up-dim" : "border-down/30 bg-down-dim"
        }`}
      >
        <span className="micro-label">24h Profit / Loss</span>
        <span
          className={`flex items-center gap-1 font-mono text-sm font-semibold ${
            dailyPL >= 0 ? "up-text" : "down-text"
          }`}
        >
          {dailyPL >= 0 ? <FiArrowUpRight size={15} /> : <FiArrowDownRight size={15} />}
          {dailyPL >= 0 ? "+" : ""}${dailyPL.toFixed(2)}
        </span>
      </div>

      {/* Holdings with allocation */}
      <div className="mb-2 flex items-center gap-2">
        <FiTrendingUp size={13} className="text-muted-foreground" />
        <span className="micro-label">Asset Allocation</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full border border-border">
        {rows.map((r, i) => {
          const pct = grandTotal > 0 ? (r.value / grandTotal) * 100 : 0;
          return (
            <div
              key={`alloc-${r.symbol}`}
              title={`${r.symbol} ${pct.toFixed(1)}%`}
              style={{ width: `${pct}%`, background: ALLOC_COLORS[i % ALLOC_COLORS.length] }}
              className="transition-all duration-300"
            />
          );
        })}
      </div>

      <ul className="mt-3 space-y-2.5">
        {rows.map((r, i) => {
          const pct = grandTotal > 0 ? (r.value / grandTotal) * 100 : 0;
          const up = r.change >= 0;
          return (
            <li key={`hold-${r.symbol}`} className="rounded-md border border-border bg-secondary/40 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground"
                    style={{ background: ALLOC_COLORS[i % ALLOC_COLORS.length], color: "#0b1020" }}
                  >
                    {r.symbol.slice(0, 2)}
                  </span>
                  <span className="text-sm font-semibold">{r.symbol}</span>
                  <span className="font-mono text-xs text-muted-foreground">{r.amount}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">${r.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                  <div className={`text-xs font-medium ${up ? "up-text" : "down-text"}`}>
                    {up ? "+" : ""}{r.change.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: ALLOC_COLORS[i % ALLOC_COLORS.length] }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
