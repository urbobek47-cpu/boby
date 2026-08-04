/**
 * Tiny className joiner. Filters falsy values so conditional classes read
 * cleanly: cn("base", active && "is-active"). No external dep needed for the
 * small components we build here.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
