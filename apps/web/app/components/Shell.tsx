"use client";

import { useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { TooltipProvider, LabelTooltip } from "@sinvestir/crypto-simulator";
import { BackgroundGlow } from "./BackgroundGlow";
import { ErrorBoundary } from "./ErrorBoundary";

const icon: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "h-5 w-5 shrink-0",
};

const NAV_SVG = "h-5 w-5 shrink-0";

const DashboardIcon = () => (
  <svg
    viewBox="0 0 24 25"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
    className={NAV_SVG}
  >
    <path d="M3.00009 17.9086C3.00009 16.5222 3.00009 15.829 3.31215 15.3198C3.48676 15.0348 3.72633 14.7953 4.01127 14.6207C4.5205 14.3086 5.2137 14.3086 6.60009 14.3086C7.98649 14.3086 8.67968 14.3086 9.18891 14.6207C9.47385 14.7953 9.71342 15.0348 9.88804 15.3198C10.2001 15.829 10.2001 16.5222 10.2001 17.9086C10.2001 19.295 10.2001 19.9882 9.88804 20.4974C9.71342 20.7824 9.47385 21.0219 9.18891 21.1965C8.67968 21.5086 7.98649 21.5086 6.60009 21.5086C5.2137 21.5086 4.5205 21.5086 4.01127 21.1965C3.72633 21.0219 3.48676 20.7824 3.31215 20.4974C3.00009 19.9882 3.00009 19.295 3.00009 17.9086Z" />
    <path d="M13.8 17.9086C13.8 16.5222 13.8 15.829 14.1121 15.3198C14.2867 15.0348 14.5263 14.7953 14.8112 14.6207C15.3204 14.3086 16.0136 14.3086 17.4 14.3086C18.7864 14.3086 19.4796 14.3086 19.9888 14.6207C20.2738 14.7953 20.5133 15.0348 20.688 15.3198C21 15.829 21 16.5222 21 17.9086C21 19.295 21 19.9882 20.688 20.4974C20.5133 20.7824 20.2738 21.0219 19.9888 21.1965C19.4796 21.5086 18.7864 21.5086 17.4 21.5086C16.0136 21.5086 15.3204 21.5086 14.8112 21.1965C14.5263 21.0219 14.2867 20.7824 14.1121 20.4974C13.8 19.9882 13.8 19.295 13.8 17.9086Z" />
    <path d="M3.00009 7.1083C3.00009 5.72191 3.00009 5.02871 3.31215 4.51948C3.48676 4.23454 3.72633 3.99497 4.01127 3.82036C4.5205 3.5083 5.2137 3.5083 6.60009 3.5083C7.98649 3.5083 8.67968 3.5083 9.18891 3.82036C9.47385 3.99497 9.71342 4.23454 9.88804 4.51948C10.2001 5.02871 10.2001 5.72191 10.2001 7.1083C10.2001 8.4947 10.2001 9.18789 9.88804 9.69712C9.71342 9.98206 9.47385 10.2216 9.18891 10.3962C8.67968 10.7083 7.98649 10.7083 6.60009 10.7083C5.2137 10.7083 4.5205 10.7083 4.01127 10.3962C3.72633 10.2216 3.48676 9.98206 3.31215 9.69712C3.00009 9.18789 3.00009 8.4947 3.00009 7.1083Z" />
    <path d="M13.8 7.1083C13.8 5.72191 13.8 5.02871 14.1121 4.51948C14.2867 4.23454 14.5263 3.99497 14.8112 3.82036C15.3204 3.5083 16.0136 3.5083 17.4 3.5083C18.7864 3.5083 19.4796 3.5083 19.9888 3.82036C20.2738 3.99497 20.5133 4.23454 20.688 4.51948C21 5.02871 21 5.72191 21 7.1083C21 8.4947 21 9.18789 20.688 9.69712C20.5133 9.98206 20.2738 10.2216 19.9888 10.3962C19.4796 10.7083 18.7864 10.7083 17.4 10.7083C16.0136 10.7083 15.3204 10.7083 14.8112 10.3962C14.5263 10.2216 14.2867 9.98206 14.1121 9.69712C13.8 9.18789 13.8 8.4947 13.8 7.1083Z" />
  </svg>
);
const ChartIcon = () => (
  <svg
    viewBox="0 0 24 25"
    fill="currentColor"
    aria-hidden="true"
    className={NAV_SVG}
  >
    <path d="M21 22.2585C21.4142 22.2585 21.75 21.9228 21.75 21.5085C21.75 21.0943 21.4142 20.7585 21 20.7585V22.2585ZM3.75 3.50854C3.75 3.09433 3.41421 2.75854 3 2.75854C2.58579 2.75854 2.25 3.09433 2.25 3.50854H3.75ZM6.99988 3.7583C6.58566 3.7583 6.24988 4.09409 6.24988 4.5083C6.24988 4.92251 6.58566 5.2583 6.99988 5.2583V3.7583ZM7.99988 5.2583C8.41409 5.2583 8.74988 4.92251 8.74988 4.5083C8.74988 4.09409 8.41409 3.7583 7.99988 3.7583V5.2583ZM6.99988 6.7583C6.58566 6.7583 6.24988 7.09409 6.24988 7.5083C6.24988 7.92251 6.58566 8.2583 6.99988 8.2583V6.7583ZM10.9999 8.2583C11.4141 8.2583 11.7499 7.92251 11.7499 7.5083C11.7499 7.09409 11.4141 6.7583 10.9999 6.7583V8.2583ZM21 21.5085V20.7585H10V21.5085V22.2585H21V21.5085ZM3 14.5085H3.75V3.50854H3H2.25V14.5085H3ZM10 21.5085V20.7585C8.32888 20.7585 7.15099 20.757 6.25948 20.6371C5.38955 20.5201 4.90544 20.3031 4.55546 19.9531L4.02513 20.4834L3.4948 21.0138C4.16994 21.6889 5.02335 21.9844 6.05961 22.1237C7.0743 22.2601 8.37129 22.2585 10 22.2585V21.5085ZM3 14.5085H2.25C2.25 16.1373 2.24841 17.4342 2.38483 18.4489C2.52415 19.4852 2.81966 20.3386 3.4948 21.0138L4.02513 20.4834L4.55546 19.9531C4.20547 19.6031 3.98841 19.119 3.87145 18.2491C3.75159 17.3576 3.75 16.1797 3.75 14.5085H3ZM6.99988 4.5083V5.2583H7.99988V4.5083V3.7583H6.99988V4.5083ZM6.99988 7.5083V8.2583H10.9999V7.5083V6.7583H6.99988V7.5083ZM10.3062 13.5272V14.2772C10.9094 14.2772 11.3054 14.6322 11.9385 15.2784C12.4998 15.8514 13.3084 16.73 14.6135 16.73V15.98V15.23C14.0333 15.23 13.6502 14.8822 13.0101 14.2287C12.4417 13.6486 11.6268 12.7772 10.3062 12.7772V13.5272ZM14.6135 15.98V16.73C15.678 16.73 16.4467 16.2646 17.0255 15.6308C17.5701 15.0346 17.9743 14.2549 18.3279 13.6008C19.0994 12.1739 19.6937 11.2583 20.9999 11.2583V10.5083V9.7583C18.6931 9.7583 17.716 11.5786 17.0084 12.8875C16.6225 13.6014 16.3103 14.1896 15.9179 14.6193C15.5597 15.0115 15.1708 15.23 14.6135 15.23V15.98ZM4.99988 20.5083L5.65702 20.8698C5.94486 20.3465 6.25422 19.6245 6.57514 18.8998C6.90491 18.155 7.2613 17.3722 7.6645 16.6553C8.07037 15.9337 8.50101 15.3209 8.96206 14.8953C9.41658 14.4758 9.8561 14.2772 10.3062 14.2772V13.5272V12.7772C9.36447 12.7772 8.5787 13.2078 7.94467 13.7931C7.31718 14.3722 6.79601 15.1396 6.35712 15.92C5.91555 16.705 5.53421 17.5458 5.20357 18.2925C4.86408 19.0592 4.59036 19.6966 4.34273 20.1468L4.99988 20.5083Z" />
  </svg>
);
const CompareIcon = () => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.13}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={NAV_SVG}
  >
    <path d="M8.25 3.75L13.5 3.75" />
    <path d="M7.5 7.5L10.875 10.875" />
    <path d="M3.75 8.25L3.75 13.5" />
    <circle cx="4.83333" cy="4.83333" r="3.33333" />
    <circle cx="3.75" cy="15" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="15" cy="3.75" r="1.5" />
  </svg>
);
const BookmarkIcon = () => (
  <svg
    viewBox="0 0 24 25"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={NAV_SVG}
  >
    <path d="M9 2.50854H11C15.714 2.50854 18.0711 2.50854 19.5355 3.97301C21 5.43748 21 7.7945 21 12.5085V18.5085M3 13.2161V18.4894C3 20.7952 3 21.9481 3.72454 22.3608C5.12763 23.16 7.7595 20.4937 9.00938 19.691C9.73425 19.2254 10.0967 18.9926 10.5 18.9926C10.9033 18.9926 11.2657 19.2254 11.9906 19.691C13.2405 20.4937 15.8724 23.16 17.2755 22.3608C18 21.9481 18 20.7952 18 18.4894V13.2161C18 9.58271 18 7.76603 16.9017 6.63729C15.8033 5.50854 14.0355 5.50854 10.5 5.50854C6.96447 5.50854 5.1967 5.50854 4.09835 6.63729C3 7.76603 3 9.58271 3 13.2161Z" />
  </svg>
);
const GiftIcon = () => (
  <svg
    viewBox="0 0 512 512"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    className={NAV_SVG}
  >
    <path
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={32}
      d="M256 104v56h56a56 56 0 1 0-56-56Zm0 0v56h-56a56 56 0 1 1 56-56Z"
    />
    <rect
      width="384"
      height="112"
      x="64"
      y="160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      rx="32"
      ry="32"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M416 272v144a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V272m160-112v304"
    />
  </svg>
);
const GearIcon = () => (
  <svg
    viewBox="0 0 24 25"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    className="h-4 w-4 shrink-0 transition-transform duration-[400ms] group-hover:rotate-180"
  >
    <path
      d="M15.4998 12.5093C15.4998 14.4423 13.9328 16.0093 11.9998 16.0093C10.0668 16.0093 8.49982 14.4423 8.49982 12.5093C8.49982 10.5763 10.0668 9.00928 11.9998 9.00928C13.9328 9.00928 15.4998 10.5763 15.4998 12.5093Z"
      strokeWidth={1.5}
    />
    <path
      d="M21.011 14.6051C21.5329 14.4643 21.7939 14.3939 21.8969 14.2594C22 14.1248 22 13.9083 22 13.4754V11.5418C22 11.1088 22 10.8924 21.8969 10.7578C21.7938 10.6233 21.5329 10.5529 21.011 10.4121C19.0606 9.88613 17.8399 7.84706 18.3433 5.90942C18.4817 5.37654 18.5509 5.1101 18.4848 4.95383C18.4187 4.79757 18.2291 4.68988 17.8497 4.47451L16.125 3.49528C15.7528 3.28393 15.5667 3.17826 15.3997 3.20076C15.2326 3.22327 15.0442 3.41127 14.6672 3.78728C13.208 5.24303 10.7936 5.24297 9.33434 3.78719C8.95743 3.41118 8.76898 3.22317 8.60193 3.20067C8.43489 3.17816 8.24877 3.28384 7.87653 3.49518L6.15184 4.47441C5.77253 4.68977 5.58287 4.79745 5.51678 4.9537C5.45068 5.10995 5.51987 5.37641 5.65825 5.90934C6.16137 7.84704 4.93972 9.88617 2.98902 10.4121C2.46712 10.5529 2.20617 10.6232 2.10308 10.7578C2 10.8923 2 11.1088 2 11.5418V13.4754C2 13.9083 2 14.1248 2.10308 14.2594C2.20615 14.3939 2.46711 14.4643 2.98902 14.6051C4.93939 15.1311 6.16008 17.1701 5.65672 19.1078C5.51829 19.6406 5.44907 19.9071 5.51516 20.0633C5.58126 20.2196 5.77092 20.3273 6.15025 20.5427L7.87495 21.5219C8.24721 21.7333 8.43334 21.8389 8.6004 21.8164C8.76746 21.7939 8.95588 21.6059 9.33271 21.2299C10.7927 19.7729 13.2088 19.7729 14.6689 21.2298C15.0457 21.6058 15.2341 21.7938 15.4012 21.8163C15.5682 21.8388 15.7544 21.7332 16.1266 21.5218L17.8513 20.5426C18.2307 20.3272 18.4204 20.2195 18.4864 20.0632C18.5525 19.9069 18.4833 19.6405 18.3448 19.1077C17.8412 17.1701 19.0609 15.1311 21.011 14.6051Z"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);
const BulbIcon = () => (
  <svg {...icon} className="h-4 w-4 shrink-0">
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
  </svg>
);
const LogoutIcon = () => (
  <svg {...icon}>
    <path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3" />
    <path d="M10 8 6 12l4 4M6 12h11" />
  </svg>
);
const MenuIcon = () => (
  <svg {...icon} className="h-6 w-6">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
const ChevronLeftIcon = ({ flipped }: { flipped: boolean }) => (
  <svg
    viewBox="0 0 24 25"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`relative -left-0.5 h-5 w-5 shrink-0 transition-transform duration-300 ${flipped ? "rotate-180" : ""}`}
  >
    <path d="M15 6.50854C15 6.50854 9.00001 10.9275 9 12.5086C8.99999 14.0897 15 18.5085 15 18.5085" />
  </svg>
);

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
  readonly active?: boolean;
}

const NAV: readonly NavItem[] = [
  { label: "Tableau de bord", href: "#", icon: <DashboardIcon /> },
  { label: "Les simulateurs", href: "#", icon: <ChartIcon />, active: true },
  { label: "Les comparateurs", href: "#", icon: <CompareIcon /> },
  { label: "Mes simulations", href: "#", icon: <BookmarkIcon /> },
  { label: "Formation offerte", href: "#", icon: <GiftIcon /> },
];

function navItemClass(active: boolean, collapsed: boolean): string {
  const base = `group flex items-center gap-x-3 py-3 text-sm font-normal transition-all duration-300 overflow-hidden whitespace-nowrap ${
    collapsed ? "justify-center px-0" : "border-l-2 px-6"
  }`;
  if (active) {
    return collapsed
      ? `${base} text-blue-sky`
      : `${base} border-blue-sky bg-white/5 text-white`;
  }
  return collapsed
    ? `${base} text-white/40 hover:text-white`
    : `${base} border-transparent text-white/30 hover:bg-white/5 hover:text-white`;
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo */}
      <img
        src="/sinvestir-mark.svg"
        alt="S'investir"
        className="h-9 w-auto sm:h-10"
      />
      <span className="text-base font-light tracking-[0.2em] text-white sm:text-lg">
        SIMULATEURS
      </span>
    </div>
  );
}

/** Wraps an icon-only control in a label tooltip only when the sidebar is
 *  collapsed (expanded items already show their text). */
function TipIf({
  show,
  label,
  children,
}: {
  readonly show: boolean;
  readonly label: string;
  readonly children: ReactNode;
}) {
  return show ? (
    <LabelTooltip label={label}>{children}</LabelTooltip>
  ) : (
    children
  );
}

function SidebarInner({
  collapsed = false,
  onCollapse,
}: {
  collapsed?: boolean;
  onCollapse?: () => void;
}) {
  const secondaryBtn = `group flex w-full items-center gap-x-2 py-3 text-sm font-light text-white transition-all duration-300 hover:text-blue-sky ${
    collapsed ? "justify-center px-0" : "justify-center px-6"
  }`;

  return (
    <div className="relative flex grow flex-col">
      <div
        className="relative flex grow flex-col gap-y-10 overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 px-0 py-6"
        style={{
          background:
            "radial-gradient(228.26% 65.64% at 100% 2.53%, rgba(255, 255, 255, 0.1) 0%, rgba(16, 27, 68, 0.1) 100%)",
        }}
      >
        <div
          className={`flex items-center gap-3 rounded-xl ${collapsed ? "justify-center px-2" : "px-6"}`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-medium text-white">
            S&apos;
          </div>
          {collapsed ? null : (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-normal text-white">
                Mode démo
              </p>
              <p className="truncate text-xs font-light text-blue-light">
                Test technique S&apos;investir
              </p>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col">
          <ul
            role="list"
            className="flex flex-1 flex-col justify-between gap-y-7"
          >
            <li>
              <ul role="list" className="space-y-3">
                {NAV.map((item) => (
                  <li key={item.label}>
                    <TipIf show={collapsed} label={item.label}>
                      <a
                        href={item.href}
                        className={navItemClass(
                          item.active === true,
                          collapsed,
                        )}
                      >
                        {item.icon}
                        {collapsed ? null : (
                          <span className="overflow-hidden text-ellipsis">
                            {item.label}
                          </span>
                        )}
                      </a>
                    </TipIf>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <ul role="list" className="space-y-1">
                <li>
                  <TipIf show={collapsed} label="Gérer mon compte">
                    <button type="button" className={secondaryBtn}>
                      <GearIcon />
                      {collapsed ? null : (
                        <span className="overflow-hidden text-ellipsis">
                          Gérer mon compte
                        </span>
                      )}
                    </button>
                  </TipIf>
                </li>
                <li className="!mt-0">
                  <TipIf show={collapsed} label="Faire une suggestion">
                    <button type="button" className={secondaryBtn}>
                      <BulbIcon />
                      {collapsed ? null : (
                        <span className="overflow-hidden text-ellipsis">
                          Faire une suggestion
                        </span>
                      )}
                    </button>
                  </TipIf>
                </li>
                <li className="!mt-0">
                  <div className={collapsed ? "px-2" : "px-6"}>
                    <TipIf show={collapsed} label="Déconnexion">
                      <button
                        type="button"
                        className={`relative z-0 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-transparent text-[14px] font-light text-white outline-none transition-all duration-[400ms] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-grad-from before:to-grad-to before:transition-opacity before:duration-[400ms] hover:border-blue-sky/60 hover:before:opacity-0 ${
                          collapsed ? "mx-auto h-11 w-11" : "w-full px-6 py-3"
                        }`}
                      >
                        <LogoutIcon />
                        {collapsed ? null : "Déconnexion"}
                      </button>
                    </TipIf>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      {onCollapse !== undefined ? (
        <LabelTooltip label={collapsed ? "Déplier le menu" : "Réduire le menu"}>
          <button
            type="button"
            onClick={onCollapse}
            aria-label={collapsed ? "Déplier le menu" : "Réduire le menu"}
            className="absolute left-full top-1/2 z-20 flex h-16 w-6 -translate-y-1/2 items-center justify-center rounded-r-2xl bg-white/5 transition-all duration-[400ms] hover:bg-white/10"
          >
            <ChevronLeftIcon flipped={collapsed} />
          </button>
        </LabelTooltip>
      ) : null}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="relative min-h-dvh">
        <BackgroundGlow />
        <div className="min-h-screen bg-app">
          {/* Desktop sidebar (collapsible rail) */}
          <div
            className={`hidden transition-all duration-300 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col ${
              collapsed ? "lg:w-[88px] lg:p-3" : "lg:w-[300px] lg:p-6"
            }`}
          >
            <SidebarInner
              collapsed={collapsed}
              onCollapse={() => setCollapsed((v) => !v)}
            />
          </div>

          {/* Mobile drawer */}
          {mobileOpen ? (
            <div className="lg:hidden">
              <div
                className="fixed inset-0 z-50 bg-black/60"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <div className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-app p-4">
                <SidebarInner />
              </div>
            </div>
          ) : null}

          <div
            className={`mx-auto max-w-[1800px] transition-all duration-300 ${
              collapsed ? "lg:pl-[88px]" : "lg:pl-[300px]"
            }`}
          >
            {/* Pinned header (does not follow scroll) */}
            <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-white/10 bg-app/80 px-4 backdrop-blur sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex items-center justify-center p-2.5 text-white lg:hidden"
              >
                <span className="sr-only">Ouvrir le menu</span>
                <MenuIcon />
              </button>
              <div className="flex w-full items-center justify-between gap-x-4">
                <BrandLogo />
                <a
                  href="https://www.sinvestir.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden whitespace-nowrap text-sm text-white hover:text-white/70 sm:block"
                >
                  Découvrir S&apos;investir →
                </a>
              </div>
            </header>

            <main className="px-4 pb-10 pt-6 sm:px-6 sm:py-10 lg:px-8">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
