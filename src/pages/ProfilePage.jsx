/**
 * VOLTEX — Profile page (/profile)
 * User profile view for J. Doe: identity card, verification status,
 * account settings rows and quick links.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { Link } from "wouter";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiShield,
  FiMail,
  FiSmartphone,
  FiKey,
  FiCreditCard,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import { useMarketData } from "../hooks/useMarketData";

export default function ProfilePage() {
  const { market, bySymbol } = useMarketData();

  const settings = [
    { icon: FiMail, label: "Email", value: "j.doe@voltex.io", action: "Change" },
    { icon: FiSmartphone, label: "Two-factor auth", value: "Enabled", action: "Manage" },
    { icon: FiKey, label: "API keys", value: "1 active key", action: "Manage" },
    { icon: FiCreditCard, label: "Payment methods", value: "Visa ·•••• 4821", action: "Manage" },
    { icon: FiBell, label: "Notifications", value: "Price alerts on", action: "Configure" },
    { icon: FiShield, label: "Security", value: "All checks passed", action: "Review" },
  ];

  return (
    <div className="min-h-screen">
      <Header bySymbol={bySymbol} />
      <TickerTape market={market} />

      <main className="container py-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link href="/" className="btn-press flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <FiArrowLeft size={13} />
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          {/* Identity card */}
          <section className="panel panel-active p-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary">
                <span className="font-display text-2xl font-bold">JD</span>
              </div>
              <h1 className="mt-3 font-display text-xl font-bold">J. Doe</h1>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">j.doe@voltex.io</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-up-dim px-2.5 py-1 text-[11px] font-medium up-text">
                <FiShield size={11} />
                Identity Verified
              </span>
              <div className="mt-5 grid w-full grid-cols-2 gap-3 text-center">
                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <div className="font-mono text-lg font-bold">$12,500</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Available</div>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <div className="font-mono text-lg font-bold">9</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Holdings</div>
                </div>
              </div>
              <button
                onClick={() => toast("Signed out (demo)", { description: "This is a demo terminal — no real session exists." })}
                className="btn-press mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FiLogOut size={14} />
                Sign out
              </button>
            </div>
          </section>

          {/* Settings */}
          <section className="panel panel-active p-5">
            <h2 className="mb-4 font-display text-lg font-bold">Account Settings</h2>
            <div className="flex flex-col">
              {settings.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 border-b border-border/60 py-3.5 last:border-0"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary/40 text-muted-foreground">
                    <s.icon size={16} />
                  </div>
                  <div className="flex-1 leading-tight">
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="font-mono text-xs text-muted-foreground">{s.value}</div>
                  </div>
                  <button
                    onClick={() => toast(`${s.label}: ${s.action} coming soon`, { description: "This demo terminal does not persist account changes." })}
                    className="btn-press rounded-md px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    {s.action}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-10 border-t border-border pt-4 pb-8 text-center text-[11px] text-muted-foreground">
          Voltex Terminal · Profile changes are simulated in this demo.
        </footer>
      </main>
    </div>
  );
}
