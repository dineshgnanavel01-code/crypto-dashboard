/**
 * VOLTEX — Transactions
 * Trade history table: transaction ID, coin, type, amount, price, status
 * badge, and date/time. Newest first, responsive stacked view on mobile.
 */
import { FiCheck, FiClock, FiX } from "react-icons/fi";
import { formatPrice } from "../data/mockData";

export default function Transactions({ transactions }) {
  const sorted = [...transactions]
    .map((tx, i) => ({ ...tx, _idx: i }))
    .sort((a, b) => (a.time < b.time ? 1 : -1));

  return (
    <section className="panel p-5">
      <h3 className="mb-3 font-display text-sm font-bold">Recent Transactions</h3>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {["Tx ID", "Coin", "Type", "Amount", "Price", "Status", "Date/Time"].map((h) => (
                <th key={h} className="micro-label px-2 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((tx) => (
              <tr key={`${tx.id}-${tx._idx}`} className="border-b border-border/60 last:border-0">
                <td className="px-2 py-2.5 font-mono text-xs text-primary">{tx.id}</td>
                <td className="px-2 py-2.5 font-semibold">{tx.symbol}</td>
                <td className="px-2 py-2.5">
                  <span
                    className={`inline-flex rounded px-1.5 py-0.5 text-xs font-semibold ${
                      tx.type === "BUY" ? "bg-up-dim up-text" : "bg-down-dim down-text"
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="px-2 py-2.5 font-mono">{tx.amount}</td>
                <td className="px-2 py-2.5 font-mono">${formatPrice(tx.price)}</td>
                <td className="px-2 py-2.5">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-2 py-2.5 font-mono text-xs text-white">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked */}
      <div className="flex flex-col gap-2 md:hidden">
        {sorted.map((tx) => (
          <div key={`${tx.id}-${tx._idx}`} className="rounded-md border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-primary">{tx.id}</span>
              <StatusBadge status={tx.status} />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="font-semibold">
                <span className={tx.type === "BUY" ? "up-text" : "down-text"}>{tx.type}</span>{" "}
                {tx.symbol}
              </span>
              <span className="font-mono text-xs text-white">{tx.time}</span>
            </div>
            <div className="mt-1 flex items-center justify-between font-mono text-xs">
              <span>{tx.amount} {tx.symbol}</span>
              <span>${formatPrice(tx.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  const config = {
    completed: { label: "Completed", cls: "bg-up-dim up-text", icon: FiCheck },
    pending: { label: "Pending", cls: "bg-accent text-accent-foreground", icon: FiClock },
    failed: { label: "Failed", cls: "bg-down-dim down-text", icon: FiX },
  }[status] ?? { label: status, cls: "bg-accent text-accent-foreground", icon: FiClock };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold ${config.cls}`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}
