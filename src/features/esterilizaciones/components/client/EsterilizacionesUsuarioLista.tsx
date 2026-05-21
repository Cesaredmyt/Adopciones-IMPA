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
      <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-500">
        <p className="font-medium">
          Aún no has solicitado ninguna esterilización.
        </p>
        <p className="text-sm text-slate-400 mt-2">
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
          className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <header className="px-4 py-3 bg-[#FFF6E5] flex justify-between items-center">
            <span className="text-sm font-bold text-[#0f830f]">
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
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-impa-100" />
              )}
              <div>
                <p className="font-bold text-slate-800">
                  {item.mascota_nombre}
                </p>
                <p className="text-xs text-slate-500">
                  Peso registrado: {item.peso_kg ?? "—"} kg
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-600 space-y-1">
              <p>
                <span className="text-xs font-bold uppercase text-[#0f830f]">
                  Solicitada:
                </span>{" "}
                {formatoFecha(item.fecha_solicitud)}
              </p>
              <p>
                <span className="text-xs font-bold uppercase text-[#0f830f]">
                  Programada:
                </span>{" "}
                {formatoFecha(item.fecha_programada)}
              </p>
              {item.fecha_realizada && (
                <p>
                  <span className="text-xs font-bold uppercase text-[#0f830f]">
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
