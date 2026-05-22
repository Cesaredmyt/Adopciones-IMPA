"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { EsterilizacionAdminRow } from "@/features/esterilizaciones/types/esterilizacion";

type Props = {
  items: EsterilizacionAdminRow[];
  proximas: EsterilizacionAdminRow[];
};

export function EsterilizacionesPanelLateral({ items, proximas }: Props) {
  const pendientes = items.filter((i) => i.estado === "pendiente").length;
  const aprobadas = items.filter((i) => i.estado === "aprobada").length;
  const enQuirofano = items.filter((i) => i.estado === "en_quirofano").length;

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-sm">
        <h3 className="mb-3 text-sm font-bold uppercase text-impa-text">
          Resumen rápido
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-impa-muted">Solicitudes nuevas</span>
            <span className="font-bold text-yellow-700">{pendientes}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-impa-muted">Aprobadas sin agendar</span>
            <span className="font-bold text-impa-700">{aprobadas}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-impa-muted">En quirófano</span>
            <span className="font-bold text-indigo-700">{enQuirofano}</span>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-sm">
        <h3 className="mb-3 text-sm font-bold uppercase text-impa-text">
          Próximas cirugías
        </h3>

        {proximas.length === 0 ? (
          <p className="text-sm italic text-impa-muted">
            Sin cirugías programadas próximamente.
          </p>
        ) : (
          <ul className="space-y-3">
            {proximas.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 border-l-4 border-impa-500 pl-3 text-sm"
              >
                {p.mascota_imagen ? (
                  <img
                    src={p.mascota_imagen}
                    alt={p.mascota_nombre}
                    className="h-9 w-9 rounded-md border border-impa-line object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-md bg-impa-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-impa-text">
                    {p.mascota_nombre}
                  </p>
                  <p className="text-xs text-impa-muted">
                    {p.fecha_programada
                      ? format(
                          new Date(p.fecha_programada),
                          "d MMM, h:mm a",
                          { locale: es }
                        )
                      : "Sin fecha"}
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
