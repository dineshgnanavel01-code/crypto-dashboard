/**
 * VOLTEX — NotFound (404)
 * Dark terminal-styled 404 with back-to-dashboard link.
 */
import { Link } from "wouter";
import { FiArrowLeft, FiZap } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="panel panel-active max-w-md p-8 text-center">
        <img
          src="/manus-storage/voltex-logo_0d46ff27.png"
          alt="Voltex logo"
          className="mx-auto h-12 w-12 object-contain"
        />
        <div className="mt-4 font-display text-6xl font-bold">
          4<span className="cyan-text">0</span>4
        </div>
        <h1 className="mt-3 font-display text-lg font-bold">Route not found</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          The terminal can't resolve that endpoint. Check the address and try again.
        </p>
        <Link
          href="/"
          className="btn-press mt-6 inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          <FiArrowLeft size={14} />
          Back to terminal
        </Link>
        <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <FiZap size={12} className="cyan-text" />
          Voltex Terminal
        </div>
      </div>
    </div>
  );
}
