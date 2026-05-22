"use client";

import { useMemo } from "react";
import type {
  PlaticaAdminRow,
  EstadoPlatica,
} from "@/features/platicas/types/platica";
import { PRIORIDAD_ESTADO_PLATICA } from "@/features/platicas/utils/formatearEstadoPlatica";
import type { FiltroPlatica } from "./usePlaticasFilterState";

export function usePlaticasOrdenadas(
  items: PlaticaAdminRow[],
  filtro: FiltroPlatica,
  query: string
) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtrados = items.filter((it) => {
      if (filtro !== "todas" && it.estado !== (filtro as EstadoPlatica))
        return false;
      if (!q) return true;
      return (
        it.folio.toLowerCase().includes(q) ||
        it.nombre_solicitante.toLowerCase().includes(q) ||
        it.direccion.toLowerCase().includes(q) ||
        (it.nombre_lugar ?? "").toLowerCase().includes(q) ||
        it.usuario_nombre.toLowerCase().includes(q)
      );
    });

    return filtrados.sort((a, b) => {
      const pa = PRIORIDAD_ESTADO_PLATICA[a.estado] ?? 99;
      const pb = PRIORIDAD_ESTADO_PLATICA[b.estado] ?? 99;
      if (pa !== pb) return pa - pb;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [items, filtro, query]);
}
