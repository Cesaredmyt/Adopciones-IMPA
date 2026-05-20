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
      <span className="px-2 py-1 text-sm rounded-md border bg-yellow-50 text-yellow-700">
        Pendientes: {totales.pendientes}
      </span>
      <span className="px-2 py-1 text-sm rounded-md border bg-blue-50 text-blue-700">
        Programadas: {totales.programadas}
      </span>
      <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700">
        Completadas: {totales.completadas}
      </span>
      <span className="px-2 py-1 text-sm rounded-md border bg-slate-50 text-slate-700">
        Canceladas: {totales.canceladas}
      </span>
    </div>
  );
}
