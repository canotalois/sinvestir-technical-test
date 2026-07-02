"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export type InputVariant = "text" | "numeric" | "date";

const NUMERIC_STRIP = /[^\d\s.,]/g;

/**
 * "dd/mm/yyyy" mask that caps each segment (2 day, 2 month, 4 year) without
 * ever shifting digits across the slashes. It keeps the slashes the user
 * already has instead of re-deriving from a digit run, so deleting a digit in
 * the middle stays put ("01/05/2013" minus the "5" → "01/0/2013", not a
 * cascading "01/02/013"). While typing forward, a slash is auto-inserted once a
 * segment fills, so the user never has to type them; on delete nothing is added.
 */
export function maskDate(value: string, isDeleting = false): string {
  const parts = value.replace(/[^\d/]/g, "").split("/");
  const day = (parts[0] ?? "").slice(0, 2);
  const month = (parts[1] ?? "").slice(0, 2);
  const year = (parts[2] ?? "").slice(0, 4);

  let out = day;
  if (parts.length >= 2) out += `/${month}`;
  if (parts.length >= 3) out += `/${year}`;

  if (!isDeleting) {
    if (parts.length === 1 && day.length === 2) out += "/";
    else if (parts.length === 2 && month.length === 2) out += "/";
  }
  return out;
}

const INPUT_MODE: Record<InputVariant, "text" | "decimal" | "numeric"> = {
  text: "text",
  numeric: "decimal",
  date: "numeric",
};

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  readonly variant?: InputVariant;
  /** Called with the variant-filtered value on every change. */
  readonly onValueChange?: (value: string) => void;
}

/**
 * Text input that only accepts characters relevant to its variant - a letter
 * typed (or pasted) into a `date`/`numeric` field is dropped before it reaches
 * the value. Everything else is a plain `<input>` (styling via `className`).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "text", onValueChange, inputMode, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="text"
      inputMode={inputMode ?? INPUT_MODE[variant]}
      onChange={(e) => {
        const raw = e.target.value;
        const native = e.nativeEvent;
        const isDeleting =
          native instanceof InputEvent &&
          (native.inputType?.startsWith("delete") ?? false);
        const cleaned =
          variant === "date"
            ? maskDate(raw, isDeleting)
            : variant === "numeric"
              ? raw.replace(NUMERIC_STRIP, "")
              : raw;
        onValueChange?.(cleaned);
      }}
      {...rest}
    />
  );
});
