"use client";

import { useMemo, useState } from "react";
import type { EstadoReporte } from "@/features/reportes-maltrato/types/reporte";

export type FiltroReporte = "todos" | EstadoReporte;

export function useReportesFilterState() {
  const [filtro, setFiltro] = useState<FiltroReporte>("todos");
  const [query, setQuery] = useState("");
  return useMemo(
    () => ({ filtro, setFiltro, query, setQuery }),
    [filtro, query]
  );
}
