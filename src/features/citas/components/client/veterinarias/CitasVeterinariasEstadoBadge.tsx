"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * Badge de estado para citas veterinarias. Thin wrapper sobre `<StatusBadge>`.
 * Mantiene la firma legacy (`<CitasVeterinariasEstadoBadge estado="aprobada" />`).
 */
export function CitasVeterinariasEstadoBadge({ estado }: { estado: string }) {
  return <StatusBadge estado={estado} />;
}
