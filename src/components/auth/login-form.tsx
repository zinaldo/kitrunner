"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { mapAuthErrorToPt } from "@/lib/auth/map-auth-error";
import { staffEventsPath, staffSignUpPath } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function IconVisibility({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function IconVisibilityOff({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}

const inputClassName =
  "w-full rounded-lg border-none bg-uptempo-surface-container-low py-4 pl-11 pr-4 transition-all duration-300 placeholder:text-uptempo-outline/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-uptempo-primary/40";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  const nextRaw = searchParams.get("next");
  const nextPath =
    nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : staffEventsPath();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        err instanceof Error
          ? mapAuthErrorToPt(err.message)
          : "Não foi possível entrar.",
      );
      setPending(false);
    }
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-uptempo-outline-variant/10 bg-uptempo-surface-container-lowest p-8 shadow-uptempo-card md:p-12">
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-bl-3xl bg-uptempo-primary-container/10 blur-2xl"
          aria-hidden
        />
        <div className="relative z-10">
          <header className="mb-10">
            <div className="mb-8 lg:hidden">
              <span className="font-uptempo-headline text-3xl font-black tracking-tighter text-uptempo-primary">
                KitRunner
              </span>
            </div>
            <h2 className="font-uptempo-headline text-3xl font-bold tracking-tight text-uptempo-on-background">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-uptempo-on-surface-variant">
              Digite suas credenciais para acessar a plataforma
            </p>
          </header>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                className="ml-1 block text-sm font-bold uppercase tracking-wider text-uptempo-on-surface"
                htmlFor={emailId}
              >
                E-mail
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-uptempo-outline">
                  <IconMail />
                </div>
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className={inputClassName}
                  placeholder="nome@organizacao.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label
                  className="block text-sm font-bold uppercase tracking-wider text-uptempo-on-surface"
                  htmlFor={passwordId}
                >
                  Senha
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-uptempo-primary transition-colors hover:text-uptempo-primary-container"
                  onClick={(e) => e.preventDefault()}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-uptempo-outline">
                  <IconLock />
                </div>
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className={`${inputClassName} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-uptempo-outline transition-colors hover:text-uptempo-primary"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {showPassword ? <IconVisibilityOff /> : <IconVisibility />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 px-1">
              <div className="relative flex items-center">
                <input
                  id={rememberId}
                  name="remember"
                  type="checkbox"
                  defaultChecked={false}
                  className="h-5 w-5 cursor-pointer rounded border-uptempo-outline-variant bg-uptempo-surface-container-low text-uptempo-primary focus:ring-uptempo-primary/20"
                />
              </div>
              <label
                htmlFor={rememberId}
                className="cursor-pointer select-none text-sm font-medium text-uptempo-on-surface-variant"
              >
                Lembrar este dispositivo por 30 dias
              </label>
            </div>

            {error ? (
              <p
                className="rounded-lg border border-uptempo-error/30 bg-uptempo-error-container/50 px-4 py-3 text-sm text-uptempo-on-error-container"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full transform rounded-xl bg-gradient-to-r from-uptempo-primary to-uptempo-primary-container py-4 font-uptempo-headline font-bold text-uptempo-on-primary shadow-uptempo-cta transition-all duration-200 hover:-translate-y-0.5 hover:shadow-uptempo-cta-hover active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {pending ? "Entrando…" : "Entrar no painel"}
            </button>
          </form>

          <footer className="mt-10 border-t border-uptempo-outline-variant/10 pt-8 text-center">
            <p className="text-sm text-uptempo-on-surface-variant">
              Não tem conta administrativa?{" "}
              <br className="md:hidden" />
              <Link
                href={staffSignUpPath()}
                className="font-bold text-uptempo-secondary transition-colors hover:text-uptempo-primary"
              >
                Criar conta de equipe
              </Link>
            </p>
          </footer>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between px-4 opacity-40">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-uptempo-outline-variant" />
        <div className="mx-4 font-uptempo-headline text-[10px] font-black uppercase tracking-[0.3em] text-uptempo-outline">
          Uptempo Core v4.2
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-uptempo-outline-variant" />
      </div>
    </>
  );
}
