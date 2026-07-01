import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** Small ⓘ tooltip trigger reproduced 1:1 (circle filled 30 % + « i »), color via currentColor. */
export function InfoDotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={14}
      height={13}
      viewBox="0 0 14 13"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M13 6.50879C13 3.19508 10.3137 0.508789 7 0.508789C3.68629 0.508789 1 3.19508 1 6.50879C1 9.8225 3.68629 12.5088 7 12.5088C10.3137 12.5088 13 9.8225 13 6.50879Z"
        fill="currentColor"
        fillOpacity={0.3}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={0.9}
      />
      <path
        d="M7.16954 10.0086V6.50859C7.16954 6.17861 7.16954 6.01362 7.06703 5.91111C6.96452 5.80859 6.79953 5.80859 6.46954 5.80859"
        stroke="currentColor"
        strokeWidth={1.05}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.9944 3.70898H7.00069H6.9944Z"
        fill="currentColor"
      />
      <path
        d="M6.9944 3.70898H7.00069"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Line-graph glyph for the « Graphiques » view tab. */
export function ViewChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 25"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <path d="M3 12.5085C3 8.2659 3 6.14458 4.31802 4.82656C5.63604 3.50854 7.75736 3.50854 12 3.50854C16.2426 3.50854 18.364 3.50854 19.682 4.82656C21 6.14458 21 8.2659 21 12.5085C21 16.7512 21 18.8725 19.682 20.1905C18.364 21.5085 16.2426 21.5085 12 21.5085C7.75736 21.5085 5.63604 21.5085 4.31802 20.1905C3 18.8725 3 16.7512 3 12.5085Z" />
      <path
        d="M16.4424 7.50849C16.4424 7.09428 16.7782 6.75849 17.1924 6.75849C17.6066 6.75849 17.9424 7.09428 17.9424 7.50849L16.4424 7.50849ZM7 17.7322C6.58579 17.7322 6.25 17.3964 6.25 16.9822C6.25 16.568 6.58579 16.2322 7 16.2322L7 17.7322ZM17.1924 7.50849L17.9424 7.50849C17.9424 8.39405 17.8675 9.45614 17.7044 10.4774C17.5431 11.4869 17.2871 12.5122 16.8987 13.2916C16.5385 14.0143 15.886 14.8546 14.8316 14.7478C14.3468 14.6987 13.9041 14.4488 13.5064 14.0955C13.1063 13.7402 12.7047 13.2393 12.2944 12.5942L12.9272 12.1917L13.56 11.7891C13.9281 12.3677 14.2436 12.7441 14.5024 12.974C14.7636 13.206 14.9218 13.2493 14.9828 13.2554C15.0201 13.2592 15.2392 13.2586 15.5561 12.6226C15.8448 12.0432 16.0712 11.1919 16.2232 10.2407C16.3733 9.30122 16.4424 8.31837 16.4424 7.50849L17.1924 7.50849ZM12.9272 12.1917L12.2944 12.5942C11.9256 12.0146 11.65 11.7357 11.4722 11.6187C11.3911 11.5653 11.3526 11.5605 11.3517 11.5603C11.3509 11.5602 11.3536 11.5605 11.3575 11.5599C11.3612 11.5594 11.3602 11.5589 11.3536 11.5618C11.3089 11.5815 11.1833 11.6716 10.9974 11.9615C10.8217 12.2354 10.6451 12.6025 10.4571 13.0448C10.104 13.8757 9.69555 15.0295 9.24545 15.8923C9.01399 16.3359 8.73768 16.775 8.39574 17.1108C8.0462 17.4539 7.58129 17.7322 7 17.7322L7 16.9822L7 16.2322C7.06595 16.2322 7.17441 16.2078 7.34486 16.0404C7.52291 15.8656 7.71322 15.5863 7.91554 15.1985C8.33299 14.3983 8.66072 13.4367 9.07658 12.4582C9.27307 11.9958 9.48912 11.5347 9.73482 11.1516C9.97033 10.7844 10.2948 10.3889 10.7495 10.1888C11.2741 9.95805 11.8168 10.0496 12.2972 10.3659C12.7378 10.656 13.1503 11.1451 13.56 11.7891L12.9272 12.1917Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Calendar glyph for the « Calendrier » view tab. */
export function ViewCalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 25"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M11.0528 13.4563H15.7896M8.21066 13.4563H8.21917M12.9475 17.2458H8.21066M15.7896 17.2458H15.7811" />
      <path d="M17.6844 3.03491V4.92965M6.31598 3.03491V4.92965" />
      <path d="M3 12.7389C3 8.61096 3 6.54697 4.18622 5.26458C5.37244 3.98218 7.28162 3.98218 11.1 3.98218H12.9C16.7184 3.98218 18.6276 3.98218 19.8138 5.26458C21 6.54697 21 8.61096 21 12.7389V13.2254C21 17.3534 21 19.4174 19.8138 20.6998C18.6276 21.9822 16.7184 21.9822 12.9 21.9822H11.1C7.28162 21.9822 5.37244 21.9822 4.18622 20.6998C3 19.4174 3 17.3534 3 13.2254V12.7389Z" />
      <path d="M3.47397 8.71899H20.5266" />
    </svg>
  );
}

/** Information icon « ⓘ » (outline) reproduced 1:1 — banner & tooltip chip. */
export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 25"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12.5085" r="10" strokeWidth={1.5} />
      <path d="M11.992 15.5085H12.001" strokeWidth={2} />
      <path d="M12 12.5085L12 8.50854" strokeWidth={1.5} />
    </svg>
  );
}

export function PlayCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9l5 3-5 3z" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 25"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 9.509S13.581 15.509 12 15.509C10.419 15.509 6 9.509 6 9.509" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={18} height={18} strokeWidth={1.5} {...props}>
      <path d="M5 14L8.5 17.5L19 6.5" />
    </svg>
  );
}

export function BookmarkPlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} className="shrink-0" {...props}>
      <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h6" />
      <path d="M16 4h6M19 1v6" />
    </svg>
  );
}

export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} className="shrink-0" {...props}>
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} className="shrink-0" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={24} height={24} strokeWidth={1.8} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
