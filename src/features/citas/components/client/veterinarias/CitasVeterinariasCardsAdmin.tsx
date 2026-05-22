"use client";

import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CitasVeterinariasEstadoBadge } from "./CitasVeterinariasEstadoBadge";

export function CitasVeterinariasCardsAdmin({
  citas,
  onAprobar,
  onCancelar,
}: {
  citas: any[];
  onAprobar: (c: any) => void;
  onCancelar: (c: any) => void;
}) {
  return (
    <div className="lg:hidden space-y-4">
      {citas.map((c) => (
        <div
          key={c.id}
          className="bg-white rounded-2xl border border-impa-line p-4 shadow-impa-sm space-y-3 transition-[box-shadow,border-color,transform] duration-200 ease-impa-out hover:-translate-y-0.5 hover:shadow-impa-md hover:border-impa-line-strong"
        >
          <div className="flex justify-between gap-3">
            <h3 className="font-bold text-impa-text truncate">{c.mascota_nombre}</h3>
            <CitasVeterinariasEstadoBadge estado={c.estado} />
          </div>

          <div className="flex items-center gap-3">
            {c.mascota_imagen && (
              <img
                src={c.mascota_imagen}
                alt={c.mascota_nombre}
                className="w-12 h-12 rounded-xl object-cover border border-impa-line shadow-impa-xs"
              />
            )}
            <div className="text-sm min-w-0">
              <p className="font-semibold text-impa-text truncate">{c.adoptante_nombre}</p>
              <p className="text-xs text-impa-muted">
                {format(new Date(c.fecha_cita), "EEEE d 'de' MMMM, h:mm a", { locale: es })}
              </p>
            </div>
          </div>

          <p className="text-sm text-impa-muted">
            <b className="text-impa-text">Motivo:</b> {c.motivo}
          </p>

          {c.estado === "pendiente" && (
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="primary" onClick={() => onAprobar(c)} className="flex-1">
                Aprobar
              </Button>

              <Button size="sm" variant="outline" onClick={() => onCancelar(c)} className="flex-1">
                Cancelar
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
