import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const USERS_PAGE_SIZE = 200;
const MAX_PAGES = 100;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Resolve auth user id from email using the Admin API (requires service_role).
 * Paginates `listUsers` until a match is found (case-insensitive email).
 */
export async function findAuthUserIdByEmail(
  adminClient: SupabaseClient<Database>,
  email: string,
): Promise<{ userId: string; email: string } | { error: string }> {
  const target = normalizeEmail(email);
  if (!target || !target.includes("@")) {
    return { error: "Informe um e-mail válido." };
  }

  let page = 1;

  for (let i = 0; i < MAX_PAGES; i++) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: USERS_PAGE_SIZE,
    });

    if (error) {
      return { error: error.message };
    }

    const hit = data.users.find(
      (u) => (u.email ?? "").trim().toLowerCase() === target,
    );

    if (hit?.id) {
      return { userId: hit.id, email: hit.email ?? target };
    }

    if (data.users.length < USERS_PAGE_SIZE) {
      break;
    }
    page += 1;
  }

  return {
    error:
      "Nenhum usuário encontrado com este e-mail. A pessoa precisa se cadastrar em Cadastro equipe ou você pode criá-la no Supabase (Authentication).",
  };
}
