/**
 * DINOC — Account pages (SignIn / Profile / Settings)
 * Standalone full-screen pages with the DINOC navbar stripped away, so the
 * Sign Out flow lands on a clean Sign In page. Profile and Settings keep the
 * shared layout header for consistent navigation back to the dashboard.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FiZap,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiShield,
  FiBell,
  FiKey,
  FiLogIn,
  FiArrowLeft,
} from "react-icons/fi";
import Logo from "./Logo";

/* ---------------------------------------------------------------
   Shared styles: smooth hover/transition on every interactive element
   --------------------------------------------------------------- */
const HOVER = "transition-all duration-200 hover:brightness-125 hover:scale-[1.02] hover:shadow-[0_0_14px_rgba(56,189,248,0.3)] active:scale-[0.96] active:brightness-150 active:duration-75 cursor-pointer";
const INPUT =
  "h-11 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 pl-10 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-primary/70 focus:shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-all duration-200";

/** Tiny shared page header used by Profile & Settings (signin is full-screen) */
function PageTop({ title, subtitle }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors duration-200">
            <FiArrowLeft size={18} />
          </Link>
          {" "}{title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

/* ===============================================================
   SIGN IN PAGE — reached by clicking "Sign out" (or visiting /signin)
   =============================================================== */
export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSignIn(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    // Demo only — no backend; any credentials "sign in" instantly.
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome back!", { description: "Demo sign-in — no real session was created." });
      navigate("/");
    }, 700);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-10">
      <Link to="/" className="mb-8 flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5">
        <Logo />
      </Link>

      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur">
        <div className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-xl font-bold text-white">Sign in to Dinoc</h1>
          <p className="mt-1 text-xs text-slate-500">Demo terminal — no real authentication</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4 px-6 py-6">
          <div className="relative">
            <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="j.doe@voltex.io"
              className={INPUT}
              aria-label="Email address"
            />
          </div>

          <div className="relative">
            <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={INPUT}
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white ${HOVER}`}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" className="accent-primary" /> Remember me
            </label>
            <button type="button" className={`text-primary hover:underline ${HOVER}`} onClick={() => toast("Forgot-password is demo-only")}>
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: "#38bdf8", color: "#0c1220" }}
            className="btn-press flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_32px_rgba(56,189,248,0.5)] active:scale-[0.97] active:duration-75 disabled:opacity-60"
          >
            <FiLogIn size={16} />
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            New here?{" "}
            <button type="button" className={`font-semibold text-primary hover:underline ${HOVER}`} onClick={() => toast("Sign-up is demo-only")}>
              Create an account
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-[11px] text-slate-600">Dinoc Currency · Simulated demo · Not financial advice</p>
    </div>
  );
}

/* ===============================================================
   PROFILE PAGE
   =============================================================== */
export function ProfilePage() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Dinoc");
  const [username, setUsername] = useState("@dinoc_trader");
  const [bio, setBio] = useState("Long-term holder · DeFi enthusiast · Not financial advice.");

  return (
    <div className="min-h-screen">
      <main className="container max-w-2xl py-8">
        <PageTop title="Profile" subtitle="Your account identity and verification status" />

        {/* Identity card */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-4 border-b border-slate-800 px-5 py-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
              DC
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white focus:border-primary/70 focus:outline-none transition-all duration-200" aria-label="Display name" />
                  <input value={username} onChange={(e) => setUsername(e.target.value)} className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white focus:border-primary/70 focus:outline-none transition-all duration-200" aria-label="Username" />
                </div>
              ) : (
                <>
                  <div className="text-base font-semibold text-white">{name}</div>
                  <div className="font-mono text-xs text-slate-500">{username}</div>
                </>
              )}
            </div>
            <button
              onClick={() => {
                if (editing) toast.success("Profile saved");
                setEditing((v) => !v);
              }}
              className={`rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:border-primary/60 hover:text-primary ${HOVER}`}
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="space-y-1 px-5 py-4 text-sm">
            <div className="flex items-center gap-2.5 py-1.5 text-slate-300">
              <FiMail size={15} className="text-slate-500" /> j.doe@voltex.io
              <span className="ml-auto rounded-sm bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">Verified</span>
            </div>
            <div className="flex items-center gap-2.5 py-1.5 text-slate-300">
              <FiShield size={15} className="text-slate-500" /> 2FA enabled
              <span className="ml-auto rounded-sm bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">On</span>
            </div>
            <div className="flex items-center gap-2.5 py-1.5 text-slate-300">
              <FiUser size={15} className="text-slate-500" /> Account level
              <span className="ml-auto font-mono text-xs text-slate-400">Pro Trader</span>
            </div>
          </div>

          <div className="border-t border-slate-800 px-5 py-4">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bio</div>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-primary/70 focus:outline-none transition-all duration-200"
                aria-label="Bio"
              />
            ) : (
              <p className="text-sm text-slate-400">{bio}</p>
            )}
          </div>

          <div className="flex gap-2 border-t border-slate-800 px-5 py-4">
            <Link
              to="/settings"
              className={`rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-primary/60 hover:text-primary ${HOVER}`}
            >
              Open Settings
            </Link>
            <Link
              to="/"
              className={`rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 ${HOVER}`}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <button
          onClick={() => navigate("/signin")}
          className={`mt-5 flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-down/60 hover:text-down ${HOVER}`}
        >
          Sign out → Sign in page
        </button>
      </main>
    </div>
  );
}

/* ===============================================================
   SETTINGS PAGE
   =============================================================== */
export function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [darkTheme, setDarkTheme] = useState(true);
  const [twoFA, setTwoFA] = useState(true);

  function Toggle({ checked, onChange, label }) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => {
          onChange(!checked);
          toast(checked ? `${label} turned off` : `${label} turned on`);
        }}
        className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${checked ? "bg-primary" : "bg-slate-700"} ${HOVER}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </button>
    );
  }

  const rows = [
    { icon: FiBell, label: "Push notifications", desc: "Order fills, price moves and alerts", state: notifications, set: setNotifications },
    { icon: FiTrendingUpIcon, label: "Price alerts", desc: "Notify when a coin crosses your target", state: priceAlerts, set: setPriceAlerts },
    { icon: FiKey, label: "Two-factor authentication", desc: "Extra security on sign-in", state: twoFA, set: setTwoFA },
  ];

  return (
    <div className="min-h-screen">
      <main className="container max-w-2xl py-8">
        <PageTop title="Settings" subtitle="Preferences, security and notifications" />

        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3.5 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-primary">
                <r.icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white">{r.label}</div>
                <div className="text-xs text-slate-500">{r.desc}</div>
              </div>
              <Toggle checked={r.state} onChange={r.set} label={r.label} />
            </div>
          ))}

          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3.5 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-primary">
              <FiZap size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white">Dark theme</div>
              <div className="text-xs text-slate-500">Midnight Precision Deck (always on)</div>
            </div>
            <Toggle checked={darkTheme} onChange={setDarkTheme} label="Dark theme" />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            to="/profile"
            className={`rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-primary/60 hover:text-primary ${HOVER}`}
          >
            Open Profile
          </Link>
          <Link
            to="/"
            className={`rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 ${HOVER}`}
          >
            Back to Dashboard
          </Link>
        </div>

        <button
          onClick={() => navigate("/signin")}
          className={`mt-5 flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-down/60 hover:text-down ${HOVER}`}
        >
          Sign out → Sign in page
        </button>
      </main>
    </div>
  );
}

function FiTrendingUpIcon(props) {
  return (
    <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
