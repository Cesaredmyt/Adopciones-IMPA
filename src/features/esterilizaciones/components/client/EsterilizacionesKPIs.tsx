"use client";

export function EsterilizacionesKPIs({
  totales,
}: {
  totales: {
    pendientes: number;
    programadas: number;
    completadas: number;
    canceladas: number;
  };
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
        Pendientes: {totales.pendientes}
      </span>
      <span className="rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-1 text-sm font-semibold text-sky-700">
        Programadas: {totales.programadas}
      </span>
      <span className="rounded-xl border border-impa-200 bg-impa-50 px-2.5 py-1 text-sm font-semibold text-impa-700">
        Completadas: {totales.completadas}
      </span>
      <span className="rounded-xl border border-impa-line bg-impa-bg-elevated px-2.5 py-1 text-sm font-semibold text-impa-muted">
        Canceladas: {totales.canceladas}
      </span>
    </div>
  );
}
