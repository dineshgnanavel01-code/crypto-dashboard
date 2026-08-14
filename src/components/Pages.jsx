/**
 * Dinoc Currency — Per-page views
 * Each navbar item (Market / Portfolio / Trade / History) is a real, separate
 * page. These views render only the content relevant to that page, keeping
 * the shared navbar, ticker tape, status bar and footer on every page.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTrendingUp, FiBriefcase, FiActivity, FiList } from "react-icons/fi";
import { toast } from "sonner";
import MarketOverview from "./MarketOverview";
import PriceChart from "./PriceChart";
import OrderBook from "./OrderBook";
import Portfolio from "./Portfolio";
import Transactions from "./Transactions";
import TradePanel from "./TradePanel";
import { COINS } from "../data/mockData";

/** / — full dashboard: all sections on one page */
export function DashboardGrid({ market, bySymbol, flashes, loading, selectedSymbol, setSelectedSymbol, transactions, usdtBalance, focus }) {
  void focus;
  function handleTrade({ symbol, type, amount, price, orderType }) {
    void { symbol, type, amount, price, orderType, usdtBalance };
  }
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_320px]">
      <div className="order-2 flex flex-col gap-4 xl:order-1">
        <Portfolio bySymbol={bySymbol} />
        <MarketOverview market={market} flashes={flashes} loading={loading} onSelect={(s) => setSelectedSymbol(s)} />
      </div>
      <div className="order-1 xl:order-2">
        <PriceChart bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
        <div className="mt-4">
          <Transactions transactions={transactions} />
        </div>
      </div>
      <div className="order-3 flex flex-col gap-4">
        <TradePanel bySymbol={bySymbol} selectedSymbol={selectedSymbol} onSelectPair={(s) => setSelectedSymbol(s)} onTrade={handleTrade} />
        <OrderBook bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
      </div>
    </div>
  );
}

const PAGE_LINKS = [
  { label: "Market", path: "/market", icon: FiTrendingUp },
  { label: "Portfolio", path: "/portfolio", icon: FiBriefcase },
  { label: "Trade", path: "/trade", icon: FiActivity },
  { label: "History", path: "/history", icon: FiList },
];

/* Shared page header: title, blurb, quick links to the other pages */
function PageHead({ icon: Icon, title, blurb }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon size={18} />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold">{title}</h1>
          <p className="text-xs text-muted-foreground">{blurb}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Jump to:</span>
        {PAGE_LINKS.filter((p) => p.label !== title).map((p) => (
          <Link
            key={p.path}
            to={p.path}
            className="btn-press flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-400 transition-all duration-200 hover:scale-[1.04] hover:border-slate-500 hover:text-white active:scale-[0.95]"
          >
            <p.icon size={12} />
            {p.label}
            <FiArrowRight size={11} />
          </Link>
        ))}
      </div>
    </div>
  );
}

/** /portfolio — full-page portfolio view */
export function PortfolioPage({ bySymbol, loading }) {
  return (
    <div>
      <PageHead
        icon={FiBriefcase}
        title="Portfolio"
        blurb={loading ? "Loading market data…" : "Your holdings, balances and asset allocation"}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr_320px]">
        <Portfolio bySymbol={bySymbol} />
        <PriceChart bySymbol={bySymbol} selectedSymbol="BTC" />
        <OrderBook bySymbol={bySymbol} selectedSymbol="BTC" />
      </div>
    </div>
  );
}

/** /market — full-page market overview view */
export function MarketPage({ market, bySymbol, flashes, loading, selectedSymbol, setSelectedSymbol }) {
  return (
    <div>
      <PageHead
        icon={FiTrendingUp}
        title="Market"
        blurb={loading ? "Loading market data…" : "Live spot prices and market caps · USDT pairs"}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr_320px]">
        <MarketOverview
          market={market}
          flashes={flashes}
          loading={loading}
          onSelect={(s) => setSelectedSymbol(s)}
        />
        <PriceChart bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
        <OrderBook bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
      </div>
    </div>
  );
}

/** /trade — full-page trading view */
export function TradePage({ bySymbol, selectedSymbol, setSelectedSymbol, usdtBalance }) {
  const [transactions, setTransactions] = useState(() => {
    const t = window.__txStore;
    return t && t.length > 0 ? t : [];
  });

  function handleTrade({ symbol, type, amount, price }) {
    const now = new Date();
    const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const tx = {
      id: `TX-APP${String(Math.floor(Math.random() * 9000) + 1000)}`,
      symbol,
      type,
      amount,
      price,
      orderType: "Market",
      status: "completed",
      time,
    };
    window.__txStore = [tx, ...(window.__txStore ?? [])];
    setTransactions((prev) => [tx, ...prev]);
    toast.success(
      `${type === "BUY" ? "Bought" : "Sold"} ${amount} ${symbol} @ $${price.toLocaleString()}`,
      { description: "Simulated order executed (front end only)" },
    );
  }

  return (
    <div>
      <PageHead
        icon={FiActivity}
        title="Trade"
        blurb={`Available balance: $${(usdtBalance ?? 12500).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT · Simulated orders, no fees`}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_1fr_320px]">
        <div className="flex flex-col gap-4">
          <TradePanel
            bySymbol={bySymbol}
            selectedSymbol={selectedSymbol}
            onSelectPair={(s) => setSelectedSymbol(s)}
            onTrade={handleTrade}
          />
          <OrderBook bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
        </div>
        <PriceChart bySymbol={bySymbol} selectedSymbol={selectedSymbol} />
        <Transactions transactions={transactions.slice(0, 8)} compact />
      </div>
    </div>
  );
}

/** /history — full-page transaction history view */
export function HistoryPage({ transactions, bySymbol }) {
  const byType = useMemo(() => {
    const counts = { BUY: 0, SELL: 0 };
    transactions.forEach((t) => { counts[t.type] = (counts[t.type] ?? 0) + 1; });
    return counts;
  }, [transactions]);

  return (
    <div>
      <PageHead
        icon={FiList}
        title="History"
        blurb={`${transactions.length} transactions · ${byType.BUY ?? 0} buys · ${byType.SELL ?? 0} sells`}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <Transactions transactions={transactions} />
        <div className="flex flex-col gap-4">
          <Portfolio bySymbol={bySymbol} />
          <div className="panel panel-active p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Symbols</div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {COINS.slice(0, 8).map((c) => (
                <Link
                  key={c.symbol}
                  to={`/market`}
                  className="btn-press rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-300 transition-all duration-150 hover:border-primary/50 hover:text-white active:scale-[0.96]"
                >
                  {c.symbol}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
