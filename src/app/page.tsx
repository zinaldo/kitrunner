import Link from "next/link";
import { redirect } from "next/navigation";
import {
  adminEventsPath,
  displayDeskPath,
  displayTvPath,
  loginPath,
  staffDeskPath,
  staffEventsPath,
} from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const demoEventId = "demo-event";
const demoDeskId = "desk-1";

/** Evita HTML estático da raiz sem checagem de sessão (middleware nem sempre cobre `/` em todos os builds). */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(loginPath());
  }

  return (
    <div className="min-h-screen bg-stitch-canvas">
      <header className="border-b border-stitch-ink/10 bg-stitch-surface">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <span className="text-sm font-semibold tracking-tight text-stitch-ink">
            Kitrunner
          </span>
          <nav className="flex flex-wrap gap-3 text-sm text-stitch-muted">
            <Link
              href={loginPath()}
              className="hover:text-stitch-ink"
            >
              Entrar
            </Link>
            <Link
              href={staffEventsPath()}
              className="hover:text-stitch-ink"
            >
              Equipe
            </Link>
            <Link
              href={adminEventsPath()}
              className="hover:text-stitch-ink"
            >
              Administração
            </Link>
            <Link
              href={displayTvPath(demoEventId)}
              className="hover:text-stitch-ink"
            >
              TV (demo)
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stitch-ink">
            MVP de entrega de kits
          </h1>
          <p className="mt-2 text-sm text-stitch-muted">
            Shell de interface — use IDs demo nas rotas de display:{" "}
            <code className="rounded bg-stitch-accent-soft/50 px-1 py-0.5 text-stitch-ink">
              {demoEventId}
            </code>
            ,{" "}
            <code className="rounded bg-stitch-accent-soft/50 px-1 py-0.5 text-stitch-ink">
              {demoDeskId}
            </code>
            .
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href={loginPath()}
              className="block rounded-stitch border border-stitch-ink/10 bg-stitch-surface px-4 py-3 text-sm font-medium text-stitch-ink shadow-sm transition hover:border-stitch-accent/40"
            >
              Entrar
            </Link>
          </li>
          <li>
            <Link
              href={staffEventsPath()}
              className="block rounded-stitch border border-stitch-ink/10 bg-stitch-surface px-4 py-3 text-sm font-medium text-stitch-ink shadow-sm transition hover:border-stitch-accent/40"
            >
              Equipe — eventos
            </Link>
          </li>
          <li>
            <Link
              href={staffDeskPath(demoEventId, demoDeskId)}
              className="block rounded-stitch border border-stitch-ink/10 bg-stitch-surface px-4 py-3 text-sm font-medium text-stitch-ink shadow-sm transition hover:border-stitch-accent/40"
            >
              Equipe — console do guichê
            </Link>
          </li>
          <li>
            <Link
              href={displayTvPath(demoEventId)}
              className="block rounded-stitch border border-stitch-ink/10 bg-stitch-surface px-4 py-3 text-sm font-medium text-stitch-ink shadow-sm transition hover:border-stitch-accent/40"
            >
              TV pública — vários guichês
            </Link>
          </li>
          <li>
            <Link
              href={displayDeskPath(demoEventId, demoDeskId)}
              className="block rounded-stitch border border-stitch-ink/10 bg-stitch-surface px-4 py-3 text-sm font-medium text-stitch-ink shadow-sm transition hover:border-stitch-accent/40"
            >
              TV pública — um guichê
            </Link>
          </li>
          <li>
            <Link
              href={adminEventsPath()}
              className="block rounded-stitch border border-stitch-ink/10 bg-stitch-surface px-4 py-3 text-sm font-medium text-stitch-ink shadow-sm transition hover:border-stitch-accent/40"
            >
              Administração — eventos
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
