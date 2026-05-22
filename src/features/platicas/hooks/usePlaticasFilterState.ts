"use client";

import { useMemo, useState } from "react";
import type { EstadoPlatica } from "@/features/platicas/types/platica";

export type FiltroPlatica = "todas" | EstadoPlatica;

export function usePlaticasFilterState() {
  const [filtro, setFiltro] = useState<FiltroPlatica>("todas");
  const [query, setQuery] = useState("");
  return useMemo(
    () => ({ filtro, setFiltro, query, setQuery }),
    [filtro, query]
  );
}
