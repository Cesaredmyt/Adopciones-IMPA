"use client";

import CalendarioVeterinarias from "@/features/citas/components/client/CalendarioVeterinarias";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, CalendarClock } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Panel lateral del módulo de Citas Veterinarias (admin).
 *
 * Diseño inspirado en el screen "IMPA Veterinary Management" de Stitch:
 * columna derecha con calendario compacto + lista de próximas citas
 * (hora, mascota, veterinario, badge de estado).
 */
export function CitasVeterinariasPanelLateral({
  citas,
  proximas,
}: {
  citas: any[];
  proximas: any[];
}) {
  return (
    <div className="flex flex-col gap-4 self-start">
      {/* Calendario */}
      <section className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-impa-line bg-gradient-to-b from-impa-surface-2/80 to-impa-surface-2/30">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-impa-50 border border-impa-200 text-impa-600">
            <CalendarDays size={14} />
          </span>
          <h2 className="text-sm font-bold tracking-tight text-impa-text-strong">
            Calendario de citas
          </h2>
        </header>
        <div className="p-4">
          <CalendarioVeterinarias citas={citas} vistaCompacta />
        </div>
      </section>

      {/* Próximas citas */}
      <section className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-impa-line bg-gradient-to-b from-impa-surface-2/80 to-impa-surface-2/30">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-impa-50 border border-impa-200 text-impa-600">
            <CalendarClock size={14} />
          </span>
          <h2 className="text-sm font-bold tracking-tight text-impa-text-strong">
            Próximas citas
          </h2>
        </header>

        <div className="p-4">
          {proximas.length === 0 ? (
            <EmptyState
              variant="minimal"
              icon={<CalendarClock size={20} />}
              title="No hay próximas citas"
              description="Las citas programadas aparecerán aquí."
            />
          ) : (
            <ul className="divide-y divide-impa-line-faint">
              {proximas.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-impa-text leading-tight truncate">
                      {c.mascota_nombre}
                    </p>
                    <p className="text-xs text-impa-muted mt-0.5 leading-tight">
                      {format(new Date(c.fecha_cita), "EEEE d 'de' MMMM, h:mm a", {
                        locale: es,
                      })}
                    </p>
                  </div>

                  <StatusBadge estado={c.estado} size="xs" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
