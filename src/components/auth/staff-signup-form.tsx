"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { mapAuthErrorToPt } from "@/lib/auth/map-auth-error";
import { loginPath, staffEventsPath } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const ROLE_OPTIONS: { value: string; label: string; disabled?: boolean }[] = [
  { value: "", label: "Selecione sua função", disabled: true },
  { value: "event_coordinator", label: "Coordenação de evento" },
  { value: "kit_delivery", label: "Entrega de kits" },
  { value: "support", label: "Suporte" },
];

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

function IconExpandMore({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-lg border-none bg-uptempo-surface-container-low px-6 py-4 font-medium text-uptempo-on-surface transition-all placeholder:text-uptempo-outline/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-uptempo-primary/40";

export function StaffSignupForm() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();
  const passwordId = useId();
  const confirmId = useId();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!role) {
      setError("Selecione uma função atribuída.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}${loginPath()}`,
          data: {
            full_name: fullName.trim() || undefined,
            app_role: "staff",
            staff_role: role,
          },
        },
      });

      if (authError) {
        setError(mapAuthErrorToPt(authError.message));
        setPending(false);
        return;
      }

      if (data.session) {
        setInfo("Conta criada. Redirecionando…");
        router.replace(staffEventsPath());
        router.refresh();
        return;
      }

      setInfo(
        "Enviamos um link de confirmação para seu e-mail. Após confirmar, volte aqui para entrar.",
      );
      setPending(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? mapAuthErrorToPt(err.message)
          : "Não foi possível criar a conta.",
      );
      setPending(false);
    }
  }

  return (
    <>
      <div className="mb-8 lg:hidden">
        <div className="font-uptempo-headline text-2xl font-black tracking-tighter text-uptempo-primary">
          KitRunner
        </div>
      </div>

      <div className="mb-10">
        <h1 className="mb-2 font-uptempo-headline text-3xl font-black tracking-tight text-uptempo-secondary md:text-4xl">
          Cadastro da equipe
        </h1>
        <p className="font-medium text-uptempo-on-surface-variant">
          Crie suas credenciais administrativas para começar.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label
            htmlFor={nameId}
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-uptempo-primary"
          >
            Nome completo
          </label>
          <input
            id={nameId}
            type="text"
            name="name"
            autoComplete="name"
            value={fullName}
            onChange={(ev) => setFullName(ev.target.value)}
            className={inputClass}
            placeholder="Alex Thompson"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor={emailId}
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-uptempo-primary"
          >
            E-mail
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={inputClass}
            placeholder="alex.t@kitrunner.io"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor={roleId}
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-uptempo-primary"
          >
            Função atribuída
          </label>
          <div className="relative">
            <select
              id={roleId}
              name="role"
              required
              value={role}
              onChange={(ev) => setRole(ev.target.value)}
              className={`${inputClass} appearance-none pr-12`}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option
                  key={opt.value || "placeholder"}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-uptempo-primary">
              <IconExpandMore />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
          <div className="flex min-w-0 flex-col">
            <label
              htmlFor={passwordId}
              className="mb-2 flex min-h-[2.75rem] items-end text-xs font-bold uppercase tracking-widest text-uptempo-primary"
            >
              Senha
            </label>
            <div className="relative min-h-[3.5rem]">
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className={`${inputClass} min-h-[3.5rem] pr-14`}
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-uptempo-outline transition-colors hover:text-uptempo-primary"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <IconVisibilityOff /> : <IconVisibility />}
              </button>
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <label
              htmlFor={confirmId}
              className="mb-2 flex min-h-[2.75rem] items-end text-xs font-bold uppercase tracking-widest text-uptempo-primary"
            >
              Confirmar senha
            </label>
            <div className="relative min-h-[3.5rem]">
              <input
                id={confirmId}
                type="password"
                name="confirm"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(ev) => setConfirm(ev.target.value)}
                className={`${inputClass} min-h-[3.5rem] pr-14`}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>
        </div>

        {error ? (
          <p
            className="rounded-lg border border-uptempo-error/30 bg-uptempo-error-container/50 px-4 py-3 text-sm text-uptempo-on-error-container"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-lg border border-uptempo-tertiary-container/40 bg-uptempo-tertiary-container/15 px-4 py-3 text-sm text-uptempo-on-tertiary-container">
            {info}
          </p>
        ) : null}

        <div className="pt-4">
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-gradient-to-r from-uptempo-primary to-uptempo-primary-container py-5 text-lg font-bold text-white shadow-[0_12px_40px_rgba(0,101,140,0.2)] transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {pending ? "Criando conta…" : "Criar conta"}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-uptempo-outline-variant/15 pt-8 md:flex-row">
        <p className="text-sm font-medium text-uptempo-on-surface-variant">
          Já faz parte da equipe?{" "}
          <Link
            href={loginPath()}
            className="font-bold text-uptempo-primary hover:underline"
          >
            Entrar aqui
          </Link>
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-xs font-bold uppercase tracking-widest text-uptempo-outline transition-colors hover:text-uptempo-primary"
            onClick={(e) => e.preventDefault()}
          >
            Privacidade
          </a>
          <a
            href="#"
            className="text-xs font-bold uppercase tracking-widest text-uptempo-outline transition-colors hover:text-uptempo-primary"
            onClick={(e) => e.preventDefault()}
          >
            Termos
          </a>
        </div>
      </div>
    </>
  );
}
