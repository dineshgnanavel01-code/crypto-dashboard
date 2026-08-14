/**
 * VOLTEX — IconButton
 * Generic icon button with toast feedback for placeholder actions.
 */
import { toast } from "sonner";

export default function IconButton({ icon: Icon, label, onClick, active, className = "" }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else {
      toast(`${label} — feature coming soon`);
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleClick}
      className={`btn-press flex h-9 items-center justify-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 text-sm transition-colors duration-150 hover:border-primary/30 hover:bg-accent/40 ${active ? "border-primary/50 bg-primary/10 text-primary" : "text-foreground"} ${className}`}
    >
      {Icon ? <Icon size={16} /> : label}
    </button>
  );
}
