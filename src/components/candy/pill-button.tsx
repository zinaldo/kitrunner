import type { ButtonHTMLAttributes } from "react";

type PillVariant = "primary" | "secondary" | "tertiary" | "ghost";

const variantClass: Record<PillVariant, string> = {
  primary:
    "bg-candy-primary text-candy-on-primary shadow-candy-primary hover:bg-candy-primary/95",
  secondary:
    "border border-candy-secondary/35 bg-white/90 text-candy-secondary shadow-candy-card-soft hover:bg-white",
  tertiary:
    "border-2 border-candy-tertiary/50 bg-white/95 text-candy-tertiary shadow-candy-tertiary hover:border-candy-tertiary",
  ghost:
    "border border-candy-outline/25 bg-candy-container-low/80 text-candy-ink hover:bg-candy-container-low",
};

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PillVariant;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "px-4 py-2 text-xs font-semibold",
  md: "px-5 py-2.5 text-sm font-semibold",
  lg: "px-8 py-3.5 text-base font-bold",
};

export function PillButton({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: PillButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-candy-pill transition duration-200 ease-out",
        "hover:scale-[1.03] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-candy-primary focus-visible:ring-offset-2 focus-visible:ring-offset-candy-background",
        "disabled:pointer-events-none disabled:opacity-55",
        variantClass[variant],
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
