"use client";

import {
  labelEstadoPlatica,
  styleEstadoPlatica,
} from "@/features/platicas/utils/formatearEstadoPlatica";
import type { EstadoPlatica } from "@/features/platicas/types/platica";

export function PlaticaEstadoBadge({ estado }: { estado: EstadoPlatica }) {
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-semibold border ${styleEstadoPlatica(
        estado
      )}`}
    >
      {labelEstadoPlatica(estado)}
    </span>
  );
}
