"use client";

import CalendarioVeterinarias from "@/features/citas/components/client/CalendarioVeterinarias";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function CitasVeterinariasPanelLateral({
  citas,
  proximas,
}: {
  citas: any[];
  proximas: any[];
}) {
  return (
    <div className="flex flex-col gap-4 self-start">
      <div className="rounded-2xl border border-impa-line bg-white p-4 shadow-impa-sm">
        <h2 className="mb-3 text-lg font-semibold text-impa-text">
          Calendario de citas
        </h2>
        <CalendarioVeterinarias citas={citas} vistaCompacta />
      </div>

      <div className="rounded-2xl border border-impa-line bg-white p-4 shadow-impa-sm">
        <h2 className="mb-3 text-lg font-semibold text-impa-text">
          Próximas citas
        </h2>

        {proximas.length === 0 ? (
          <p className="rounded-xl border border-dashed border-impa-line bg-impa-tinted px-4 py-5 text-center text-sm text-impa-muted">No hay próximas citas.</p>
        ) : (
          <ul className="divide-y divide-impa-line">
            {proximas.map((c) => (
              <li key={c.id} className="flex justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-impa-text">{c.mascota_nombre}</p>
                  <p className="text-sm text-impa-muted">
                    {format(new Date(c.fecha_cita), "EEEE d 'de' MMMM, h:mm a", {
                      locale: es,
                    })}
                  </p>
                </div>

                <span className="h-fit rounded-full border border-impa-200 bg-impa-50 px-2.5 py-1 text-xs font-semibold text-impa-700">
                  {c.estado}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
