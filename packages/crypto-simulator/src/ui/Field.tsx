"use client";

import type { ReactNode } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { Tooltip } from "./Tooltip";

interface FieldProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly htmlFor?: string;
  readonly tooltip?: string;
  /** Validation message shown floating below the field (never reflows layout). */
  readonly error?: string | undefined;
}

export function Field({
  label,
  children,
  htmlFor,
  tooltip,
  error,
}: FieldProps) {
  const hasError = error !== undefined && error !== "";
  const { refs, floatingStyles } = useFloating({
    open: hasError,
    placement: "bottom-start",
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className="mb-7">
      <div className="mb-2 flex items-center gap-2">
        <label className="text-xs font-light text-blue-light" htmlFor={htmlFor}>
          {label}
        </label>
        {tooltip !== undefined ? <Tooltip text={tooltip} /> : null}
      </div>
      <div ref={refs.setReference}>{children}</div>
      {hasError ? (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          role="alert"
          className="z-50 rounded-lg border border-negative/40 bg-modal px-3 py-1.5 text-xs font-light text-white shadow-lg"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
