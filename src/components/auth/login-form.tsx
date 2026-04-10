"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CandyCard } from "@/components/candy/candy-card";
import { mapAuthErrorToPt } from "@/lib/auth/map-auth-error";
import { staffEventsPath, staffSignUpPath } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const inputClass =
  "mt-1.5 w-full rounded-candy border border-candy-outline/25 bg-white/90 px-3 py-2.5 text-sm text-candy-ink shadow-sm placeholder:text-candy-muted/70 focus:border-candy-primary focus:outline-none focus:ring-2 focus:ring-candy-primary/25";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");
  const nextPath =
    nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : staffEventsPath();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(mapAuthErrorToPt(authError.message));
        setPending(false);
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? mapAuthErrorToPt(err.message) : "Não foi possível entrar.",
      );
      setPending(false);
    }
  }

  return (
    <CandyCard elevation="lg" className="p-8 sm:p-9">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-candy-muted">
        KitRunner
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-candy-ink sm:text-3xl">
        Entrar
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-candy-muted">
        Use o e-mail e a senha da sua conta para acessar o posto de equipe e os
        fluxos operacionais.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-candy-ink">
          E-mail
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={inputClass}
            placeholder="voce@exemplo.com"
          />
        </label>
        <label className="block text-sm font-medium text-candy-ink">
          Senha
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className={inputClass}
            placeholder="••••••••"
            minLength={6}
          />
        </label>

        {error ? (
          <p className="rounded-candy border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-900">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-candy bg-candy-primary px-4 py-2.5 text-sm font-bold text-candy-on-primary shadow-candy-primary transition hover:opacity-95 disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Continuar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-candy-muted">
        É operador de guichê e ainda não tem conta?{" "}
        <Link
          href={staffSignUpPath()}
          className="font-bold text-candy-tertiary underline-offset-2 hover:underline"
        >
          Criar conta de equipe
        </Link>
      </p>

      <p className="mt-4 text-center text-xs leading-relaxed text-candy-muted">
        Esqueceu a senha? Use recuperação no painel Supabase (Authentication →
        Users) ou peça a um administrador do projeto.
      </p>
    </CandyCard>
  );
}
