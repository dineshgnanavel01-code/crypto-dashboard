/**
 * Dinoc Currency — PriceChart
 * Interactive area chart (recharts) built from static mock history data
 * (no API per assignment spec), with a live price readout and period
 * toggles (1H / 1D / 1W / 1M) that re-sample the mock series, plus
 * direction-aware color for up/down movement.
 */
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COINS, formatPrice } from "../data/mockData";

const PERIODS = [
  { label: "1H", stepMs: 3600000 }, // hourly points
  { label: "1D", stepMs: 3600000 }, // hourly points (intraday)
  { label: "1W", stepMs: 36000000 }, // ~10-min bands
  { label: "1M", stepMs: 360000000 }, // ~1h bands
];

/** Build 30 chart points by walking the static mock history for a period. */
function sampleForPeriod(period, seed) {
  const pts = [];
  const now = Date.now();
  let p = seed;
  // deterministic pseudo-random based on period for consistent shape
  const randSeed = period.label === "1H" ? 7 : period.label === "1D" ? 11 : period.label === "1W" ? 23 : 37;
  for (let i = 0; i < 30; i++) {
    const r = seededRand(randSeed + i);
    const drift = (r() - 0.5) * 2 * (seed * 0.012);
    p += drift;
    pts.push({ time: now - (30 - i) * period.stepMs, close: p });
  }
  return pts;
}

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function PriceChart({ bySymbol, selectedSymbol }) {
  const coin = COINS.find((c) => c.symbol === selectedSymbol) ?? COINS[0];
  const market = bySymbol?.[coin.symbol];
  const [period, setPeriod] = useState(PERIODS[3]);

  // Seed the chart series from the coin's current price so it feels per-coin
  const series = useMemo(
    () => sampleForPeriod(period, market?.current_price ?? 64218),
    [period, market?.current_price],
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // brief loading feel like a real chart request (data is local/mock)
    const t = window.setTimeout(() => {
      if (cancelled) return;
      setData(
        series.map((p) => ({
          time: p.time,
          label:
            period.label === "1H" || period.label === "1D"
              ? new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: period.label === "1H" ? "2-digit" : undefined })
              : new Date(p.time).toLocaleDateString([], { month: "short", day: "numeric" }),
          price: p.close,
        })),
      );
      setLoading(false);
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [series, period]);

  const up = (market?.price_change_percentage_24h ?? 0) >= 0;
  const stroke = up ? "var(--up)" : "var(--down)";
  const last = data[data.length - 1]?.price;
  const first = data[0]?.price;
  const change = last && first ? ((last - first) / first) * 100 : 0;

  return (
    <section id="chart" className="panel panel-active p-5">
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
            {loading ? "Loading history…" : `${data.length} data points · simulated feed`}
          </p>
        </div>

        <div className="flex gap-1 rounded-md border border-border bg-secondary/60 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setPeriod(p);
                // smooth scroll the chart into view below the navbar
                const el = document.querySelector("#chart");
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 96;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className={`btn-press rounded-sm px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-[1.06] hover:brightness-125 hover:shadow-[0_0_10px_rgba(56,189,248,0.35)] active:scale-[0.92] active:brightness-150 active:duration-75 cursor-pointer ${
                period.label === p.label
                  ? "bg-primary/15 text-primary underline underline-offset-4"
                  : "text-muted-foreground hover:text-white"
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
              tick={{ fill: "#e2e8f0", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              minTickGap={48}
            />
            <YAxis domain={["auto", "auto"]} hide orientation="right" />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: 12,
                fontFamily: "IBM Plex Mono",
              }}
              labelStyle={{ color: "#ffffff", fontFamily: "IBM Plex Sans" }}
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
