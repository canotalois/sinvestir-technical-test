/**
 * Blue glow (top-right) captured 1:1: a blurred SVG blob, not a box-shadow.
 * At `z-0` (the only positioned element), it sits above the content fill.
 */
export function BackgroundGlow() {
  return (
    <svg
      className="pointer-events-none absolute right-0 top-0 z-0 w-[71%]"
      style={{ aspectRatio: "1310 / 1245" }}
      viewBox="0 0 1310 1245"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g filter="url(#si-glow-blur)">
        <path
          d="M526.422 -75.537C780.156 -222.031 1112.89 -120.749 1269.6 150.682C1426.31 422.113 1347.66 760.908 1093.92 907.402C840.188 1053.9 507.456 952.614 350.746 681.182C194.035 409.751 272.688 70.9566 526.422 -75.537ZM997.578 740.528C1165.16 643.775 1217.11 420.015 1113.61 240.745C1010.1 61.4757 790.348 -5.41685 622.767 91.3364C455.185 188.09 403.238 411.85 506.739 591.12C610.24 770.389 829.996 837.282 997.578 740.528Z"
          fill="url(#si-glow-grad)"
        />
      </g>
      <defs>
        <filter
          id="si-glow-blur"
          x="0.109375"
          y="-412.655"
          width="1620.13"
          height="1657.18"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="135" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient
          id="si-glow-grad"
          x1="350.746"
          y1="681.182"
          x2="1269.6"
          y2="150.682"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.3" stopColor="#2945A8" stopOpacity="0" />
          <stop offset="1" stopColor="#2945A8" stopOpacity="0.66" />
        </linearGradient>
      </defs>
    </svg>
  );
}
