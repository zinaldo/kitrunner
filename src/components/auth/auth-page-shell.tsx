import type { ReactNode } from "react";

type AuthPageShellProps = {
  children: ReactNode;
  /** Reservado para consistência de API com os layouts; sem header nesta shell. */
  variant?: "login" | "signup";
};

/**
 * Fundo alinhado ao Candy / Joyful Pop (tokens `.candy-staff`), sem header — só o formulário.
 */
export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="candy-staff relative flex min-h-dvh flex-col bg-candy-background font-sans text-candy-ink antialiased">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_88%_56%_at_50%_-20%,rgb(224_64_160_/_0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_52%_42%_at_100%_108%,rgb(0_150_204_/_0.14),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_40%_36%_at_0%_80%,rgb(124_82_170_/_0.1),transparent_50%)]"
        aria-hidden
      />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
