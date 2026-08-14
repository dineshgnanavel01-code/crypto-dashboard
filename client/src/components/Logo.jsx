/**
 * VOLTEX — Logo
 * Brand mark: lightning mark + VOLTEX wordmark (VOL in white, TEX in cyan).
 * Inline SVG so no external images are needed.
 */
export default function Logo({ className = "" }) {
  return (
    <a href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 4.5 13.5h6.3L11 22l8.5-11.5h-6.3L13 2z" />
        </svg>
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        DIN<span className="cyan-text">OC</span>
      </span>
    </a>
  );
}
