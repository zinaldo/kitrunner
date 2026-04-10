"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminServerClient } from "@/lib/supabase/admin-server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { Database } from "@/lib/supabase/types";

export type ConfirmDeliveryInput = {
  registrationId: string;
  deskId: string;
};

export async function confirmDeliveryAction(
  input: ConfirmDeliveryInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const deliveredAt = new Date().toISOString();

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return {
        ok: false,
        error:
          "Sessão inválida ou expirada. Faça login como equipe para confirmar a entrega.",
      };
    }

    const staffUserId = user.id;
    const admin = createSupabaseAdminServerClient();
    const writeClient = (admin ?? supabase) as SupabaseClient<Database>;

    const { error: insertError } = await writeClient.from("deliveries").insert({
      registration_id: input.registrationId,
      desk_id: input.deskId,
      staff_user_id: staffUserId,
      delivered_at: deliveredAt,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          ok: false,
          error: "Esta inscrição já possui uma entrega registrada.",
        };
      }
      return { ok: false, error: insertError.message };
    }

    const { error: updateError } = await writeClient
      .from("registrations")
      .update({
        kit_status: "delivered",
        delivered_at: deliveredAt,
        delivered_by_user_id: staffUserId,
        last_desk_id: input.deskId,
      })
      .eq("id", input.registrationId);

    if (updateError) {
      return {
        ok: false,
        error: `Entrega registrada, mas falha ao atualizar inscrição: ${updateError.message}`,
      };
    }

    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Falha ao confirmar entrega";
    return { ok: false, error: message };
  }
}
