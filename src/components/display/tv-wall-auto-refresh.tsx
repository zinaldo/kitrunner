"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type TvWallAutoRefreshProps = {
  /** When false, no polling (e.g. event not found). */
  enabled?: boolean;
  /** How often to refetch server-rendered tiles (ms). */
  intervalMs?: number;
};

/**
 * Periodically calls Next.js router.refresh() so the TV wall Server Component
 * reloads tiles from Supabase without a full page reload.
 */
export function TvWallAutoRefresh({
  enabled = true,
  intervalMs = 4000,
}: TvWallAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled || intervalMs < 1000) return;

    const id = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(id);
  }, [enabled, intervalMs, router]);

  return null;
}
