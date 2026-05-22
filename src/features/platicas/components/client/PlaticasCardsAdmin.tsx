"use client";

import { Button } from "@/components/ui/Button";
import { Eye, MapPin, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { PlaticaAdminRow } from "@/features/platicas/types/platica";
import { PlaticaEstadoBadge } from "./PlaticaEstadoBadge";
import { labelTipoLugarPlatica } from "@/features/platicas/utils/formatearEstadoPlatica";

type Props = {
  items: PlaticaAdminRow[];
  onVer: (item: PlaticaAdminRow) => void;
  onMarcarRevision: (item: PlaticaAdminRow) => void;
  onAgendar: (item: PlaticaAdminRow) => void;
  onRechazar: (item: PlaticaAdminRow) => void;
  onFinalizar: (item: PlaticaAdminRow) => void;
  onCancelar: (item: PlaticaAdminRow) => void;
};

function fechaCorta(iso: string) {
  return format(new Date(iso), "d MMM yyyy", { locale: es });
}

export function PlaticasCardsAdmin({
  items,
  onVer,
  onMarcarRevision,
  onAgendar,
  onRechazar,
  onFinalizar,
  onCancelar,
}: Props) {
  return (
    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-white border border-impa-line rounded-2xl shadow-impa-sm overflow-hidden"
        >
          <header className="px-4 py-3 bg-impa-surface-2 flex items-center justify-between border-b border-impa-line">
            <span className="font-bold text-impa-700 text-sm">{item.folio}</span>
            <PlaticaEstadoBadge estado={item.estado} />
          </header>

          <div className="p-4 space-y-3 text-sm">
            <div>
              <p className="font-semibold text-impa-text">
                {item.nombre_solicitante}
              </p>
              <p className="text-xs text-impa-muted">{item.telefono_contacto}</p>
            </div>

            <div className="space-y-1.5 text-impa-muted">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-impa-600 shrink-0" />
                <span className="truncate">
                  {labelTipoLugarPlatica(item.tipo_lugar)}
                  {item.nombre_lugar ? ` · ${item.nombre_lugar}` : ""}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Users size={14} className="text-impa-600 shrink-0" />
                <span>{item.numero_personas} personas aprox.</span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar size={14} className="text-impa-600 shrink-0" />
                <span>Tentativa: {fechaCorta(item.fecha_tentativa)}</span>
              </p>
              {item.fecha_definitiva && (
                <p className="flex items-center gap-2 text-impa-700 font-medium">
                  <Calendar size={14} className="shrink-0" />
                  <span>Agendada: {fechaCorta(item.fecha_definitiva)}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                onClick={() => onVer(item)}
                className="grid place-items-center w-8 h-8 rounded-lg border border-impa-line bg-white text-impa-muted hover:text-impa-700 hover:bg-impa-50 hover:border-impa-300 transition-colors duration-150 cursor-pointer"
                title="Ver expediente"
              >
                <Eye className="w-4 h-4" />
              </button>

              {item.estado === "pendiente" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarcarRevision(item)}
                  >
                    Revisar
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAgendar(item)}
                  >
                    Aprobar
                  </Button>
                </>
              )}

              {item.estado === "en_revision" && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAgendar(item)}
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
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onFinalizar(item)}
                  >
                    Finalizar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCancelar(item)}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </article>
      ))}

      {items.length === 0 && (
        <div className="col-span-full bg-white border border-impa-line rounded-2xl p-10 text-center text-impa-quiet italic">
          No hay solicitudes que mostrar.
        </div>
      )}
    </div>
  );
}
