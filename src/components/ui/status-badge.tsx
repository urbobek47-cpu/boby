import { cn } from "@/lib/cn";

/**
 * StatusBadge — inventory and order status pills (CLAUDE.md §4, §5.3).
 *
 * These map directly to the data model's states, so the visual language of
 * availability is defined once here and reused across catalogue, artwork and
 * cart. Fully-rounded pill radius (§3.3).
 *
 * Status is never conveyed by colour alone (§5.1) — every badge carries a
 * text label, and the reserved state uses the honest wording required by §5.3
 * ("in someone else's cart", never "sold").
 */
export type BadgeTone = "neutral" | "warm" | "positive" | "muted" | "critical";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface text-text border border-border",
  warm: "bg-sand text-accent-hover border border-stone",
  positive: "bg-surface text-success border border-success/30",
  muted: "bg-stone/50 text-text-muted border border-stone",
  critical: "bg-surface text-error border border-error/30",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-caption font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
