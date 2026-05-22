"use client";

import { useMemo } from "react";
import type {
  ReporteAdminRow,
  EstadoReporte,
} from "@/features/reportes-maltrato/types/reporte";
import { PRIORIDAD_ESTADO_REPORTE } from "@/features/reportes-maltrato/utils/formatearEstadoReporte";
import type { FiltroReporte } from "./useReportesFilterState";

const PESO_PRIORIDAD: Record<string, number> = {
  urgente: 1,
  alta: 2,
  normal: 3,
  baja: 4,
};

export function useReportesOrdenados(
  items: ReporteAdminRow[],
  filtro: FiltroReporte,
  query: string
) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtrados = items.filter((it) => {
      if (filtro !== "todos" && it.estado !== (filtro as EstadoReporte))
        return false;
      if (!q) return true;
      return (
        it.folio.toLowerCase().includes(q) ||
        it.asunto.toLowerCase().includes(q) ||
        it.colonia.toLowerCase().includes(q) ||
        it.direccion_incidente.toLowerCase().includes(q) ||
        (it.nombre_reportante ?? "").toLowerCase().includes(q)
      );
    });

    return filtrados.sort((a, b) => {
      const ea = PRIORIDAD_ESTADO_REPORTE[a.estado] ?? 99;
      const eb = PRIORIDAD_ESTADO_REPORTE[b.estado] ?? 99;
      if (ea !== eb) return ea - eb;

      const pa = PESO_PRIORIDAD[a.prioridad] ?? 99;
      const pb = PESO_PRIORIDAD[b.prioridad] ?? 99;
      if (pa !== pb) return pa - pb;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [items, filtro, query]);
}
