import type { User } from "@supabase/supabase-js";

/**
 * Papel da conta no app (metadata do Supabase Auth).
 * Cadastro em /signup/staff grava `app_role: "staff"`.
 * Organizadores costumam não ter a chave ou usar `organizer`.
 */
export function appRoleFromUserMetadata(user: User | null): string | undefined {
  if (!user) return undefined;
  const r = user.user_metadata?.app_role;
  return typeof r === "string" ? r.trim().toLowerCase() : undefined;
}

/** Operador de guichê — não acessa /admin. */
export function userIsStaffRole(user: User | null): boolean {
  return appRoleFromUserMetadata(user) === "staff";
}

/** Pode usar rotas e ações de organização (tudo que não for staff-only). */
export function userCanAccessAdmin(user: User | null): boolean {
  return user != null && !userIsStaffRole(user);
}
