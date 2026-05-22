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
      <div className="lg:hidden rounded-2xl border border-impa-line bg-white p-8 text-center text-sm text-impa-muted shadow-impa-sm">
        No hay esterilizaciones que mostrar.
      </div>
    );
  }

  return (
    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-white rounded-2xl border border-impa-line shadow-impa-sm overflow-hidden transition-[box-shadow,border-color,transform] duration-200 ease-impa-out hover:-translate-y-0.5 hover:shadow-impa-md hover:border-impa-line-strong"
        >
          <header className="px-4 py-3 bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line flex justify-between items-center gap-3">
            <span className="text-sm font-bold text-impa-700">
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
                  className="w-12 h-12 rounded-xl object-cover border border-impa-line shadow-impa-xs"
                />
              )}
              <div className="min-w-0">
                <p className="font-bold text-impa-text truncate">
                  {item.mascota_nombre}
                </p>
                <p className="text-xs text-impa-muted">
                  {item.peso_kg ?? "—"} kg
                </p>
              </div>
            </div>

            <div className="text-sm text-impa-muted">
              <p className="font-medium text-impa-text">{item.usuario_nombre}</p>
              <p className="text-xs text-impa-muted break-all">{item.usuario_correo}</p>
            </div>

            {item.fecha_programada && (
              <p className="text-xs text-impa-muted">
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
                className="grid place-items-center h-8 w-8 rounded-lg border border-impa-line bg-white text-impa-muted shadow-impa-xs hover:text-impa-700 hover:bg-impa-50 hover:border-impa-300 transition-colors cursor-pointer"
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
                    variant="outline"
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
                  variant="outline"
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
