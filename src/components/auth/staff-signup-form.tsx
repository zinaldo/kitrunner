"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CandyCard } from "@/components/candy/candy-card";
import { mapAuthErrorToPt } from "@/lib/auth/map-auth-error";
import { loginPath, staffEventsPath } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const inputClass =
  "mt-1.5 w-full rounded-candy border border-candy-outline/25 bg-white/90 px-3 py-2.5 text-sm text-candy-ink shadow-sm placeholder:text-candy-muted/70 focus:border-candy-primary focus:outline-none focus:ring-2 focus:ring-candy-primary/25";

export function StaffSignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

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
    <CandyCard elevation="lg" className="p-8 sm:p-9">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-candy-muted">
        KitRunner
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-candy-ink sm:text-3xl">
        Criar conta de equipe
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-candy-muted">
        Cadastro para quem opera guichê e entrega de kits. Um administrador pode
        precisar vincular seu usuário ao evento em{" "}
        <span className="font-semibold text-candy-ink">Configurações da prova</span>.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-candy-ink">
          Nome completo
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={fullName}
            onChange={(ev) => setFullName(ev.target.value)}
            className={inputClass}
            placeholder="Como no crachá ou lista de inscrições"
          />
        </label>
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className={inputClass}
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </label>
        <label className="block text-sm font-medium text-candy-ink">
          Confirmar senha
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(ev) => setConfirm(ev.target.value)}
            className={inputClass}
            placeholder="Repita a senha"
            minLength={6}
          />
        </label>

        {error ? (
          <p className="rounded-candy border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-900">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-candy border border-candy-tertiary/35 bg-candy-tertiary/10 px-3 py-2 text-sm text-candy-ink">
            {info}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-candy bg-candy-primary px-4 py-2.5 text-sm font-bold text-candy-on-primary shadow-candy-primary transition hover:opacity-95 disabled:opacity-60"
        >
          {pending ? "Criando conta…" : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-candy-muted">
        Já tem conta?{" "}
        <Link
          href={loginPath()}
          className="font-bold text-candy-tertiary underline-offset-2 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </CandyCard>
  );
}
