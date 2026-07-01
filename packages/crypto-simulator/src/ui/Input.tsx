"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export type InputVariant = "text" | "numeric" | "date";

// Characters stripped out per variant (kept: digits + separators for amounts,
// digits + "/" for dates). "text" keeps everything.
const STRIP: Record<Exclude<InputVariant, "text">, RegExp> = {
  numeric: /[^\d\s.,]/g,
  date: /[^\d/]/g,
};

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
 * Text input that only accepts characters relevant to its variant — a letter
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
        const cleaned =
          variant === "text" ? raw : raw.replace(STRIP[variant], "");
        onValueChange?.(cleaned);
      }}
      {...rest}
    />
  );
});
