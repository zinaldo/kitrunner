import { CandyCard } from "@/components/candy/candy-card";
import { PillButton } from "@/components/candy/pill-button";
import { CandySectionTitle } from "@/components/candy/candy-section-title";
import { IconCheckCircle, IconTruck } from "@/components/staff/station/candy-icons";

export type StationParticipant = {
  bib: string;
  name: string;
  /** Full verification line as on the Stitch screen. */
  verifiedLine: string;
  kitSize: string;
  deliveryHeadline: string;
  deliveryDetail: string;
  /** Campos obrigatórios configurados para a prova (exceto peito e nome). */
  requiredFields: { label: string; value: string }[];
};

type ParticipantMainCardProps = {
  participant: StationParticipant;
  onConfirmDelivery?: () => void;
  isConfirming?: boolean;
  confirmDisabled?: boolean;
};

export function ParticipantMainCard({
  participant,
  onConfirmDelivery,
  isConfirming = false,
  confirmDisabled,
}: ParticipantMainCardProps) {
  const confirmBtnDisabled =
    confirmDisabled ?? !onConfirmDelivery;
  return (
    <CandyCard elevation="lg" className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-candy-outline/15 pb-6">
        <div>
          <p className="font-mono text-5xl font-black tabular-nums tracking-tight text-candy-primary sm:text-6xl">
            #{participant.bib}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-candy-ink sm:text-3xl">
            {participant.name}
          </h2>
        </div>
        <span className="inline-flex max-w-full items-center rounded-candy-pill border border-candy-tertiary/35 bg-candy-tertiary/10 px-4 py-1.5 text-xs font-bold text-candy-tertiary">
          {participant.verifiedLine}
        </span>
      </div>

      {participant.requiredFields.length > 0 ? (
        <div className="mt-6 rounded-candy border border-candy-outline/12 bg-candy-container-low/50 p-5">
          <CandySectionTitle>Dados obrigatórios da inscrição</CandySectionTitle>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {participant.requiredFields.map((row) => (
              <div key={row.label}>
                <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-candy-muted">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-candy-ink">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <div
        className={participant.requiredFields.length > 0 ? "mt-4" : "mt-6"}
      >
        <CandySectionTitle>Kit / tamanho</CandySectionTitle>
        <p className="mt-2 inline-flex rounded-candy-pill bg-candy-primary/12 px-4 py-2 text-sm font-bold text-candy-primary">
          TAM. {participant.kitSize}
        </p>
      </div>

      <div className="mt-8 rounded-candy border border-candy-secondary/20 bg-candy-container-low/80 p-5">
        <CandySectionTitle>Status da entrega</CandySectionTitle>
        <div className="mt-3 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-candy-secondary/15 text-candy-secondary">
            <IconTruck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-bold text-candy-ink">
              {participant.deliveryHeadline}
            </p>
            <p className="mt-1 text-sm text-candy-muted">
              {participant.deliveryDetail}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-candy border border-dashed border-candy-primary/35 bg-candy-primary/5 p-5">
        <CandySectionTitle>Etapa final</CandySectionTitle>
        <p className="mt-2 text-sm font-medium text-candy-muted">
          Confirme depois que o atleta conferir os dados no display público.
        </p>
        <PillButton
          variant="primary"
          size="lg"
          className="mt-4 w-full sm:w-auto"
          disabled={confirmBtnDisabled || isConfirming}
          onClick={onConfirmDelivery}
        >
          <IconCheckCircle className="h-5 w-5" />
          {isConfirming ? "Salvando…" : "Confirmar entrega"}
        </PillButton>
      </div>
    </CandyCard>
  );
}
