"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { labelEstadoEsterilizacion } from "@/features/esterilizaciones/utils/formatearEstadoEsterilizacion";
import type { EstadoEsterilizacion } from "@/features/esterilizaciones/types/esterilizacion";

/**
 * Badge de estado de esterilización. Thin wrapper sobre `<StatusBadge>` que
 * preserva el API público existente (`<EsterilizacionEstadoBadge estado={...} />`)
 * y reusa la paleta semántica IMPA centralizada.
 */
export function EsterilizacionEstadoBadge({
  estado,
}: {
  estado: EstadoEsterilizacion;
}) {
  return <StatusBadge estado={estado} label={labelEstadoEsterilizacion(estado)} />;
}
