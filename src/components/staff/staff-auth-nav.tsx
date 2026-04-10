"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { loginPath, staffSignUpPath } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export function StaffAuthNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  const refreshSession = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user.email ?? null);
    } catch {
      setEmail(null);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  async function signOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      setEmail(null);
      router.refresh();
    }
  }

  if (email === undefined) {
    return (
      <span className="text-xs text-candy-muted" aria-hidden>
        …
      </span>
    );
  }

  if (!email) {
    return (
      <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold sm:text-sm">
        <Link
          href={loginPath()}
          className="rounded-candy-pill border border-candy-outline/25 px-3 py-1.5 text-candy-secondary transition hover:border-candy-secondary/50 hover:bg-candy-secondary/10"
        >
          Entrar
        </Link>
        <Link
          href={staffSignUpPath()}
          className="rounded-candy-pill bg-candy-primary/90 px-3 py-1.5 text-candy-on-primary shadow-candy-card-soft transition hover:bg-candy-primary"
        >
          Cadastro equipe
        </Link>
      </nav>
    );
  }

  return (
    <div className="flex max-w-[min(100%,280px)] flex-wrap items-center justify-end gap-2 sm:gap-3">
      <span
        className="truncate text-xs text-candy-muted"
        title={email}
      >
        {email}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="rounded-candy-pill border border-candy-outline/30 px-3 py-1.5 text-xs font-semibold text-candy-ink transition hover:bg-candy-container-low"
      >
        Sair
      </button>
    </div>
  );
}
