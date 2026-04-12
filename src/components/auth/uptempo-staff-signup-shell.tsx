import type { ReactNode } from "react";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Kozk-5rCUpqEhFyA-EjctV0cJYcp0Rh7fCjvOgyxsYOLVSO-swL3TQETOhu2tn-XqGXZ9dpzq0uaAgsBPDgA3P6SkWbGWW0s1leZ6xv7fUUyn89dHIr40eMwrn6TvO33TtO0CuA4ZR0jeEwI6Ne9PsGNWiGscncSndCaA3-JNZzeMOUxE-qNU9b3FyNOEBydF8xkKXDkNx5fzAhVOp7PK_CFvwKv0siG9MYdbxiGwuTp7SGF83MmKIhlaIxyYMK4KZ4ORlnn_Xhd";

const STAFF_AVATARS = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6iq-qyetbFh7ubiCjUh3dqF3RLAZSuDSs-2Y5fSgJs209laxKoIr-Dh3Hyv5onnZT7Mu3_m1wL0sRwD7SEHOnVk42tkQPyBnfPS6VxB6XixTyrmctyT8Aq9yU0seVCukpeTF-2zPFYNkdtwcl1lJuaazA2thy0eMT0iynHJDFR-tA18teSPN-sbuyhEh9qM6h9fDq-aOFt2KSwtHFtPeyhlpSTGXmcrMGmvUypz1XKhjDBfFeMZW07SpbXpS2B4IsZd4nLLDDpbSC",
    alt: "Coordenador esportivo",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcZUvXdQ3Nhz4k7fmHEnaRcLWwCr0GltEAR6hAkG1HGihKtRyyHOt9QOt5GYnCBU2KanV8VN-F41L44Xu922tQykLnXM65NXY8EsTTG8Gt4T4ncbRyHnV_bBcAMJjIyAF9nSZWDWlxnKsEJZ-MFeJeFUMj83hTVkvT_DQb-bSFqOVeuO0a5skx7pY-OcZfPx0BlKOvHHw1Qy9MuIMQDsCZwP-tyFlVIAdcO17_l47rDl42X366EsbnO742r2q_Z_gcLx1o5Ql6Rvk_",
    alt: "Gestora de eventos",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIss2AgDYxSa1xlj3pEyJB6SY7FqwB4O26Su0pXRVgQDugOzJGdy6Qm7qwJmMGxoXqofsB22UP5UyDZquFsORyq782yYaybrkLOtiXTiU_e7qpMuagAHtNu2mFi6MmRqML8YmGCT5sMFKMpSllCzMMllQdfYNsYu2hWcFxF-rVP_saStHN3L7rG8S1wKDx4RMOeFm3ITxTSnZKKH8N4Uah6JHsu2A4dmAFF0815Mzv57y6dNPy8YQ_gzwiTIK04gD40VMGsEiNtBS5",
    alt: "Membro da equipe no estádio",
  },
] as const;

/**
 * Layout espelhando `stitch/staff_sign_up/code.html` (painel esquerdo + slot da coluna do formulário).
 */
export function UptempoStaffSignupShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-uptempo-surface-container-low shadow-2xl lg:grid lg:grid-cols-12 lg:gap-0">
      {/* Coluna esquerda — lg:col-span-5 */}
      <div className="relative hidden min-h-[420px] flex-col justify-between overflow-hidden text-white lg:col-span-5 lg:flex lg:p-12">
        <div className="absolute inset-0 z-0">
          <img
            className="h-full w-full object-cover"
            src={HERO_IMAGE}
            alt=""
            width={1200}
            height={1600}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-uptempo-primary/80 to-uptempo-secondary/90 mix-blend-multiply"
            aria-hidden
          />
        </div>
        <div className="relative z-10">
          <div className="font-uptempo-headline mb-2 text-3xl font-black tracking-tighter">
            KitRunner
          </div>
          <div className="h-1 w-12 rounded-sm bg-uptempo-primary-container" />
        </div>
        <div className="relative z-10">
          <h2 className="mb-6 font-uptempo-headline text-4xl font-bold leading-tight tracking-tight">
            Alimentando a próxima geração de logística esportiva de elite.
          </h2>
          <p className="max-w-md text-lg font-medium text-white/80">
            Faça parte da nossa rede global de equipes que gerencia os eventos
            atléticos mais prestigiados do mundo.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {STAFF_AVATARS.map(({ src, alt }) => (
              <img
                key={src.slice(-36)}
                className="h-10 w-10 rounded-full border-2 border-white object-cover"
                src={src}
                alt={alt}
                width={40}
                height={40}
              />
            ))}
          </div>
          <span className="text-sm font-semibold tracking-wide">
            Mais de 2,4 mil membros da equipe este mês
          </span>
        </div>
      </div>

      {/* Coluna direita — lg:col-span-7 */}
      <div className="flex flex-col justify-center bg-uptempo-surface-container-lowest p-8 md:p-16 lg:col-span-7">
        {children}
      </div>
    </div>
  );
}
