"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "./icons";
import { Skeleton } from "./Skeleton";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectProps {
  readonly value: string;
  readonly options: readonly SelectOption[];
  readonly onChange: (value: string) => void;
  readonly ariaLabel: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  /** Show a skeleton (matching the value height) instead of the value. */
  readonly loading?: boolean;
}

const TRIGGER =
  "flex w-full cursor-pointer items-center justify-between gap-3 border-0 border-b border-blue-light/30 bg-transparent py-2 text-left text-[20px] font-light text-white outline-none transition-colors data-[state=open]:border-blue-sky disabled:cursor-default disabled:text-white/55 [&[data-state=open]_.cs-chevron]:rotate-180";
const ITEM =
  "group flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-transparent px-3 py-2 text-left text-sm font-light text-white outline-none transition-colors data-[highlighted]:bg-white/[0.06] data-[state=checked]:text-blue-sky";

/** Subtle « glass » shadow for the menu (inner top border + depth). */
const MENU_SHADOW = {
  boxShadow:
    "inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 0 0 1px rgb(0 0 0 / 0.05), 0 20px 25px -5px rgb(0 0 0 / 0.35), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
} as const;

/** S'investir-styled select built on Radix (keyboard, focus and positioning
 *  handled by the primitive; we only provide the 1:1 glassy styling). */
export function Select({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder,
  disabled = false,
  loading = false,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger className={TRIGGER} aria-label={ariaLabel}>
        {loading ? (
          <Skeleton className="my-[3px] h-[24px] w-40" />
        ) : (
          <SelectPrimitive.Value placeholder={placeholder ?? "…"} />
        )}
        <SelectPrimitive.Icon className="cs-chevron shrink-0 text-blue-light transition-transform">
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={8}
          className="z-50 max-h-[320px] w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-2 ring-1 ring-black/5 backdrop-blur-2xl"
          style={MENU_SHADOW}
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={ITEM}
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white/30 transition-colors group-data-[state=checked]:border-blue-sky group-data-[state=checked]:bg-blue-sky">
                  <CheckIcon className="hidden h-3 w-3 text-white group-data-[state=checked]:block" />
                </span>
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
