"use client";

import type { ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { InfoIcon, InfoDotIcon } from "./icons";
import { useHoverCapable } from "./useMediaQuery";

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
 * Lightweight label tooltip for icon-only buttons (no ⓘ icon): a small, light,
 * on-brand box that describes the control on hover/focus. On a touch device
 * the label is redundant (a tap performs the action), so the child renders bare.
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
  const hoverCapable = useHoverCapable();
  if (!hoverCapable) return <>{children}</>;
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

const INFO_TRIGGER =
  "inline-flex cursor-help text-blue-light outline-none [@media(pointer:coarse)]:-m-2.5 [@media(pointer:coarse)]:p-2.5";

const INFO_CONTENT =
  "z-50 flex w-max max-w-xs items-center gap-2.5 rounded-tr-card rounded-bl-card border border-blue-sky/10 bg-blue-sky/5 p-4 text-xs font-light text-white backdrop-blur-3xl";

function InfoBody({ text }: { text: string }) {
  return (
    <>
      <InfoIcon
        width={24}
        height={24}
        className="shrink-0 rounded-full bg-blue-sky/10 p-1 text-blue-sky"
      />
      <span className="leading-snug">{text}</span>
    </>
  );
}

/**
 * ⓘ metric hint reproduced 1:1 from S'investir: a small trigger and a blurred
 * `bg-blue-sky/5` box with the explanation. On a hover device it opens on
 * hover/focus (Radix Tooltip); on touch, where hover does not exist, it opens
 * on tap (Radix Popover) so the explanation is reachable. The hit area grows to
 * a comfortable tap size on coarse pointers without changing the visual icon.
 */
export function Tooltip({ text }: { text: string }) {
  const hoverCapable = useHoverCapable();

  if (!hoverCapable) {
    return (
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button type="button" aria-label={text} className={INFO_TRIGGER}>
            <InfoDotIcon className="h-[15px] w-[15px]" />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="top"
            sideOffset={8}
            collisionPadding={12}
            className={INFO_CONTENT}
          >
            <InfoBody text={text} />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <button type="button" aria-label={text} className={INFO_TRIGGER}>
          <InfoDotIcon className="h-[15px] w-[15px]" />
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={8}
          collisionPadding={8}
          className={INFO_CONTENT}
        >
          <InfoBody text={text} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
