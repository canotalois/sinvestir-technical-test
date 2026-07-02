"use client";

import type { ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { InfoIcon, InfoDotIcon } from "./icons";

/** Single provider for every tooltip in the simulator. Keeps all
 *  `@radix-ui/react-tooltip` usage centralised in this module. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

/**
 * Tooltip reproduced 1:1 from S'investir: a ⓘ trigger and, on hover/focus, a
 * `bg-blue-sky/5` blurred box (`backdrop-blur-3xl`) with asymmetric corners
 * and a ⓘ chip above the text. Positioning, focus and dismissal are handled by
 * Radix; the trigger colour stays static (`#7899CE`, no hover shift).
 */
/**
 * Lightweight label tooltip for icon-only buttons (no ⓘ icon): a small, light,
 * on-brand box that just describes the control on hover/focus. Used for the
 * collapsed sidebar items, the collapse handle, the calendar button, etc.
 */
export function LabelTooltip({
  label,
  side = "right",
  children,
}: {
  readonly label: string;
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly children: ReactNode;
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={10}
          collisionPadding={8}
          className="z-[70] rounded-lg border border-blue-sky/10 bg-blue-sky/5 px-2.5 py-1.5 text-xs font-light text-white shadow-lg backdrop-blur-3xl"
        >
          {label}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export function Tooltip({ text }: { text: string }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={text}
          className="inline-flex cursor-help text-blue-light outline-none"
        >
          <InfoDotIcon className="h-[15px] w-[15px]" />
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={8}
          collisionPadding={8}
          className="z-50 flex w-max max-w-xs items-center gap-2.5 rounded-tr-card rounded-bl-card border border-blue-sky/10 bg-blue-sky/5 p-4 text-xs font-light text-white backdrop-blur-3xl"
        >
          <InfoIcon
            width={24}
            height={24}
            className="shrink-0 rounded-full bg-blue-sky/10 p-1 text-blue-sky"
          />
          <span className="leading-snug">{text}</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
