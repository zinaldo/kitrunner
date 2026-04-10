type TvWallHeaderProps = {
  /** Ex.: "Nome da prova - 10/04/2026" */
  headline: string;
};

export function TvWallHeader({ headline }: TvWallHeaderProps) {
  return (
    <header className="shrink-0 border-b border-candy-outline/20 bg-candy-surface/90 px-4 py-5 shadow-candy-card-soft sm:px-8 sm:py-7 lg:py-8">
      <h1 className="text-3xl font-bold tracking-tight text-candy-ink sm:text-4xl lg:text-5xl xl:text-6xl">
        {headline}
      </h1>
      <p className="mt-3 text-base font-semibold leading-snug text-candy-ink/85 sm:mt-4 sm:text-xl lg:text-2xl">
        Confira seus dados na tela antes de retirar o kit.
      </p>
    </header>
  );
}
