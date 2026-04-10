import type { ComponentProps } from "react";
import { CandyCard } from "@/components/candy/candy-card";
import { PillButton } from "@/components/candy/pill-button";
import { IconChevronRight } from "@/components/staff/station/candy-icons";

type SideActionCardProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  actionLabel: string;
  buttonVariant?: "secondary" | "tertiary";
  /** When omitted, the action pill stays disabled (Stitch placeholder). */
  pillProps?: Omit<ComponentProps<typeof PillButton>, "variant" | "size">;
};

export function SideActionCard({
  title,
  subtitle,
  icon,
  actionLabel,
  buttonVariant = "secondary",
  pillProps,
}: SideActionCardProps) {
  const { children: pillChildren, ...pillRest } = pillProps ?? {};
  const pillDisabled = pillRest.disabled ?? !pillRest.onClick;

  return (
    <CandyCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-candy-container text-candy-secondary shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-candy-muted">
            {title}
          </p>
          <p className="mt-1 text-lg font-bold text-candy-ink">{subtitle}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:pl-4">
        <PillButton
          type="button"
          variant={buttonVariant}
          size="sm"
          {...pillRest}
          disabled={pillDisabled}
        >
          {pillChildren ?? actionLabel}
        </PillButton>
        <IconChevronRight className="hidden h-5 w-5 text-candy-outline sm:block" />
      </div>
    </CandyCard>
  );
}
