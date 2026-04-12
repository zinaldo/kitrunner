import type { ReactNode } from "react";

const COACH_AVATARS = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiKKk63e1E8HzRaEVpSOszv3FfgS1GQayvGwqBhoKdBXtcGPLWfzZ_bxPbZe0n2Qh78z-fLhrb7dMOAeJ1cFKd1sYR2uOurgAbNW8gDRPIxzRxxRUYQvXbMdguFNosz9m7-8CRu3N3YC5lTCuHIXip5ypv6AASRszhgNr6-0lp9bVJY5wCiHPQMRrW7RqV0dxsDRMJueeYdLzkl2NMMOG4fptsdUnVIIa8IrM7WZjvHuxt8-c_1dDTkN-ozLFDG5nK_VObYOSADlS_",
    alt: "Treinador profissional focado",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTjIza5zei-Gld02l-Gw5SlCtpObK76-WPsIPaNmfa8faSw1r9l-EJ6cKTU484XOG0gbFRBZ4-3uiWSNTnqClb2QIEXvObauYcPNU1TXwaP6dMMzSsw5OywfcMu1sfZ45g69AfCnagilDmEyuwR8NS7WvxnNJkqWWqMSvZS29FcryelOkgAtCsrZpaHMZlbj_uLJ7nd9ofLIExSoqIuSMsnE4STgCBuL3JqOcfGof4QPyOd-B_qDePOe2Z2rdlDgGWVjuIaF9KRfUJ",
    alt: "Atleta em descanso após treino intenso",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7RdGz3cSCjjHXYEnKlo0sTqr9bYe_PBrQIm8e5D2JXUjN6K3BBU_Jn0DnlpoGvgoh-wOQUbN_suEnDV_K6ONhaFIl0TLgMMbWhLAFpfBNcLRjbgHU9x84EoqRXd1XVdjJZg0nKF7VvxMYQIkG_Vx6ZRDJZYZ8nHY45v5vFiEKH5wdt1qqHOY6wgG6Nt0G83Lx4Xnptj_Z8nk8A59GDmk3x33vAN6RptNfFZOxFqox6tprJOPAB0nlLpJdddlOTWwRdnh8hlarUb4D",
    alt: "Analista esportiva com tablet em estádio",
  },
] as const;

/**
 * Layout espelhando `stitch/login_sign_in/code.html` + tokens `uptempo_dynamic/DESIGN.md`.
 * Coluna esquerda (hero) + slot para coluna do formulário à direita.
 */
export function UptempoLoginShell({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 selection:bg-uptempo-primary-container selection:text-uptempo-on-primary-container">
        <div
          className="uptempo-kinetic-bg pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div
          className="uptempo-asymmetric-grid pointer-events-none absolute inset-0"
          aria-hidden
        />

        <div className="relative z-10 grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-12">
          {/* Branding / hero — lg:col-span-7 */}
          <div className="hidden flex-col space-y-8 pr-12 lg:col-span-7 lg:flex">
            <div className="space-y-2">
              <span className="font-uptempo-headline text-sm font-bold uppercase tracking-[0.2em] text-uptempo-primary">
                Inteligência atlética
              </span>
              <h1 className="font-uptempo-headline text-6xl font-black leading-[0.9] tracking-tighter text-uptempo-on-background xl:text-8xl">
                KitRunner <br />
                <span className="text-uptempo-secondary opacity-80">Manager</span>
              </h1>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-uptempo-on-surface-variant">
              Monitoramento de precisão para operações esportivas de elite. Acesse
              o painel e coordene a performance cinética da sua equipe com clareza
              editorial.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {COACH_AVATARS.map(({ src, alt }) => (
                  <img
                    key={src.slice(-40)}
                    className="h-12 w-12 rounded-full border-4 border-uptempo-surface object-cover shadow-sm"
                    src={src}
                    alt={alt}
                    width={48}
                    height={48}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-uptempo-on-surface-variant">
                +200 treinadores de elite entraram esta semana
              </span>
            </div>
          </div>

          {/* Form column — lg:col-span-5 */}
          <div className="w-full lg:col-span-5">{children}</div>
        </div>
      </main>

      {/* Bloco do HTML original — mantido oculto (splash de sucesso) */}
      <div
        id="success-overlay"
        className="fixed inset-0 z-[100] hidden flex items-center justify-center bg-uptempo-background/95 p-6 text-center backdrop-blur-md"
        aria-hidden
      >
        <div className="max-w-sm space-y-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-uptempo-tertiary-container text-uptempo-on-tertiary-container">
            <svg
              className="h-12 w-12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-uptempo-headline text-3xl font-black text-uptempo-on-background">
              Authenticated
            </h3>
            <p className="text-uptempo-on-surface-variant">
              Syncing with performance servers...
            </p>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-uptempo-surface-container-highest">
            <div className="h-full w-1/3 animate-pulse bg-uptempo-primary" />
          </div>
        </div>
      </div>
    </>
  );
}
