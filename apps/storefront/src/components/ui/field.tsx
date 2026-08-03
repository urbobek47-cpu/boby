import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Field — a labelled text input with accessible error handling (CLAUDE.md §5.1).
 *
 * - Real <label> tied to the input via htmlFor/id.
 * - Error text is associated with aria-describedby and aria-invalid, so screen
 *   readers announce it — not colour alone (§5.1).
 * - Control radius + border tokens (§3.3). Logical padding only (§5.2).
 */
export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Field({
  label,
  error,
  hint,
  id,
  className,
  required,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-small font-medium text-text">
        {label}
        {required && (
          <span className="text-accent-strong" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-caption text-text-muted">
          {hint}
        </p>
      )}

      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-h-11 rounded-control border bg-surface px-3.5 py-2.5 text-body text-text",
          "placeholder:text-text-muted",
          error ? "border-error" : "border-border",
          className,
        )}
        {...props}
      />

      {error && (
        <p id={errorId} className="text-caption text-error">
          {error}
        </p>
      )}
    </div>
  );
}
