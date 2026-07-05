"use client";

import { useRef, useState, type CSSProperties } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  DayPicker,
  getDefaultClassNames,
  type DateRange,
} from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { fromDateInputValue, formatDateShort } from "./format";
import { Input } from "./Input";
import { LabelTooltip } from "./Tooltip";
import { useNarrowViewport } from "./useMediaQuery";
import { ViewCalendarIcon } from "./icons";

interface DateRangeFieldProps {
  /** Start date, "yyyy-mm-dd". */
  readonly from: string;
  /** End date, "yyyy-mm-dd". */
  readonly to: string;
  readonly onFromChange: (value: string) => void;
  readonly onToChange: (value: string) => void;
  /** Earliest selectable date (asset's first data point), "yyyy-mm-dd". */
  readonly minDate?: string | undefined;
  readonly disabled?: boolean;
}

type Field = "from" | "to";

/** "yyyy-mm-dd" → local Date (same y/m/d, no timezone shift), or undefined. */
function ymdToDate(value: string): Date | undefined {
  const ts = fromDateInputValue(value);
  if (!Number.isFinite(ts)) return undefined;
  const d = new Date(ts);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Local Date → "yyyy-mm-dd". */
function dateToYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** First day of the month for a "yyyy-mm-dd" value, or undefined. */
function monthStart(value: string): Date | undefined {
  const d = ymdToDate(value);
  return d ? new Date(d.getFullYear(), d.getMonth(), 1) : undefined;
}

/** "dd/mm/yyyy" typed by the user → "yyyy-mm-dd", or null if not a real date. */
function parseTyped(text: string): string | null {
  const m = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m === null) return null;
  const [, d, mo, y] = m;
  if (d === undefined || mo === undefined || y === undefined) return null;
  const ymd = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return Number.isFinite(fromDateInputValue(ymd)) ? ymd : null;
}

/** Today minus `n` years as "yyyy-mm-dd" (local). */
function yearsAgoYmd(n: number): string {
  const t = new Date();
  return dateToYmd(new Date(t.getFullYear() - n, t.getMonth(), t.getDate()));
}

// S'investir glass theming: a continuous range band with filled endpoints and
// no per-day borders (a border toggling on select/deselect is what flickered).
const RDP_VARS = {
  "--rdp-accent-color": "#1098f7",
  "--rdp-accent-background-color": "rgb(16 152 247 / 0.16)",
  "--rdp-today-color": "#1098f7",
  "--rdp-day-width": "40px",
  "--rdp-day-height": "40px",
  "--rdp-day_button-width": "40px",
  "--rdp-day_button-height": "40px",
  "--rdp-selected-border": "2px solid transparent",
  "--rdp-range_middle-color": "#ffffff",
  "--rdp-outside-opacity": "0.35",
  "--rdp-disabled-opacity": "0.3",
} as CSSProperties;

const DATA_START = new Date(2013, 0, 1);
const INPUT =
  "w-full min-w-0 border-0 bg-transparent py-2 text-[20px] font-light text-white outline-none placeholder:text-blue-light/50";
const PRESET =
  "rounded-full border border-white/10 px-3 py-1 text-xs font-light text-white transition-colors hover:border-white/20 hover:bg-white/10";

export function DateRangeField({
  from,
  to,
  onFromChange,
  onToChange,
  minDate,
  disabled = false,
}: DateRangeFieldProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Field>("from");
  const [picking, setPicking] = useState(false);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [draftFrom, setDraftFrom] = useState<string | null>(null);
  const [draftTo, setDraftTo] = useState<string | null>(null);
  const [month, setMonth] = useState<Date>(
    () => monthStart(from) ?? monthStart(to) ?? new Date(),
  );
  const narrow = useNarrowViewport();

  const rootRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const minDateObj = minDate !== undefined ? ymdToDate(minDate) : undefined;
  const fromDate = ymdToDate(from);
  const toDate = ymdToDate(to);

  let selected: DateRange | undefined;
  if (picking && fromDate && hovered) {
    selected =
      hovered.getTime() >= fromDate.getTime()
        ? { from: fromDate, to: hovered }
        : { from: hovered, to: fromDate };
  } else if (fromDate || toDate) {
    selected = { from: fromDate, to: toDate };
  }

  function goToMonth(value: string) {
    const m = monthStart(value);
    if (m) setMonth(m);
  }

  function focusField(field: Field) {
    setActive(field);
    setPicking(false);
    setHovered(null);
    setOpen(true);
    goToMonth(field === "from" ? from : to);
  }

  function handleTyped(field: Field, text: string) {
    if (field === "from") setDraftFrom(text);
    else setDraftTo(text);
    const parsed = parseTyped(text);
    if (parsed !== null) {
      (field === "from" ? onFromChange : onToChange)(parsed);
      goToMonth(parsed);
    }
  }

  function handleBlur(field: Field) {
    if (field === "from") setDraftFrom(null);
    else setDraftTo(null);
  }

  function applyPreset(presetFrom: string) {
    onFromChange(presetFrom);
    onToChange(dateToYmd(new Date()));
    setPicking(false);
    goToMonth(presetFrom);
    setOpen(false);
  }

  function handleDayClick(day: Date) {
    setHovered(null);
    const ymd = dateToYmd(day);
    const ts = day.getTime();
    if (active === "from") {
      onFromChange(ymd);
      const toTs = fromDateInputValue(to);
      if (Number.isFinite(toTs) && ts > toTs) onToChange("");
      setActive("to");
      setPicking(true);
      return;
    }
    const fromTs = fromDateInputValue(from);
    if (Number.isFinite(fromTs) && ts < fromTs) {
      onFromChange(ymd);
      setActive("to");
      setPicking(true);
      return;
    }
    onToChange(ymd);
    setPicking(false);
    setOpen(false);
  }

  const dcn = getDefaultClassNames();
  const disabledDays = minDateObj
    ? { before: minDateObj, after: today }
    : { after: today };
  const segmentBorder = (field: Field) =>
    open && active === field ? "border-blue-sky" : "border-blue-light/30";

  const presets = [
    { label: "1 an", from: yearsAgoYmd(1) },
    { label: "5 ans", from: yearsAgoYmd(5) },
    { label: "Depuis 2020", from: "2020-01-01" },
    { label: "Max", from: minDate ?? dateToYmd(DATA_START) },
  ];

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setPicking(false);
      }}
    >
      <Popover.Anchor asChild>
        <div ref={rootRef} className="flex w-full items-center gap-3">
          <div
            className={`flex flex-1 items-center border-b transition-colors ${segmentBorder("from")}`}
          >
            <Input
              ref={fromRef}
              variant="date"
              aria-label="Date de début"
              placeholder="jj/mm/aaaa"
              maxLength={10}
              disabled={disabled}
              className={INPUT}
              value={draftFrom ?? (from === "" ? "" : formatDateShort(from))}
              onFocus={() => focusField("from")}
              onValueChange={(v) => handleTyped("from", v)}
              onBlur={() => handleBlur("from")}
            />
          </div>
          <span className="shrink-0 text-blue-light">→</span>
          <div
            className={`flex flex-1 items-center border-b transition-colors ${segmentBorder("to")}`}
          >
            <Input
              variant="date"
              aria-label="Date de fin"
              placeholder="jj/mm/aaaa"
              maxLength={10}
              disabled={disabled}
              className={INPUT}
              value={draftTo ?? (to === "" ? "" : formatDateShort(to))}
              onFocus={() => focusField("to")}
              onValueChange={(v) => handleTyped("to", v)}
              onBlur={() => handleBlur("to")}
            />
          </div>
          <LabelTooltip label="Ouvrir le calendrier" side="top">
            <button
              type="button"
              aria-label="Ouvrir le calendrier"
              disabled={disabled}
              className="flex shrink-0 items-center justify-center text-blue-light transition-colors hover:text-blue-sky disabled:opacity-55 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
              onClick={() => fromRef.current?.focus()}
            >
              <ViewCalendarIcon className="h-5 w-5" />
            </button>
          </LabelTooltip>
        </div>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={10}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseLeave={() => setHovered(null)}
          onInteractOutside={(e) => {
            // Keep the calendar open while interacting with the inputs (they
            // live in the anchor, which Radix would otherwise treat as outside).
            if (
              e.target instanceof Node &&
              rootRef.current?.contains(e.target)
            )
              e.preventDefault();
          }}
          className="z-50 rounded-2xl border border-white/10 bg-white/5 p-3 text-white ring-1 ring-black/5 backdrop-blur-2xl"
        >
          <div className="mb-3 flex flex-wrap gap-2 border-b border-white/10 pb-3">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                className={PRESET}
                onClick={() => applyPreset(p.from)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <DayPicker
            mode="range"
            locale={fr}
            numberOfMonths={narrow ? 1 : 2}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            startMonth={minDateObj ?? DATA_START}
            endMonth={today}
            disabled={disabledDays}
            selected={selected}
            // Providing onSelect makes `selected` controlled (RDP otherwise
            // keeps its own internal range and ignores prop updates from typing).
            // We ignore RDP's computed range and drive start→end from the
            // clicked day ourselves.
            onSelect={(_range, triggerDate) => {
              if (triggerDate) handleDayClick(triggerDate);
            }}
            onDayMouseEnter={(day) => {
              if (picking && fromDate) setHovered(day);
            }}
            showOutsideDays
            style={RDP_VARS}
            classNames={{
              months: `${dcn.months} gap-5`,
              caption_label: `${dcn.caption_label} text-sm font-normal text-white`,
              dropdowns: `${dcn.dropdowns} gap-1.5`,
              dropdown: `${dcn.dropdown} [color-scheme:dark]`,
              dropdown_root: `${dcn.dropdown_root} rounded-lg px-1 text-sm font-light text-white transition-colors hover:bg-white/5`,
              button_previous: `${dcn.button_previous} rounded-lg text-white transition-colors hover:bg-white/10`,
              button_next: `${dcn.button_next} rounded-lg text-white transition-colors hover:bg-white/10`,
              weekday: `${dcn.weekday} text-[0.7rem] font-light text-blue-light`,
              day_button: `${dcn.day_button} rounded-full font-light`,
              range_start: `${dcn.range_start} rounded-l-full`,
              range_end: `${dcn.range_end} rounded-r-full`,
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
