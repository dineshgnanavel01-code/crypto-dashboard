/**
 * VOLTEX — Header
 * Dark terminal header: Voltex wordmark + cyan tick logo, nav with real
 * page routes (Market / Portfolio / Trade / History), live coin search,
 * notification bell with unread dot, Dinoc profile dropdown, responsive
 * mobile menu.
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
} from "react-icons/fi";
import { COINS } from "../data/mockData";
import Logo from "./Logo";

export default function Header({ bySymbol, onSearchSelect }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileRect, setProfileRect] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen || !profileRef.current) return;
    setProfileRect(profileRef.current.getBoundingClientRect());
  }, [profileOpen]);

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
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

  const isActive = (href) => false;

  const profileItems = [
    { label: "Profile", icon: FiUser, onClick: () => alert("Profile view coming soon") },
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <a
                key={n.label}
                href={n.href}
                className={`btn-press flex items-center gap-2 rounded-md px-3.5 py-2 text-sm transition-colors duration-150 ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <n.icon size={15} />
                {n.label}
              </a>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden sm:block">
            <FiSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Search coin..."
              className="h-9 w-52 rounded-md border border-input bg-secondary/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none transition-colors"
              aria-label="Search cryptocurrency"
            />
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-xl">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">No coins found</div>
                ) : (
                  filtered.map((c) => (
                    <a
                      key={c.symbol}
                      href={`#${c.id}`}
                      onMouseDown={() => setQuery("")}
                      className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent"
                    >
                      <span>
                        <span className="font-semibold">{c.symbol}</span>{" "}
                        <span className="text-muted-foreground">{c.name}</span>
                      </span>
                      {bySymbol?.[c.symbol] && (
                        <span className="font-mono text-xs text-muted-foreground">
                          ${bySymbol[c.symbol].current_price?.toLocaleString()}
                        </span>
                      )}
                    </a>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="btn-press relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Notifications"
            >
              <FiBell size={16} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-up" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-[60] mt-1 w-64 overflow-hidden rounded-md border border-border bg-popover shadow-xl" style={{ maxWidth: "calc(100vw - 1rem)" }}>
                <div className="border-b border-border px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Notifications
                </div>
                {[
                  { t: "BTC crossed $64,200", s: "up" },
                  { t: "SOL order partially filled", s: "neutral" },
                  { t: "Weekly P/L +4.8%", s: "up" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2.5 text-sm">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.s === "up" ? "bg-up" : "bg-primary"}`}
                    />
                    <span>{n.t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* JD Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="btn-press flex items-center gap-2.5 rounded-md border border-border py-1.5 pl-1.5 pr-3 transition-colors hover:bg-accent"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
                <span className="font-display text-xs font-bold">DC</span>
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <div className="text-xs font-semibold">Dinoc</div>
                <div className="font-mono text-[10px] text-muted-foreground">Verified</div>
              </div>
            </button>
            {profileOpen &&
              createPortal(
                <div
                  className="fixed z-[100] w-52 overflow-hidden rounded-md border border-border bg-popover shadow-xl"
                  style={{
                    top: profileRect ? profileRect.bottom + 4 : 0,
                    right: Math.max(8, window.innerWidth - (profileRect ? profileRect.right : 0)),
                    maxWidth: "calc(100vw - 1rem)",
                  }}
                >
                <div className="border-b border-border px-3 py-2.5">
                  <div className="text-sm font-semibold">Dinoc</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    j.doe@voltex.io · Verified
                  </div>
                </div>
                {profileItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => (item.href ? setProfileOpen(false) : item.onClick())}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                  >

                    {item.href ? (
                      <a href={item.href} className="flex w-full items-center gap-2.5">
                        <item.icon size={15} className="text-muted-foreground" />
                        {item.label}
                      </a>
                    ) : (
                      <>
                        <item.icon size={15} className="text-muted-foreground" />
                        {item.label}
                      </>
                    )}
                  </button>
                ))}
              </div>,
                document.body,
              )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="btn-press flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={17} /> : <FiMenu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coin..."
              className="h-10 rounded-md border border-input bg-secondary/60 px-3 text-sm placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              aria-label="Search cryptocurrency"
            />
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive(n.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
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
