"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ShieldAlert, Clock } from "lucide-react";
import type { ReporteAdminRow } from "@/features/reportes-maltrato/types/reporte";
import { ReporteGravedadBadge } from "./ReporteEstadoBadge";

type Props = {
  items: ReporteAdminRow[];
};

export function ReportesPanelLateral({ items }: Props) {
  const urgentes = items.filter(
    (i) =>
      ["urgente", "alta"].includes(i.prioridad) &&
      !["resuelto", "cerrado", "falso_positivo"].includes(i.estado)
  );

  const recientes = [...items]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const totalAbiertos = items.filter(
    (i) => !["resuelto", "cerrado", "falso_positivo"].includes(i.estado)
  ).length;

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-sm">
        <h3 className="text-xs font-bold text-impa-700 mb-3 uppercase tracking-[0.08em] flex items-center gap-2">
          <ShieldAlert size={14} />
          Casos abiertos
        </h3>
        <p className="text-3xl font-extrabold text-impa-text-strong">
          {totalAbiertos}
        </p>
        <p className="text-sm text-impa-muted">
          {urgentes.length} de alta prioridad
        </p>
      </section>

      <section className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-sm">
        <h3 className="text-xs font-bold text-impa-700 mb-3 uppercase tracking-[0.08em] flex items-center gap-2">
          <Clock size={14} />
          Reportes recientes
        </h3>

        {recientes.length === 0 ? (
          <p className="text-sm text-impa-quiet italic">Sin reportes aún.</p>
        ) : (
          <ul className="space-y-3">
            {recientes.map((r) => (
              <li
                key={r.id}
                className="flex items-start gap-3 text-sm border-l-4 border-impa-500 pl-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-impa-700 text-xs">
                      {r.folio}
                    </span>
                    <ReporteGravedadBadge gravedad={r.gravedad} />
                  </div>
                  <p className="text-impa-text text-xs truncate mt-0.5">
                    {r.asunto}
                  </p>
                  <p className="text-[11px] text-impa-quiet">
                    {format(new Date(r.created_at), "d MMM, h:mm a", {
                      locale: es,
                    })}{" "}
                    · {r.colonia}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
