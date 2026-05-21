"use client";

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
  filtroEstado: "todas" | "pendiente" | "aprobada" | "rechazada";
  onChange: (estado: "todas" | "pendiente" | "aprobada" | "rechazada") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {/* Pendientes */}
      <button
        onClick={() => onChange("pendiente")}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer
          ${filtroEstado === "pendiente"
            ? "bg-amber-100 text-amber-800 border-amber-300 shadow-impa-xs scale-[1.03]"
            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:-translate-y-px"
          }
        `}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Pendientes: {totales.pendientes}
      </button>

      {/* Aprobadas */}
      <button
        onClick={() => onChange("aprobada")}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer
          ${filtroEstado === "aprobada"
            ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-impa-xs scale-[1.03]"
            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:-translate-y-px"
          }
        `}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Aprobadas: {totales.aprobadas}
      </button>

      {/* Rechazadas */}
      <button
        onClick={() => onChange("rechazada")}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer
          ${filtroEstado === "rechazada"
            ? "bg-red-100 text-red-800 border-red-300 shadow-impa-xs scale-[1.03]"
            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:-translate-y-px"
          }
        `}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Rechazadas: {totales.rechazadas}
      </button>

      {/* Mostrar todas */}
      {filtroEstado !== "todas" && (
        <button
          onClick={() => onChange("todas")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-impa-line text-xs font-semibold bg-white text-impa-muted hover:bg-impa-surface-2 hover:text-impa-text transition-colors duration-150 cursor-pointer"
        >
          Mostrar todas
        </button>
      )}
    </div>
  );
}
