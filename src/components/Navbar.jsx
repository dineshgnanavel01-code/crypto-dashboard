/**
 * DINOC — Navbar
 * Reference-matched navbar: logo in a bordered rounded box, plain icon+text
 * nav items (no background pills), dark search box, bell button, compact
 * profile chip. Every button and nav item has explicit hover AND active
 * (click/press) effects: scale, glow, underline, and color transitions.
 *
 * Style: Midnight Precision Deck — dark navy, mono numerals, cyan accent.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { toast } from "sonner";
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiTrendingUp,
  FiBriefcase,
  FiActivity,
  FiList,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { COINS } from "../data/mockData";
import Logo from "./Logo";

/* ---------------------------------------------------------------
   Shared hover / click effect styles (applied to every interactive
   element so all of them react to hover AND to being clicked).
   - hover: lift/brighten + cyan glow ring + text turn white/cyan
   - active (mouse-down click): shrink slightly + press feedback
   --------------------------------------------------------------- */
const HOVER = "transition-all duration-200 hover:brightness-125 hover:scale-[1.03] hover:shadow-[0_0_14px_rgba(56,189,248,0.35)] active:scale-[0.95] active:brightness-150 active:duration-75 cursor-pointer";
const NAV_ITEM = `${HOVER} flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white focus-visible:text-white`;

export default function Navbar({ bySymbol, onSearchSelect }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileRect, setProfileRect] = useState(null);
  const [pressedNav, setPressedNav] = useState(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (!profileOpen || !profileRef.current) return;
    setProfileRect(profileRef.current.getBoundingClientRect());
  }, [profileOpen]);

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered =
    query.trim().length > 0
      ? COINS.filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.symbol.toLowerCase().includes(query.toLowerCase()),
        ).slice(0, 5)
      : [];

  const showDropdown = searchFocused && query.trim().length > 0;

  const nav = [
    { label: "Market", icon: FiTrendingUp, href: "#market" },
    { label: "Portfolio", icon: FiBriefcase, href: "#portfolio" },
    { label: "Trade", icon: FiActivity, href: "#trade" },
    { label: "History", icon: FiList, href: "#history" },
  ];

  const profileItems = [
    { label: "Profile", icon: FiUser, onClick: () => { setProfileOpen(false); toast("Profile view coming soon"); } },
    {
      label: "Settings",
      icon: FiSettings,
      onClick: () => {
        setProfileOpen(false);
        toast("Settings coming soon", { description: "Profile preferences will be available in the next update." });
      },
    },
    {
      label: "Sign out",
      icon: FiLogOut,
      onClick: () => {
        setProfileOpen(false);
        toast("Signed out (demo)", { description: "This is a demo terminal — no real session exists." });
      },
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo in bordered box (reference-matched) */}
        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5">
          <Logo />
        </div>

        {/* Desktop nav — plain icon+text, hover turns white/cyan, click presses */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className={NAV_ITEM}
              onMouseDown={() => setPressedNav(n.label)}
              onMouseUp={() => setPressedNav(null)}
              onMouseLeave={() => setPressedNav(null)}
            >
              <n.icon size={16} className={pressedNav === n.label ? "text-primary" : undefined} />
              <span className={`relative ${pressedNav === n.label ? "underline underline-offset-4 decoration-primary" : ""}`}>
                {n.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Search — dark box, cyan border on focus */}
          <div className="relative hidden sm:block">
            <FiSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Search coin..."
              className={`h-9 w-52 rounded-md border bg-slate-900/80 pl-9 pr-3 text-sm text-foreground placeholder:text-slate-500 focus:outline-none transition-all duration-200 ${
                searchFocused
                  ? "border-primary/70 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                  : "border-slate-700 hover:border-slate-500"
              }`}
              aria-label="Search cryptocurrency"
            />
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full z-[60] mt-1 overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-500">No coins found</div>
                ) : (
                  filtered.map((c) => (
                    <a
                      key={c.symbol}
                      href={`#${c.id}`}
                      onMouseDown={() => setQuery("")}
                      className={`flex w-full items-center justify-between px-3 py-2 text-sm text-slate-300 hover:text-white ${HOVER} hover:bg-slate-800`}
                    >
                      <span>
                        <span className="font-semibold">{c.symbol}</span>{" "}
                        <span className="text-slate-500">{c.name}</span>
                      </span>
                      {bySymbol?.[c.symbol] && (
                        <span className="font-mono text-xs text-slate-500">
                          ${bySymbol[c.symbol].current_price?.toLocaleString()}
                        </span>
                      )}
                    </a>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Notifications — bell with click-press effect */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:text-white ${HOVER} ${
                notifOpen ? "bg-slate-800 text-primary" : "border border-slate-700 hover:border-slate-500"
              }`}
              aria-label="Notifications"
              aria-expanded={notifOpen}
            >
              <FiBell size={16} className={notifOpen ? "scale-110" : undefined} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-[70] mt-2 w-64 overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl" style={{ maxWidth: "calc(100vw - 1rem)" }}>
                <div className="border-b border-slate-800 px-3 py-2 text-xs uppercase tracking-wider text-slate-500">
                  Notifications
                </div>
                {[
                  { t: "BTC crossed $64,200", s: "up" },
                  { t: "SOL order partially filled", s: "neutral" },
                  { t: "Weekly P/L +4.8%", s: "up" },
                ].map((n, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${HOVER}`}
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.s === "up" ? "bg-emerald-400" : "bg-primary"}`} />
                    <span>{n.t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile chip — compact, click toggles dropdown via portal */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className={`flex items-center gap-2.5 rounded-md border border-slate-700 bg-slate-900 py-1.5 pl-1.5 pr-2.5 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:shadow-[0_0_14px_rgba(56,189,248,0.25)] active:scale-[0.95] active:bg-slate-700 cursor-pointer ${
                profileOpen ? "border-primary/60 shadow-[0_0_14px_rgba(56,189,248,0.3)]" : ""
              }`}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-200 ${
                profileOpen ? "bg-primary text-slate-950" : "bg-primary/15 text-primary"
              }`}>
                <span className="text-xs font-bold">DC</span>
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <div className="text-xs font-semibold text-white">Dinoc</div>
                <div className="font-mono text-[10px] text-slate-500">Verified</div>
              </div>
              <FiChevronDown size={12} className={`hidden sm:block text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            {profileOpen &&
              createPortal(
                <div
                  className="fixed z-[100] w-52 overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl"
                  style={{
                    top: profileRect ? profileRect.bottom + 4 : 0,
                    right: Math.max(8, window.innerWidth - (profileRect ? profileRect.right : 0)),
                    maxWidth: "calc(100vw - 1rem)",
                  }}
                >
                  <div className="border-b border-slate-800 px-3 py-2.5">
                    <div className="text-sm font-semibold text-white">Dinoc</div>
                    <div className="font-mono text-[10px] text-slate-500">j.doe@voltex.io · Verified</div>
                  </div>
                  {profileItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-300 hover:text-white transition-colors duration-150 hover:bg-slate-800 active:bg-slate-700 active:scale-[0.98] ${HOVER}`}
                    >
                      <item.icon size={15} className="text-slate-500" />
                      {item.label}
                    </button>
                  ))}
                </div>,
                document.body,
              )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-slate-400 hover:text-white md:hidden ${HOVER} ${
              mobileOpen ? "border-primary/60 text-primary" : "border-slate-700 hover:border-slate-500"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={17} /> : <FiMenu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto max-w-[1440px] flex flex-col gap-1 px-4 py-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coin..."
              className="h-10 rounded-md border border-slate-700 bg-slate-900/80 px-3 text-sm placeholder:text-slate-500 focus:border-primary/70 focus:outline-none"
              aria-label="Search cryptocurrency"
            />
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-slate-400 hover:text-white transition-colors hover:bg-slate-800 active:bg-slate-700 ${HOVER}`}
              >
                <n.icon size={15} />
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
