import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Button — the primary interactive control (CLAUDE.md §3, §5.1).
 *
 * Variants map to the token system's transactional/editorial split:
 *  - primary    near-black (--color-btn-primary). Purchase/commit actions.
 *  - secondary  outline on surface. Neutral secondary actions.
 *  - link       terracotta text (--color-accent-strong). Editorial, low weight.
 *
 * Terracotta is never a filled purchase button (§3.1). Renders a real
 * <button> with a visible focus ring (handled globally in globals.css) and a
 * proper :disabled state.
 */
type Variant = "primary" | "secondary" | "link";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "motion-safe:duration-[var(--duration-hover)] motion-safe:ease-[var(--ease-out)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-btn-primary text-surface rounded-control hover:bg-deep " +
    "disabled:hover:bg-btn-primary",
  secondary:
    "bg-surface text-text border border-border rounded-control " +
    "hover:border-text",
  link:
    "bg-transparent text-accent-strong rounded-control underline-offset-4 " +
    "hover:text-accent-hover hover:underline px-0",
};

const sizes: Record<Size, string> = {
  md: "text-body px-5 py-2.5 min-h-11", // min-h-11 = 44px touch target
  sm: "text-small px-3.5 py-2 min-h-9",
};

/**
 * Shared class string for buttons AND link-styled-as-button (hero CTAs, etc.),
 * so an <a>/<Link> can match a <Button> exactly.
 */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return cn(
    base,
    variants[variant],
    variant === "link" ? "text-small min-h-0 py-1" : sizes[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props} />
  );
}
