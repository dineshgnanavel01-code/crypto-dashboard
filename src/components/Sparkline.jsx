/**
 * VOLTEX — Sparkline
 * Deterministic pseudo-random sparkline (seeded by symbol) so every row has
 * a consistent mini chart without fetching per-row history. Draws in on mount.
 */
import { useEffect, useRef } from "react";

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Sparkline({ up, small, height = 32 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth || 90;
    const h = height;
    const rand = seededRand(up ? 123 : 456);
    const pts = [];
    let v = 50;
    for (let i = 0; i <= 24; i++) {
      v += (rand() - 0.48) * 22;
      v = Math.max(8, Math.min(h - 8, v));
      pts.push([Math.round((i / 24) * w), Math.round(h - v)]);
    }
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
    el.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", h);
    svg.style.overflow = "visible";
    const len = w * 1.2;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", up ? "var(--up)" : "var(--down)");
    path.setAttribute("stroke-width", small ? "1.5" : "2");
    path.setAttribute("stroke-linecap", "round");
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      path.style.transition = "stroke-dashoffset 600ms cubic-bezier(0.23, 1, 0.32, 1)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => (path.style.strokeDashoffset = "0"));
      });
    } else {
      path.style.strokeDashoffset = "0";
    }
    svg.appendChild(path);
    el.appendChild(svg);
  }, [up, small, height]);

  return <div ref={ref} className="h-full w-full" aria-hidden />;
}
