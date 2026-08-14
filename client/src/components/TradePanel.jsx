/**
 * VOLTEX — TradePanel
 * Trade form: pair selector, live market price, buy/sell tabs, amount and
 * price inputs with live total calculation, order type selector, and a
 * confirmation modal. Inputs validate live and give instant feedback.
 */
import { useMemo, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import { COINS, formatPrice } from "../data/mockData";

const ORDER_TYPES = ["Limit", "Market", "Stop-Limit"];

export default function TradePanel({ bySymbol, selectedSymbol, onSelectPair, onTrade, flashes, loading }) {
  const coin = COINS.find((c) => c.symbol === selectedSymbol) ?? COINS[0];
  const market = bySymbol?.[coin.symbol];
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("Limit");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const livePrice = market?.current_price;
  const amountNum = parseFloat(amount) || 0;
  const priceNum =
    orderType === "Market" ? livePrice ?? 0 : parseFloat(price) || 0;
  const total = amountNum * priceNum;

  function setPriceFromMarket() {
    if (livePrice) setPrice(formatPrice(livePrice));
  }

  function submit() {
    if (amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (orderType !== "Market" && priceNum <= 0) {
      toast.error(orderType === "Limit" ? "Set a limit price" : "Set a stop price");
      return;
    }
    setOpenModal(true);
  }

  function confirmTrade() {
    setOpenModal(false);
    onTrade?.({
      symbol: coin.symbol,
      type: side.toUpperCase(),
      amount: amountNum,
      price: priceNum,
      orderType,
      status: "completed",
    });
    setAmount("");
    setPrice("");
    toast.success(`${side === "buy" ? "Bought" : "Sold"} ${amountNum} ${coin.symbol} @ $${formatPrice(priceNum)}`);
  }

  const presets = useMemo(() => {
    const bal = 12500;
    const px = priceNum || livePrice || 1;
    return [25, 50, 75, 100].map((pct) =>
      ((bal * pct) / 100 / px).toFixed(6),
    );
  }, [priceNum, livePrice]);

  return (
    <>
      <section className="panel panel-active flex flex-col p-5">
        {/* Pair selector */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <select
              value={coin.symbol}
              onChange={(e) => onSelectPair?.(e.target.value)}
              className="rounded-md border border-input bg-secondary/60 px-2.5 py-1.5 text-sm font-semibold focus:border-primary/60 focus:outline-none"
              aria-label="Select trading pair"
            >
              {COINS.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.pair}
                </option>
              ))}
            </select>
            {livePrice && (
              <span className="font-mono text-sm font-medium">{`$${formatPrice(livePrice)}`}</span>
            )}
          </div>
          <span className="micro-label">Spot</span>
        </div>

        {/* Buy/Sell tabs */}
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-md bg-secondary/60 p-1">
          {["buy", "sell"].map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`btn-press rounded-sm py-2 text-sm font-semibold capitalize transition-all duration-200 hover:scale-[1.03] hover:brightness-115 hover:shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-[0.96] active:duration-75 ${
                side === s
                  ? s === "buy"
                    ? "bg-up text-black shadow-[0_0_16px_rgba(52,211,153,0.45)]"
                    : "bg-down text-white shadow-[0_0_16px_rgba(248,113,113,0.45)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Order type */}
        <div className="mb-3">
          <div className="micro-label mb-1.5">Order Type</div>
          <div className="flex gap-1">
            {ORDER_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  orderType === t
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-3">
          <div className="micro-label mb-1.5 flex justify-between">
            <span>Amount ({coin.symbol})</span>
            <button
              onClick={() => setPriceFromMarket()}
              className="text-primary hover:underline"
              type="button"
            >
              Use market price
            </button>
          </div>
          <div className="flex items-center rounded-md border border-input bg-secondary/60 focus-within:border-primary/60">
            <FiMinus
              size={14}
              className="cursor-pointer px-2 text-muted-foreground"
              onClick={() => setAmount((v) => String(Math.max(0, (parseFloat(v) || 0) - 1)))}
            />
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              className="w-full bg-transparent py-2 text-sm font-mono focus:outline-none"
              aria-label="Amount"
            />
            <FiPlus
              size={14}
              className="cursor-pointer px-2 text-muted-foreground"
              onClick={() => setAmount((v) => String((parseFloat(v) || 0) + 1))}
            />
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {presets.map((v, i) => (
              <button
                key={i}
                onClick={() => setAmount(v)}
                className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {["25%", "50%", "75%", "100%"][i]}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        {orderType !== "Market" && (
          <div className="mb-3">
            <div className="micro-label mb-1.5">
              {orderType === "Limit" ? "Limit Price (USDT)" : "Stop Price (USDT)"}
            </div>
            <input
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              className="w-full rounded-md border border-input bg-secondary/60 px-3 py-2 text-sm font-mono focus:border-primary/60 focus:outline-none"
              aria-label="Price"
            />
          </div>
        )}

        {/* Total */}
        <div className="mb-4 flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2">
          <span className="micro-label">Total (USDT)</span>
          <span className="font-mono text-sm font-semibold">
            {total > 0 ? `$${total.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "0.00"}
          </span>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          className={`btn-press w-full rounded-md py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-[0_6px_24px_rgba(56,189,248,0.25)] hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] active:shadow-none active:translate-y-0 active:duration-75 ${
            side === "buy"
              ? "bg-up shadow-[0_4px_18px_rgba(52,211,153,0.3)]"
              : "bg-down shadow-[0_4px_18px_rgba(248,113,113,0.3)]"
          }`}
        >
          {side === "buy" ? `Buy ${coin.symbol}` : `Sell ${coin.symbol}`}
        </button>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Available balance: $12,500.00 USDT · No fees on simulated orders
        </p>
      </section>

      {openModal && (
        <TradeModal
          coin={coin.symbol}
          side={side}
          amount={amountNum}
          price={priceNum}
          total={total}
          orderType={orderType}
          onConfirm={confirmTrade}
          onCancel={() => setOpenModal(false)}
        />
      )}
    </>
  );
}
/**

 * VOLTEX — TradeModal
 * Trade confirmation dialog: reviews side, amount, price, total and order
 * type before executing. Buy confirms in green, sell in red.
 */

function TradeModal({ coin, side, amount, price, total, orderType, onConfirm, onCancel }) {
  const accent = side === "buy" ? "bg-up text-black" : "bg-down text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-popover shadow-2xl">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-bold">Confirm {side === "buy" ? "Buy" : "Sell"}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Review the order details before submitting.</p>
        </div>

        <div className="space-y-2 p-5 text-sm">
          {[
            ["Pair", coin],
            ["Order Type", orderType],
            ["Amount", `${amount} ${coin}`],
            ["Price", `$${formatPrice(price)}`],
            ["Total", `$${total.toLocaleString("en-US", { maximumFractionDigits: 2 })}`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="micro-label">{k}</span>
              <span className="font-mono font-medium">{v}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-border bg-secondary/30 px-5 py-4">
          <button
            onClick={onCancel}
            className="btn-press flex-1 rounded-md border border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn-press flex-1 rounded-md py-2.5 text-sm font-bold text-white hover:opacity-90 ${accent}`}
          >
            {side === "buy" ? `Buy ${coin}` : `Sell ${coin}`}
          </button>
        </div>
      </div>
    </div>
  );
}
