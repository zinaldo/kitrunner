"use server";

import { revalidatePath } from "next/cache";
import {
  defaultImportRulesState,
  type EventImportRulesState,
  IMPORT_FIELD_KEYS,
} from "@/lib/event-import-rules";
import { DEFAULT_KIT_SHIRT_ITEM_LABEL } from "@/lib/kit-architecture";
import { replaceEventRequiredFields } from "@/lib/queries/event-import-rules-resolve";
import { slugifyPt } from "@/lib/slugify";
import type { EventStatus } from "@/lib/supabase/types";
import { findAuthUserIdByEmail } from "@/lib/auth/admin-find-user-by-email";
import { organizerActionGate } from "@/lib/auth/require-organizer";
import { createSupabaseAdminServerClient } from "@/lib/supabase/admin-server-client";
import { isMissingSchemaEntityError } from "@/lib/supabase/column-error";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getServerSupabase() {
  const admin = createSupabaseAdminServerClient();
  return admin ?? (await createSupabaseServerClient());
}

function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

function normalizeImportRules(input: EventImportRulesState): EventImportRulesState {
  const base = defaultImportRulesState();
  const out = { ...base };
  for (const key of IMPORT_FIELD_KEYS) {
    const m = input[key];
    if (m === "required" || m === "optional" || m === "off") {
      out[key] = m;
    }
  }
  out.bib_number = "required";
  out.full_name = "required";
  out.sex = "required";
  out.race_id = "required";
  return out;
}

type ActionError = { ok: false; error: string };
type Ok = { ok: true };

function revalidateAdminEvent(routeKey: string) {
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${routeKey}/settings`);
}

export async function updateEventCoreAction(input: {
  eventId: string;
  name: string;
  slug: string;
  eventDate: string;
  startsAtLocal: string;
  endsAtLocal: string;
  status: EventStatus;
}): Promise<Ok | ActionError> {
  if (!isUuid(input.eventId)) return { ok: false, error: "ID do evento inválido." };
  const name = input.name.trim();
  if (name.length < 2 || name.length > 200) {
    return { ok: false, error: "Nome da prova deve ter entre 2 e 200 caracteres." };
  }

  const slugRaw = input.slug.trim();
  const slug = slugRaw.length > 0 ? slugifyPt(slugRaw) : null;

  const event_date = input.eventDate.trim() || null;
  const starts_at = input.startsAtLocal.trim()
    ? new Date(input.startsAtLocal).toISOString()
    : null;
  const ends_at = input.endsAtLocal.trim()
    ? new Date(input.endsAtLocal).toISOString()
    : null;

  if (input.startsAtLocal.trim() && Number.isNaN(Date.parse(input.startsAtLocal))) {
    return { ok: false, error: "Início da retirada inválido." };
  }
  if (input.endsAtLocal.trim() && Number.isNaN(Date.parse(input.endsAtLocal))) {
    return { ok: false, error: "Fim da retirada inválido." };
  }

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) return gate;
    const supabase = await getServerSupabase();
    const { data: before } = await supabase
      .from("events")
      .select("slug, id")
      .eq("id", input.eventId)
      .maybeSingle();

    const { error } = await supabase
      .from("events")
      .update({
        name,
        slug,
        event_date,
        starts_at,
        ends_at,
        status: input.status,
      })
      .eq("id", input.eventId);

    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Este slug já está em uso. Escolha outro." };
      }
      return { ok: false, error: error.message };
    }

    const routeKey = slug?.length ? slug : input.eventId;
    revalidateAdminEvent(routeKey);
    if (before?.slug && before.slug !== slug) {
      revalidateAdminEvent(before.slug);
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao salvar o evento.";
    return { ok: false, error: message };
  }
}

export async function updateEventImportRulesAction(input: {
  eventId: string;
  rules: EventImportRulesState;
}): Promise<Ok | ActionError> {
  if (!isUuid(input.eventId)) return { ok: false, error: "ID do evento inválido." };
  const rules = normalizeImportRules(input.rules);

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) return gate;
    const supabase = await getServerSupabase();
    const { data: ev } = await supabase
      .from("events")
      .select("slug, id")
      .eq("id", input.eventId)
      .maybeSingle();

    const saved = await replaceEventRequiredFields(supabase, input.eventId, rules);
    if (!saved.ok) {
      return { ok: false, error: saved.error };
    }

    const routeKey = ev?.slug?.trim() || input.eventId;
    revalidateAdminEvent(routeKey);
    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Falha ao salvar regras de importação.";
    return { ok: false, error: message };
  }
}

export type RaceDraftInput = {
  id?: string;
  name: string;
  distanceKm: string;
  wave: string;
};

export async function syncRacesAction(input: {
  eventId: string;
  races: RaceDraftInput[];
}): Promise<Ok | ActionError> {
  if (!isUuid(input.eventId)) return { ok: false, error: "ID do evento inválido." };

  const normalized: {
    id?: string;
    name: string;
    distance_km: number | null;
    wave: string | null;
    sort_order: number;
  }[] = [];

  for (let index = 0; index < input.races.length; index++) {
    const r = input.races[index];
    const name = r.name.trim();
    if (name.length < 1 || name.length > 120) {
      return {
        ok: false,
        error: `Modalidade ${index + 1}: nome inválido (1–120 caracteres).`,
      };
    }
    let distance_km: number | null = null;
    if (r.distanceKm.trim()) {
      const n = Number(r.distanceKm.replace(",", "."));
      if (Number.isNaN(n) || n < 0 || n > 9999) {
        return {
          ok: false,
          error: `Modalidade “${name}”: distância inválida.`,
        };
      }
      distance_km = n;
    }
    const wave = r.wave.trim() || null;
    normalized.push({
      id: r.id?.trim(),
      name,
      distance_km,
      wave,
      sort_order: index,
    });
  }

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) return gate;
    const supabase = await getServerSupabase();

    const { data: ev } = await supabase
      .from("events")
      .select("slug, id")
      .eq("id", input.eventId)
      .maybeSingle();

    const { data: existing, error: exErr } = await supabase
      .from("races")
      .select("id")
      .eq("event_id", input.eventId);
    if (exErr) return { ok: false, error: exErr.message };

    const existingIds = new Set((existing ?? []).map((x) => x.id));
    const keepIds = new Set(
      normalized.map((r) => r.id).filter((id): id is string => !!id && isUuid(id)),
    );

    for (const id of existingIds) {
      if (!keepIds.has(id)) {
        const { error: delErr } = await supabase.from("races").delete().eq("id", id);
        if (delErr) {
          return {
            ok: false,
            error:
              delErr.code === "23503"
                ? "Não é possível remover uma modalidade vinculada a inscrições."
                : delErr.message,
          };
        }
      }
    }

    for (const r of normalized) {
      if (r.id && isUuid(r.id)) {
        const { error: upErr } = await supabase
          .from("races")
          .update({
            name: r.name,
            distance_km: r.distance_km,
            wave: r.wave,
            sort_order: r.sort_order,
          })
          .eq("id", r.id)
          .eq("event_id", input.eventId);
        if (upErr) return { ok: false, error: upErr.message };
      } else {
        const { error: insErr } = await supabase.from("races").insert({
          event_id: input.eventId,
          name: r.name,
          distance_km: r.distance_km,
          wave: r.wave,
          sort_order: r.sort_order,
        });
        if (insErr) return { ok: false, error: insErr.message };
      }
    }

    const routeKey = ev?.slug?.trim() || input.eventId;
    revalidateAdminEvent(routeKey);
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao salvar modalidades.";
    return { ok: false, error: message };
  }
}

function normalizeDeskExternalKey(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const s = t
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!s) return null;
  return s.length > 80 ? s.slice(0, 80) : s;
}

export type DeskDraftInput = {
  id?: string;
  label: string;
  externalKey: string;
  isActive: boolean;
};

export async function syncDesksAction(input: {
  eventId: string;
  desks: DeskDraftInput[];
}): Promise<Ok | ActionError> {
  if (!isUuid(input.eventId)) return { ok: false, error: "ID do evento inválido." };

  const normalized: {
    id?: string;
    label: string;
    external_key: string | null;
    is_active: boolean;
    sort_order: number;
  }[] = [];

  for (let index = 0; index < input.desks.length; index++) {
    const d = input.desks[index];
    const label = d.label.trim();
    if (label.length < 1 || label.length > 120) {
      return {
        ok: false,
        error: `Guichê ${index + 1}: nome inválido (1–120 caracteres).`,
      };
    }
    const external_key = normalizeDeskExternalKey(d.externalKey);
    normalized.push({
      id: d.id?.trim(),
      label,
      external_key,
      is_active: d.isActive,
      sort_order: index,
    });
  }

  const nonNullKeys = normalized.map((d) => d.external_key).filter((k): k is string => k != null);
  if (new Set(nonNullKeys).size !== nonNullKeys.length) {
    return {
      ok: false,
      error: "Cada chave de URL (slug do guichê) precisa ser única entre os guichês desta prova.",
    };
  }

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) return gate;
    const supabase = await getServerSupabase();

    const { data: ev } = await supabase
      .from("events")
      .select("slug, id")
      .eq("id", input.eventId)
      .maybeSingle();

    const { data: existing, error: exErr } = await supabase
      .from("desks")
      .select("id")
      .eq("event_id", input.eventId);
    if (exErr) return { ok: false, error: exErr.message };

    const existingIds = new Set((existing ?? []).map((x) => x.id));
    const keepIds = new Set(
      normalized.map((d) => d.id).filter((id): id is string => !!id && isUuid(id)),
    );

    for (const id of existingIds) {
      if (!keepIds.has(id)) {
        const { error: delErr } = await supabase
          .from("desks")
          .delete()
          .eq("id", id)
          .eq("event_id", input.eventId);
        if (delErr) {
          return {
            ok: false,
            error:
              delErr.code === "23503"
                ? "Não é possível remover um guichê que já tem entregas, inscrições ou display vinculados."
                : delErr.message,
          };
        }
      }
    }

    for (const d of normalized) {
      if (d.id && isUuid(d.id)) {
        const { error: upErr } = await supabase
          .from("desks")
          .update({
            label: d.label,
            external_key: d.external_key,
            is_active: d.is_active,
            sort_order: d.sort_order,
          })
          .eq("id", d.id)
          .eq("event_id", input.eventId);
        if (upErr) {
          if (upErr.code === "23505") {
            return {
              ok: false,
              error: "Chave de URL duplicada para outro guichê (constraint única no banco).",
            };
          }
          return { ok: false, error: upErr.message };
        }
      } else {
        const { error: insErr } = await supabase.from("desks").insert({
          event_id: input.eventId,
          label: d.label,
          external_key: d.external_key,
          is_active: d.is_active,
          sort_order: d.sort_order,
        });
        if (insErr) {
          if (insErr.code === "23505") {
            return {
              ok: false,
              error: "Chave de URL já existe para um guichê desta prova.",
            };
          }
          return { ok: false, error: insErr.message };
        }
      }
    }

    const routeKey = ev?.slug?.trim() || input.eventId;
    revalidateAdminEvent(routeKey);
    revalidatePath("/staff/events");
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao salvar guichês.";
    return { ok: false, error: message };
  }
}

export type KitTypeDraftInput = {
  id?: string;
  name: string;
};

export async function syncKitTypesAction(input: {
  eventId: string;
  kitTypes: KitTypeDraftInput[];
}): Promise<Ok | ActionError> {
  if (!isUuid(input.eventId)) return { ok: false, error: "ID do evento inválido." };

  const normalized: { id?: string; name: string }[] = [];
  for (let index = 0; index < input.kitTypes.length; index++) {
    const k = input.kitTypes[index];
    const name = k.name.trim();
    if (name.length < 1 || name.length > 120) {
      return {
        ok: false,
        error: `Tipo de kit ${index + 1}: nome inválido (1–120 caracteres).`,
      };
    }
    normalized.push({
      id: k.id?.trim(),
      name,
    });
  }

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) return gate;
    const supabase = await getServerSupabase();

    const { data: ev } = await supabase
      .from("events")
      .select("slug, id")
      .eq("id", input.eventId)
      .maybeSingle();

    const { data: existing, error: exErr } = await supabase
      .from("kit_types")
      .select("id")
      .eq("event_id", input.eventId);
    if (exErr) {
      if (isMissingSchemaEntityError(exErr.message, "kit_types")) {
        return {
          ok: false,
          error:
            "A tabela kit_types ainda não existe. Rode a migração em supabase/migrations/20260409120000_kit_types.sql no SQL Editor do Supabase.",
        };
      }
      return { ok: false, error: exErr.message };
    }

    const existingIds = new Set((existing ?? []).map((x) => x.id));
    const keepIds = new Set(
      normalized.map((k) => k.id).filter((id): id is string => !!id && isUuid(id)),
    );

    for (const id of existingIds) {
      if (!keepIds.has(id)) {
        const { error: delErr } = await supabase
          .from("kit_types")
          .delete()
          .eq("id", id)
          .eq("event_id", input.eventId);
        if (delErr) {
          return {
            ok: false,
            error:
              delErr.code === "23503"
                ? "Não é possível remover um tipo de kit vinculado a inscrições."
                : delErr.message,
          };
        }
      }
    }

    for (const k of normalized) {
      if (k.id && isUuid(k.id)) {
        const { error: upErr } = await supabase
          .from("kit_types")
          .update({
            name: k.name,
          })
          .eq("id", k.id)
          .eq("event_id", input.eventId);
        if (upErr) {
          if (upErr.code === "23505") {
            return {
              ok: false,
              error: "Já existe outro kit com este nome nesta prova.",
            };
          }
          return { ok: false, error: upErr.message };
        }
      } else {
        const { error: insErr } = await supabase.from("kit_types").insert({
          event_id: input.eventId,
          name: k.name,
        });
        if (insErr) {
          if (insErr.code === "23505") {
            return {
              ok: false,
              error: "Nome de kit duplicado nesta prova.",
            };
          }
          return { ok: false, error: insErr.message };
        }
      }
    }

    const { data: kitTypeRows, error: ktSelErr } = await supabase
      .from("kit_types")
      .select("id")
      .eq("event_id", input.eventId);
    if (ktSelErr) {
      return { ok: false, error: ktSelErr.message };
    }

    for (const kt of kitTypeRows ?? []) {
      const { error: itemErr } = await supabase.from("kit_items").insert({
        kit_type_id: kt.id,
        label: DEFAULT_KIT_SHIRT_ITEM_LABEL,
      });
      if (!itemErr) continue;
      if (itemErr.code === "23505") continue;
      if (isMissingSchemaEntityError(itemErr.message, "kit_items")) {
        return {
          ok: false,
          error:
            "A tabela kit_items ainda não existe. Rode a migração em supabase/migrations/20260409150000_kit_items_shirt_size.sql no SQL Editor do Supabase.",
        };
      }
      return { ok: false, error: itemErr.message };
    }

    const routeKey = ev?.slug?.trim() || input.eventId;
    revalidateAdminEvent(routeKey);
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao salvar tipos de kit.";
    return { ok: false, error: message };
  }
}

export async function addEventStaffAction(input: {
  eventId: string;
  email: string;
}): Promise<Ok | ActionError> {
  if (!isUuid(input.eventId)) return { ok: false, error: "ID do evento inválido." };

  const organizerGate = await organizerActionGate();
  if (!organizerGate.ok) return organizerGate;

  const admin = createSupabaseAdminServerClient();
  if (!admin) {
    return {
      ok: false,
      error:
        "Adicionar por e-mail exige SUPABASE_SERVICE_ROLE_KEY no servidor (.env.local), para consultar usuários no Auth.",
    };
  }

  const resolved = await findAuthUserIdByEmail(admin, input.email);
  if ("error" in resolved) {
    return { ok: false, error: resolved.error };
  }

  const userId = resolved.userId;

  try {
    const supabase = await getServerSupabase();
    const { data: ev } = await supabase
      .from("events")
      .select("slug, id")
      .eq("id", input.eventId)
      .maybeSingle();

    const { error } = await supabase.from("event_staff").insert({
      event_id: input.eventId,
      user_id: userId,
      role: "staff",
    });

    if (error) {
      if (isMissingSchemaEntityError(error.message, "event_staff")) {
        return {
          ok: false,
          error:
            "A tabela event_staff ainda não existe. Rode a migração em supabase/migrations/20260408120000_event_staff.sql no SQL Editor do Supabase.",
        };
      }
      if (error.code === "23505") {
        return {
          ok: false,
          error: `O usuário ${resolved.email} já está na equipe deste evento.`,
        };
      }
      if (error.code === "23503") {
        return {
          ok: false,
          error: "Não foi possível vincular o usuário (verifique Auth e políticas).",
        };
      }
      return { ok: false, error: error.message };
    }

    const routeKey = ev?.slug?.trim() || input.eventId;
    revalidateAdminEvent(routeKey);
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao adicionar membro.";
    return { ok: false, error: message };
  }
}

export async function removeEventStaffAction(input: {
  staffRowId: string;
  eventId: string;
}): Promise<Ok | ActionError> {
  if (!isUuid(input.staffRowId) || !isUuid(input.eventId)) {
    return { ok: false, error: "Identificador inválido." };
  }

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) return gate;
    const supabase = await getServerSupabase();
    const { data: ev } = await supabase
      .from("events")
      .select("slug, id")
      .eq("id", input.eventId)
      .maybeSingle();

    const { error } = await supabase
      .from("event_staff")
      .delete()
      .eq("id", input.staffRowId)
      .eq("event_id", input.eventId);

    if (error) {
      if (isMissingSchemaEntityError(error.message, "event_staff")) {
        return {
          ok: false,
          error:
            "A tabela event_staff ainda não existe. Rode a migração em supabase/migrations/20260408120000_event_staff.sql.",
        };
      }
      return { ok: false, error: error.message };
    }

    const routeKey = ev?.slug?.trim() || input.eventId;
    revalidateAdminEvent(routeKey);
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao remover membro.";
    return { ok: false, error: message };
  }
}

export async function createEventAction(input: {
  name: string;
  slug: string;
  eventDate: string;
  startsAtLocal: string;
  endsAtLocal: string;
  status: EventStatus;
  importRules: EventImportRulesState;
}): Promise<
  | { ok: true; eventId: string; routeKey: string }
  | ActionError
> {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 200) {
    return { ok: false, error: "Nome da prova deve ter entre 2 e 200 caracteres." };
  }

  const slugBase = input.slug.trim()
    ? slugifyPt(input.slug.trim())
    : slugifyPt(name);

  const event_date = input.eventDate.trim() || null;
  const starts_at = input.startsAtLocal.trim()
    ? new Date(input.startsAtLocal).toISOString()
    : null;
  const ends_at = input.endsAtLocal.trim()
    ? new Date(input.endsAtLocal).toISOString()
    : null;

  if (input.startsAtLocal.trim() && Number.isNaN(Date.parse(input.startsAtLocal))) {
    return { ok: false, error: "Início da retirada inválido." };
  }
  if (input.endsAtLocal.trim() && Number.isNaN(Date.parse(input.endsAtLocal))) {
    return { ok: false, error: "Fim da retirada inválido." };
  }

  const rules = normalizeImportRules(input.importRules);

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) return gate;
    const supabase = await getServerSupabase();

    let candidate = slugBase;
    let lastError: string | null = null;

    for (let attempt = 0; attempt < 24; attempt++) {
      const baseRow = {
        name,
        slug: candidate,
        status: input.status,
        event_date,
        starts_at,
        ends_at,
      };

      const { data, error } = await supabase
        .from("events")
        .insert(baseRow)
        .select("id, slug")
        .single();

      if (!error && data) {
        const fieldsSaved = await replaceEventRequiredFields(
          supabase,
          data.id,
          rules,
        );
        if (!fieldsSaved.ok) {
          await supabase.from("events").delete().eq("id", data.id);
          return {
            ok: false,
            error: fieldsSaved.error,
          };
        }
        const routeKey = data.slug?.trim() || data.id;
        revalidatePath("/admin/events");
        revalidatePath(`/admin/events/${routeKey}/settings`);
        return { ok: true, eventId: data.id, routeKey };
      }

      if (error?.code === "23505") {
        candidate = `${slugBase}-${attempt + 2}`;
        lastError = error.message;
        continue;
      }

      return { ok: false, error: error?.message ?? "Falha ao criar evento." };
    }

    return {
      ok: false,
      error: lastError ?? "Não foi possível gerar um slug único para o evento.",
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao criar evento.";
    return { ok: false, error: message };
  }
}
