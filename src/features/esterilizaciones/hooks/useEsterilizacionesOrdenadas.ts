"use client";

import { useMemo } from "react";
import type {
  EsterilizacionAdminRow,
  EstadoEsterilizacion,
} from "@/features/esterilizaciones/types/esterilizacion";
import { PRIORIDAD_ESTADO_ESTERILIZACION } from "@/features/esterilizaciones/utils/formatearEstadoEsterilizacion";
import type { FiltroEsterilizacion } from "./useEsterilizacionesFilterState";

export function useEsterilizacionesOrdenadas(
  items: EsterilizacionAdminRow[],
  filtro: FiltroEsterilizacion,
  query: string
) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtrados = items.filter((it) => {
      if (filtro !== "todas" && it.estado !== (filtro as EstadoEsterilizacion))
        return false;
      if (!q) return true;
      return (
        it.folio.toLowerCase().includes(q) ||
        it.mascota_nombre.toLowerCase().includes(q) ||
        it.usuario_nombre.toLowerCase().includes(q)
      );
    });

    return filtrados.sort((a, b) => {
      const pa = PRIORIDAD_ESTADO_ESTERILIZACION[a.estado] ?? 99;
      const pb = PRIORIDAD_ESTADO_ESTERILIZACION[b.estado] ?? 99;
      if (pa !== pb) return pa - pb;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [items, filtro, query]);
}
