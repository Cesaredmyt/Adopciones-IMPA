"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { MapPin, Users, Calendar } from "lucide-react";

import type { PlaticaUsuarioRow } from "@/features/platicas/types/platica";
import { PlaticaEstadoBadge } from "./PlaticaEstadoBadge";
import { labelTipoLugarPlatica } from "@/features/platicas/utils/formatearEstadoPlatica";

type Props = {
  items: PlaticaUsuarioRow[];
  onCancelar: (item: PlaticaUsuarioRow) => void;
};

function fechaCorta(iso: string | null) {
  if (!iso) return "Por agendar";
  return format(new Date(iso), "d MMM yyyy", { locale: es });
}
function fechaCompleta(iso: string | null) {
  if (!iso) return "Por agendar";
  return format(new Date(iso), "EEEE d 'de' MMMM, h:mm a", { locale: es });
}

export default function PlaticasUsuarioLista({ items, onCancelar }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-impa-line rounded-2xl p-10 text-center text-impa-muted">
        <p className="font-medium">Aún no has solicitado ninguna plática.</p>
        <p className="text-sm text-impa-quiet mt-2">
          Cuando lo hagas podrás darle seguimiento desde aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-white border border-impa-line rounded-2xl shadow-impa-sm overflow-hidden"
        >
          <header className="px-4 py-3 bg-impa-surface-2 flex justify-between items-center border-b border-impa-line">
            <span className="text-sm font-bold text-impa-700">{item.folio}</span>
            <PlaticaEstadoBadge estado={item.estado} />
          </header>

          <div className="p-4 space-y-3">
            <div>
              <p className="font-bold text-impa-text">{item.nombre_solicitante}</p>
              <p className="text-xs text-impa-muted">{item.telefono_contacto}</p>
            </div>

            <div className="text-sm text-impa-muted space-y-1.5">
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
                  <span>Agendada: {fechaCompleta(item.fecha_definitiva)}</span>
                </p>
              )}
            </div>

            {item.motivo_rechazo && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-2 text-xs text-red-700">
                <strong>Motivo:</strong> {item.motivo_rechazo}
              </div>
            )}

            {["pendiente", "en_revision"].includes(item.estado) && (
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
