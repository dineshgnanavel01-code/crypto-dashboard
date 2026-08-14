/**
 * VOLTEX — TradeModal
 * Trade confirmation dialog: reviews side, amount, price, total and order
 * type before executing. Buy confirms in green, sell in red.
 */
import { formatPrice } from "../data/mockData";

export default function TradeModal({ coin, side, amount, price, total, orderType, onConfirm, onCancel }) {
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
