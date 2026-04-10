import type { Database } from "@/lib/supabase/types";
import type { TvWallDeskTileModel, TvDeskTileStatus } from "@/lib/display/tv-wall-types";
import { formatDisplayTitleCase } from "@/lib/format-display-text";

export type TvDeskTileRow = Database["public"]["Views"]["tv_desk_tiles"]["Row"];

function formatKitStatusLabel(
  status: Database["public"]["Views"]["tv_desk_tiles"]["Row"]["kit_status"],
): string {
  if (!status) return "—";
  if (status === "delivered") return "Entregue";
  if (status === "at_desk") return "No guichê — confira na tela";
  return "Retirada pendente";
}

function tvTitle(s: string): string {
  const t = s.trim();
  if (!t || t === "—") return t || "—";
  return formatDisplayTitleCase(t);
}

export function mapTvDeskTileRow(row: TvDeskTileRow): TvWallDeskTileModel {
  const hasRegistration =
    row.registration_id != null &&
    row.full_name != null &&
    row.bib_number != null;

  if (!hasRegistration) {
    return {
      deskId: row.desk_id,
      deskLabel: row.desk_label,
      status: "idle",
      showCheck: false,
      participant: null,
    };
  }

  let status: TvDeskTileStatus = "processing";
  let showCheck = true;
  if (
    row.display_variant === "success" ||
    row.kit_status === "delivered"
  ) {
    status = "success";
  }

  return {
    deskId: row.desk_id,
    deskLabel: row.desk_label,
    status,
    showCheck,
    participant: {
      bibRaw: row.bib_number ?? "",
      name: tvTitle(row.full_name ?? ""),
      race: row.race_name ?? "—",
      sex: tvTitle(row.participant_sex?.trim() || "—"),
      ageGroup: tvTitle(row.age_group?.trim() || "—"),
      kitStatus: formatKitStatusLabel(row.kit_status),
    },
  };
}
