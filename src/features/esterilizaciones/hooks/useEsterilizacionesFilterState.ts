"use client";

import { useMemo, useState } from "react";
import type { EstadoEsterilizacion } from "@/features/esterilizaciones/types/esterilizacion";

export type FiltroEsterilizacion = "todas" | EstadoEsterilizacion;

export function useEsterilizacionesFilterState() {
  const [filtro, setFiltro] = useState<FiltroEsterilizacion>("todas");
  const [query, setQuery] = useState("");
  return useMemo(() => ({ filtro, setFiltro, query, setQuery }), [filtro, query]);
}
