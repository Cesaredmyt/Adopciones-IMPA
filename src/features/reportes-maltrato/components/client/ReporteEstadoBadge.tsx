"use client";

import {
  labelEstadoReporte,
  styleEstadoReporte,
  labelGravedadReporte,
  styleGravedadReporte,
  labelPrioridadReporte,
  stylePrioridadReporte,
} from "@/features/reportes-maltrato/utils/formatearEstadoReporte";
import type {
  EstadoReporte,
  GravedadReporte,
  PrioridadReporte,
} from "@/features/reportes-maltrato/types/reporte";

export function ReporteEstadoBadge({ estado }: { estado: EstadoReporte }) {
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-semibold border ${styleEstadoReporte(
        estado
      )}`}
    >
      {labelEstadoReporte(estado)}
    </span>
  );
}

export function ReporteGravedadBadge({
  gravedad,
}: {
  gravedad: GravedadReporte;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${styleGravedadReporte(
        gravedad
      )}`}
    >
      {labelGravedadReporte(gravedad)}
    </span>
  );
}

export function ReportePrioridadBadge({
  prioridad,
}: {
  prioridad: PrioridadReporte;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${stylePrioridadReporte(
        prioridad
      )}`}
    >
      {labelPrioridadReporte(prioridad)}
    </span>
  );
}
