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
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0f830f] mb-3 uppercase tracking-wider">
          Resumen rápido
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-slate-500">Solicitudes nuevas</span>
            <span className="font-bold text-yellow-700">{pendientes}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-500">Aprobadas sin agendar</span>
            <span className="font-bold text-impa-700">{aprobadas}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-500">En quirófano</span>
            <span className="font-bold text-indigo-700">{enQuirofano}</span>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0f830f] mb-3 uppercase tracking-wider">
          Próximas cirugías
        </h3>

        {proximas.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            Sin cirugías programadas próximamente.
          </p>
        ) : (
          <ul className="space-y-3">
            {proximas.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 text-sm border-l-4 border-[#17cf17] pl-3"
              >
                {p.mascota_imagen ? (
                  <img
                    src={p.mascota_imagen}
                    alt={p.mascota_nombre}
                    className="w-9 h-9 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-md bg-impa-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {p.mascota_nombre}
                  </p>
                  <p className="text-xs text-slate-500">
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
