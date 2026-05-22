"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Megaphone } from "lucide-react";
import type { PlaticaAdminRow } from "@/features/platicas/types/platica";

type Props = {
  items: PlaticaAdminRow[];
  proximas: PlaticaAdminRow[];
};

export function PlaticasPanelLateral({ items, proximas }: Props) {
  const pendientes = items.filter((i) => i.estado === "pendiente").length;
  const enRevision = items.filter((i) => i.estado === "en_revision").length;
  const aprobadas = items.filter((i) => i.estado === "aprobada").length;

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-sm">
        <h3 className="text-xs font-bold text-impa-700 mb-3 uppercase tracking-[0.08em] flex items-center gap-2">
          <Megaphone size={14} />
          Resumen rápido
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-impa-muted">Solicitudes nuevas</span>
            <span className="font-bold text-yellow-700">{pendientes}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-impa-muted">En revisión</span>
            <span className="font-bold text-blue-700">{enRevision}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-impa-muted">Aprobadas</span>
            <span className="font-bold text-impa-700">{aprobadas}</span>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-sm">
        <h3 className="text-xs font-bold text-impa-700 mb-3 uppercase tracking-[0.08em] flex items-center gap-2">
          <Calendar size={14} />
          Próximas pláticas
        </h3>

        {proximas.length === 0 ? (
          <p className="text-sm text-impa-quiet italic">
            Sin pláticas agendadas próximamente.
          </p>
        ) : (
          <ul className="space-y-3">
            {proximas.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-3 text-sm border-l-4 border-impa-500 pl-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-impa-text truncate">
                    {p.nombre_lugar ?? p.nombre_solicitante}
                  </p>
                  <p className="text-xs text-impa-muted">
                    {p.fecha_definitiva
                      ? format(
                          new Date(p.fecha_definitiva),
                          "d MMM, h:mm a",
                          { locale: es }
                        )
                      : "Sin fecha"}
                  </p>
                  <p className="text-[11px] text-impa-quiet truncate">
                    {p.direccion}
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
