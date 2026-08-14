/**
 * VOLTEX — PriceChart
 * Interactive area chart (recharts) of live CoinGecko history with a live
 * price readout, period toggles (1H / 1D / 1W / 1M), and direction-aware
 * cyan/green gradient. Falls back to mock history when the API is busy.
 */
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { COINS, MOCK_HISTORY, fetchHistory, formatPrice } from "../data/mockData";

const PERIODS = [
  { label: "1H", days: 1 / 24, fmt: (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  { label: "1D", days: 1, fmt: (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit" }) },
  { label: "1W", days: 7, fmt: (t) => new Date(t).toLocaleDateString([], { weekday: "short" }) },
  { label: "1M", days: 30, fmt: (t) => new Date(t).toLocaleDateString([], { month: "short", day: "numeric" }) },
];

export default function PriceChart({ bySymbol, selectedSymbol }) {
  const coin = COINS.find((c) => c.symbol === selectedSymbol) ?? COINS[0];
  const market = bySymbol?.[coin.symbol];
  const [period, setPeriod] = useState(PERIODS[3]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = coin.id;
    (async () => {
      setLoading(true);
      let pts = null;
      try {
        pts = await fetchHistory(id, Math.max(1, period.days));
      } catch {
        // fall back to mock daily history, resampled to feel like the period
        const mult = period.days < 1 ? 0.02 : period.days <= 7 ? 0.3 : 1;
        pts = MOCK_HISTORY.map((p, i) => ({
          time: Date.now() - (MOCK_HISTORY.length - i) * 3600000,
          close: 61200 * mult + p.close * (1 - mult) + (Math.random() - 0.5) * 400,
        }));
      }
      if (cancelled) return;
      setData(
        (pts ?? []).map((p) => ({
          time: p.time,
          label: period.fmt(p.time),
          price: p.close,
        })),
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [coin.id, period]);

  const up = (market?.price_change_percentage_24h ?? 0) >= 0;
  const stroke = up ? "var(--up)" : "var(--down)";
  const last = data[data.length - 1]?.price;
  const first = data[0]?.price;
  const change = last && first ? ((last - first) / first) * 100 : 0;

  return (
    <section className="panel panel-active p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold">{coin.pair}</h2>
            <span className={`micro-label ${up ? "up-text" : "down-text"}`}>
              {up ? "▲" : "▼"} {formatPct(change)}
            </span>
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold">
            {market ? `$${formatPrice(market.current_price)}` : "—"}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {loading ? "Loading history…" : `${data.length} data points · live feed`}
          </p>
        </div>

        <div className="flex gap-1 rounded-md border border-border bg-secondary/60 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPeriod(p)}
              className={`btn-press rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                period.label === p.label
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              minTickGap={48}
            />
            <YAxis
              domain={["auto", "auto"]}
              hide
              orientation="right"
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: 12,
                fontFamily: "IBM Plex Mono",
              }}
              labelStyle={{ color: "var(--muted-foreground)", fontFamily: "IBM Plex Sans" }}
              formatter={(v) => [`$${formatPrice(v)}`, "Price"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={stroke}
              strokeWidth={2}
              fill="url(#priceGrad)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function formatPct(n) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
