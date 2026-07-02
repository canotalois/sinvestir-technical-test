"use client";

import { useState } from "react";
import { Input } from "./Input";
import { formatAmountInput, parseAmountInput } from "./format";

interface AmountInputProps {
  readonly id: string;
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly className: string;
}

/** Amount field: groups thousands ("1 100") at rest, raw input when focused.
 *  Built on the numeric `Input` variant → digits/separators only, no spinner. */
export function AmountInput({
  id,
  value,
  onChange,
  className,
}: AmountInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft !== null ? draft : formatAmountInput(value);

  return (
    <Input
      id={id}
      variant="numeric"
      // Native backstop against pasted 30-digit nonsense; the real ceiling is
      // enforced by the schema (MAX_AMOUNT).
      maxLength={16}
      className={className}
      value={display}
      onFocus={() => setDraft(Number.isFinite(value) ? String(value) : "")}
      onBlur={() => {
        setDraft(null);
        // Leaving the field empty (or NaN) settles on 0 rather than a blank.
        if (!Number.isFinite(value)) onChange(0);
      }}
      onValueChange={(v) => {
        setDraft(v);
        onChange(parseAmountInput(v));
      }}
    />
  );
}
