import type { HTMLAttributes } from "react";

type CandyCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Stronger purple/pink tinted shadow */
  elevation?: "md" | "lg";
};

export function CandyCard({
  elevation = "md",
  className = "",
  children,
  ...props
}: CandyCardProps) {
  const shadow = elevation === "lg" ? "shadow-candy-card" : "shadow-candy-card-soft";
  return (
    <div
      className={[
        "rounded-candy border border-candy-outline/15 bg-candy-surface/95",
        shadow,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
