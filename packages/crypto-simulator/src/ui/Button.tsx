import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "gradient" | "white" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly icon?: ReactNode;
}

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-light transition-all duration-[400ms] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-sky disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  gradient:
    "relative z-0 overflow-hidden border border-transparent text-white before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-grad-from before:to-grad-to before:transition-opacity before:duration-[400ms] hover:border-blue-sky/60 hover:before:opacity-0",
  white:
    "border border-white bg-white text-surface-elevated hover:-translate-y-px hover:shadow-lg",
  outline: "border border-white/70 text-white hover:bg-white/5",
};

/** Shared pill button (gradient / white / outline variants). */
export function Button({
  variant = "gradient",
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${className ?? ""}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
