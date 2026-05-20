"use client";

import {
  labelEstadoEsterilizacion,
  styleEstadoEsterilizacion,
} from "@/features/esterilizaciones/utils/formatearEstadoEsterilizacion";
import type { EstadoEsterilizacion } from "@/features/esterilizaciones/types/esterilizacion";

export function EsterilizacionEstadoBadge({
  estado,
}: {
  estado: EstadoEsterilizacion;
}) {
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-semibold border ${styleEstadoEsterilizacion(
        estado
      )}`}
    >
      {labelEstadoEsterilizacion(estado)}
    </span>
  );
}
