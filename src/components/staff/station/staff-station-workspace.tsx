import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { CandyCard } from "@/components/candy/candy-card";
import { PillButton } from "@/components/candy/pill-button";
import { ParticipantMainCard } from "@/components/staff/station/participant-main-card";
import type { StationParticipant } from "@/components/staff/station/participant-main-card";
import { SideActionCard } from "@/components/staff/station/side-action-card";
import { KitInventoryCard } from "@/components/staff/station/kit-inventory-card";
import { WorkstationActivityCard } from "@/components/staff/station/workstation-activity-card";
import { IconEdit, IconTv } from "@/components/staff/station/candy-icons";
import { staffEventsPath } from "@/lib/routes";

type StaffStationWorkspaceProps = {
  eventParam: string;
  eventName: string;
  deskLabel: string;
  participant: StationParticipant | null;
  searchSlot?: ReactNode;
  editPillProps?: Omit<
    ComponentProps<typeof PillButton>,
    "variant" | "size" | "type"
  >;
  tertiaryPillProps?: Omit<
    ComponentProps<typeof PillButton>,
    "variant" | "size" | "type"
  >;
  participantCardProps?: {
    onConfirmDelivery?: () => void;
    isConfirming?: boolean;
    confirmDisabled?: boolean;
  };
};

export function StaffStationWorkspace({
  eventParam,
  eventName,
  deskLabel,
  participant,
  searchSlot,
  editPillProps,
  tertiaryPillProps,
  participantCardProps,
}: StaffStationWorkspaceProps) {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-candy-outline/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="text-xs font-medium text-candy-muted">
            <Link
              href={staffEventsPath()}
              className="hover:text-candy-secondary"
            >
              Eventos
            </Link>
            <span className="mx-1.5 text-candy-outline">/</span>
            <span className="text-candy-ink">{eventParam}</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-candy-ink sm:text-3xl">
            Guichê de entrega · KitRunner
          </h1>
          <p className="mt-1 text-sm text-candy-muted">
            {eventName} · busca de inscrições e projeção na TV
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-candy-pill border border-candy-secondary/30 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wide text-candy-secondary shadow-candy-card-soft">
            {deskLabel}
          </span>
        </div>
      </header>

      {searchSlot ? <div>{searchSlot}</div> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {participant ? (
            <ParticipantMainCard
              participant={participant}
              {...participantCardProps}
            />
          ) : (
            <CandyCard elevation="lg" className="flex min-h-[280px] flex-col justify-center p-6 sm:p-8">
              <p className="text-sm font-semibold text-candy-ink">
                Nenhum participante selecionado
              </p>
              <p className="mt-2 text-sm text-candy-muted">
                Pesquise acima e escolha uma inscrição para ver o kit e as
                ações.
              </p>
            </CandyCard>
          )}
        </div>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <SideActionCard
            title="Configuração"
            subtitle="Editar dados"
            icon={<IconEdit className="h-6 w-6 text-candy-secondary" />}
            actionLabel="Abrir editor"
            buttonVariant="secondary"
            pillProps={editPillProps}
          />
          <SideActionCard
            title="Display público"
            subtitle="Projetar na TV"
            icon={<IconTv className="h-6 w-6 text-candy-tertiary" />}
            actionLabel="Enviar para a parede"
            buttonVariant="tertiary"
            pillProps={tertiaryPillProps}
          />
          <KitInventoryCard />
          <WorkstationActivityCard />
        </div>
      </div>
    </div>
  );
}
