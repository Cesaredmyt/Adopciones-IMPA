"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";

import type { EsterilizacionUsuarioRow } from "@/features/esterilizaciones/types/esterilizacion";
import { EsterilizacionEstadoBadge } from "./EsterilizacionEstadoBadge";

type Props = {
  items: EsterilizacionUsuarioRow[];
  onCancelar: (item: EsterilizacionUsuarioRow) => void;
};

function formatoFecha(iso: string | null) {
  if (!iso) return "Por programar";
  return format(new Date(iso), "EEEE d 'de' MMMM, h:mm a", { locale: es });
}

export default function EsterilizacionesUsuarioLista({
  items,
  onCancelar,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-impa-line bg-impa-tinted p-10 text-center text-impa-muted">
        <p className="font-medium">
          Aún no has solicitado ninguna esterilización.
        </p>
        <p className="mt-2 text-sm text-impa-muted">
          Cuando lo hagas, podrás darle seguimiento desde aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm transition hover:border-impa-200 hover:shadow-impa-md"
        >
          <header className="flex items-center justify-between border-b border-impa-line bg-impa-tinted px-4 py-3">
            <span className="text-sm font-bold text-impa-700">
              {item.folio}
            </span>
            <EsterilizacionEstadoBadge estado={item.estado} />
          </header>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              {item.mascota_imagen ? (
                <img
                  src={item.mascota_imagen}
                  alt={item.mascota_nombre}
                  className="h-14 w-14 rounded-xl border border-impa-line object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl border border-impa-line bg-impa-50" />
              )}
              <div>
                <p className="font-bold text-impa-text">
                  {item.mascota_nombre}
                </p>
                <p className="text-xs text-impa-muted">
                  Peso registrado: {item.peso_kg ?? "—"} kg
                </p>
              </div>
            </div>

            <div className="space-y-1 text-sm text-impa-muted">
              <p>
                <span className="text-xs font-bold uppercase text-impa-700">
                  Solicitada:
                </span>{" "}
                {formatoFecha(item.fecha_solicitud)}
              </p>
              <p>
                <span className="text-xs font-bold uppercase text-impa-700">
                  Programada:
                </span>{" "}
                {formatoFecha(item.fecha_programada)}
              </p>
              {item.fecha_realizada && (
                <p>
                  <span className="text-xs font-bold uppercase text-impa-700">
                    Realizada:
                  </span>{" "}
                  {formatoFecha(item.fecha_realizada)}
                </p>
              )}
            </div>

            {item.motivo_cancelacion && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-2 text-xs text-red-700">
                <strong>Motivo:</strong> {item.motivo_cancelacion}
              </div>
            )}

            {["pendiente", "aprobada"].includes(item.estado) && (
              <div className="pt-1 flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCancelar(item)}
                >
                  Cancelar solicitud
                </Button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
