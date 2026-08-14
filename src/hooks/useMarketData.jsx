/**
 * VOLTEX — hooks/useMarketData.jsx
 * Live market data provider:
 *  - pulls CoinGecko prices every 15s (public API, no key)
 *  - falls back to static mock data if the API is rate-limited
 *  - simulates realistic second-by-second micro-ticks between polls
 *    and emits flash events so price cells tint green/red on change.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COINS, MOCK_MARKET, fetchLiveMarket } from "../data/mockData";

const POLL_MS = 15000;
const TICK_MS = 1500;

export function useMarketData() {
  const [market, setMarket] = useState(null); // array | null
  const [live, setLive] = useState(false); // true when fed by real API
  const [loading, setLoading] = useState(true);
  const [flashes, setFlashes] = useState({}); // { [symbol]: 'up'|'down' }
  const baseRef = useRef(null);
  const marketRef = useRef(null);
  marketRef.current = market;

  const applyFlashes = useCallback((prev, next) => {
    const f = {};
    for (const coin of next) {
      const old = prev.find((p) => p.symbol === coin.symbol);
      if (old && old.current_price !== coin.current_price) {
        f[coin.symbol] = coin.current_price > old.current_price ? "up" : "down";
      }
    }
    if (Object.keys(f).length > 0) {
      setFlashes(f);
      window.setTimeout(() => setFlashes({}), 500);
    }
  }, []);

  // Initial load (retry once if rate-limited)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let data = null;
      try {
        data = await fetchLiveMarket(COINS.map((c) => c.id));
      } catch (e) {
        try {
          await new Promise((r) => setTimeout(r, 2000));
          data = await fetchLiveMarket(COINS.map((c) => c.id));
        } catch {
          data = null;
        }
      }
      if (cancelled) return;
      if (data) {
        baseRef.current = data;
        setMarket(data);
        setLive(true);
      } else {
        baseRef.current = MOCK_MARKET;
        setMarket(MOCK_MARKET);
        setLive(false);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Poll for fresh prices
  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(async () => {
      try {
        const data = await fetchLiveMarket(COINS.map((c) => c.id));
        applyFlashes(marketRef.current ?? [], data);
        baseRef.current = data;
        setMarket(data);
      } catch {
        // keep last known prices; API busy
      }
    }, POLL_MS);
    return () => window.clearInterval(t);
  }, [live, applyFlashes]);

  // Micro-tick simulation between polls for a living tape
  useEffect(() => {
    const t = window.setInterval(() => {
      const base = baseRef.current;
      if (!base) return;
      const next = base.map((c) => {
        // ±0.08% random walk
        const drift = (Math.random() - 0.5) * 0.0016;
        return { ...c, current_price: +(c.current_price * (1 + drift)).toFixed(2) };
      });
      applyFlashes(base, next);
      baseRef.current = next;
      setMarket(next);
    }, TICK_MS);
    return () => window.clearInterval(t);
  }, [applyFlashes]);

  const bySymbol = useMemo(() => {
    const m = {};
    for (const c of market ?? []) m[c.symbol] = c;
    return m;
  }, [market]);

  return { market, bySymbol, live, loading, flashes };
}
