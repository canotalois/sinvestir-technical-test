"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDownIcon, CheckIcon } from "./icons";
import { Input } from "./Input";
import { Skeleton } from "./Skeleton";
import { TRIGGER, ITEM, MENU_SHADOW, type SelectOption } from "./Select";

interface ComboboxProps {
  readonly value: string;
  readonly options: readonly SelectOption[];
  readonly onChange: (value: string) => void;
  readonly ariaLabel: string;
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly disabled?: boolean;
  /** Show a skeleton (matching the value height) instead of the value. */
  readonly loading?: boolean;
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-blue-light"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/** Searchable select (combobox) built on Radix Popover - same glassy styling as
 *  `Select`, plus a filter input and ↑/↓/Enter keyboard navigation. Used for the
 *  asset picker (top 100 coins), where a plain select is unusable. */
export function Combobox({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder,
  searchPlaceholder = "Rechercher…",
  disabled = false,
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.children[active];
    if (node instanceof HTMLElement) node.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[active];
      if (opt) choose(opt.value);
    }
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (disabled) return;
        setOpen(next);
        if (next) {
          setQuery("");
          setActive(0);
        }
      }}
    >
      <Popover.Trigger
        className={TRIGGER}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {loading ? (
          <Skeleton className="my-[3px] h-[24px] w-40" />
        ) : (
          <span className={`truncate ${selected ? "" : "text-blue-light/60"}`}>
            {selected?.label ?? placeholder ?? "…"}
          </span>
        )}
        <span className="cs-chevron shrink-0 text-blue-light transition-transform">
          <ChevronDownIcon />
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-xl border border-white/10 bg-white/5 p-2 ring-1 ring-black/5 backdrop-blur-2xl"
          style={MENU_SHADOW}
        >
          <div className="mb-2 flex items-center gap-2 border-b border-white/10 px-2 pb-2">
            <SearchIcon />
            <Input
              variant="text"
              autoFocus
              value={query}
              onValueChange={(v) => {
                setQuery(v);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full bg-transparent py-1 text-sm font-light text-white outline-none placeholder:text-blue-light/50"
            />
          </div>

          <div
            ref={listRef}
            role="listbox"
            className="max-h-[260px] overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm font-light text-blue-light/70">
                Aucun résultat
              </p>
            ) : (
              filtered.map((option, i) => {
                const checked = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => choose(option.value)}
                    onMouseMove={() => setActive(i)}
                    className={`${ITEM} ${i === active ? "bg-white/[0.06]" : ""} ${checked ? "text-blue-sky" : ""}`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        checked
                          ? "border-blue-sky bg-blue-sky"
                          : "border-white/30"
                      }`}
                    >
                      {checked ? (
                        <CheckIcon className="h-3 w-3 text-white" />
                      ) : null}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
