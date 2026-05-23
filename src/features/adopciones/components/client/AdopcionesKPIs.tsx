"use client";

import { cn } from "@/lib/utils";

type EstadoFiltro = "todas" | "pendiente" | "aprobada" | "rechazada";

type ChipPalette = {
  /** Estado de reposo. */
  rest: string;
  /** Estado activo (seleccionado). */
  active: string;
  /** Color del dot (bg-*). */
  dot: string;
};

const palette: Record<Exclude<EstadoFiltro, "todas">, ChipPalette> = {
  pendiente: {
    rest:   "bg-impa-warning-soft text-impa-warning-ink border-amber-200 hover:bg-amber-100",
    active: "bg-amber-100 text-impa-warning-ink border-amber-300 shadow-impa-xs scale-[1.03]",
    dot:    "bg-impa-warning",
  },
  aprobada: {
    rest:   "bg-impa-success-soft text-impa-success-ink border-emerald-200 hover:bg-emerald-100",
    active: "bg-emerald-100 text-impa-success-ink border-emerald-300 shadow-impa-xs scale-[1.03]",
    dot:    "bg-impa-success",
  },
  rechazada: {
    rest:   "bg-impa-danger-soft text-impa-danger-ink border-red-200 hover:bg-red-100",
    active: "bg-red-100 text-impa-danger-ink border-red-300 shadow-impa-xs scale-[1.03]",
    dot:    "bg-impa-danger",
  },
};

AdopcionesKPIs.Skeleton = function KPIsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="px-3 py-1.5 rounded-full border border-impa-line bg-white w-[140px] shadow-impa-xs"
        >
          <div className="h-3 w-20 bg-impa-surface-3 rounded impa-shimmer" />
        </div>
      ))}
    </div>
  );
};

export function AdopcionesKPIs({
  totales,
  filtroEstado,
  onChange,
}: {
  totales: {
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
  };
  filtroEstado: EstadoFiltro;
  onChange: (estado: EstadoFiltro) => void;
}) {
  const chips: Array<{
    estado: Exclude<EstadoFiltro, "todas">;
    label: string;
    count: number;
  }> = [
    { estado: "pendiente", label: "Pendientes", count: totales.pendientes },
    { estado: "aprobada",  label: "Aprobadas",  count: totales.aprobadas  },
    { estado: "rechazada", label: "Rechazadas", count: totales.rechazadas },
  ];

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {chips.map((c) => {
        const isActive = filtroEstado === c.estado;
        const p = palette[c.estado];
        return (
          <button
            key={c.estado}
            type="button"
            onClick={() => onChange(c.estado)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer",
              "transition-all duration-200 ease-impa-out hover:-translate-y-px",
              isActive ? p.active : p.rest
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />
            {c.label}: {c.count}
          </button>
        );
      })}

      {filtroEstado !== "todas" && (
        <button
          type="button"
          onClick={() => onChange("todas")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-impa-line text-xs font-semibold bg-white text-impa-muted hover:bg-impa-surface-2 hover:text-impa-text transition-colors duration-150 cursor-pointer"
        >
          Mostrar todas
        </button>
      )}
    </div>
  );
}
