"use client";

import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { EsterilizacionAdminRow } from "@/features/esterilizaciones/types/esterilizacion";
import { EsterilizacionEstadoBadge } from "./EsterilizacionEstadoBadge";

type Props = {
  items: EsterilizacionAdminRow[];
  onAprobar: (item: EsterilizacionAdminRow) => void;
  onRechazar: (item: EsterilizacionAdminRow) => void;
  onProgramar: (item: EsterilizacionAdminRow) => void;
  onIniciar: (item: EsterilizacionAdminRow) => void;
  onCompletar: (item: EsterilizacionAdminRow) => void;
  onCancelar: (item: EsterilizacionAdminRow) => void;
  onVer: (item: EsterilizacionAdminRow) => void;
};

export function EsterilizacionesCardsAdmin({
  items,
  onAprobar,
  onRechazar,
  onProgramar,
  onIniciar,
  onCompletar,
  onCancelar,
  onVer,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="lg:hidden p-8 text-center text-slate-400 italic bg-white rounded-xl border border-slate-100">
        No hay esterilizaciones que mostrar.
      </div>
    );
  }

  return (
    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <header className="px-4 py-3 bg-[#FFF6E5] flex justify-between items-center">
            <span className="text-sm font-bold text-[#8B4513]">
              {item.folio}
            </span>
            <EsterilizacionEstadoBadge estado={item.estado} />
          </header>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              {item.mascota_imagen && (
                <img
                  src={item.mascota_imagen}
                  alt={item.mascota_nombre}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-bold text-slate-800">
                  {item.mascota_nombre}
                </p>
                <p className="text-xs text-slate-500">
                  {item.peso_kg ?? "—"} kg
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-700">{item.usuario_nombre}</p>
              <p className="text-xs text-slate-500">{item.usuario_correo}</p>
            </div>

            {item.fecha_programada && (
              <p className="text-xs text-slate-500">
                Programada:{" "}
                {format(
                  new Date(item.fecha_programada),
                  "EEEE d MMM, h:mm a",
                  { locale: es }
                )}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onVer(item)}
                className="p-2 text-slate-500 hover:text-[#8B4513] hover:bg-orange-50 rounded-md transition"
                title="Ver expediente"
              >
                <Eye className="w-4 h-4" />
              </button>

              {item.estado === "pendiente" && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAprobar(item)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRechazar(item)}
                  >
                    Rechazar
                  </Button>
                </>
              )}

              {item.estado === "aprobada" && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onProgramar(item)}
                >
                  Programar
                </Button>
              )}

              {item.estado === "programada" && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onIniciar(item)}
                >
                  Iniciar
                </Button>
              )}

              {item.estado === "en_quirofano" && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onCompletar(item)}
                >
                  Resultado
                </Button>
              )}

              {["aprobada", "programada", "en_quirofano"].includes(
                item.estado
              ) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCancelar(item)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
