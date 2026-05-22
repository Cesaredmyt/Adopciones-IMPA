"use client";

import { Eye, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { ReporteAdminRow } from "@/features/reportes-maltrato/types/reporte";
import {
  ReporteEstadoBadge,
  ReporteGravedadBadge,
  ReportePrioridadBadge,
} from "./ReporteEstadoBadge";

type Props = {
  items: ReporteAdminRow[];
  onVer: (item: ReporteAdminRow) => void;
};

export function ReportesCardsAdmin({ items, onVer }: Props) {
  return (
    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-white border border-impa-line rounded-2xl shadow-impa-sm overflow-hidden"
        >
          <header className="px-4 py-3 bg-impa-surface-2 flex items-center justify-between border-b border-impa-line">
            <div className="flex items-center gap-2">
              <span className="font-bold text-impa-700 text-sm">{item.folio}</span>
              <ReporteGravedadBadge gravedad={item.gravedad} />
            </div>
            <ReporteEstadoBadge estado={item.estado} />
          </header>

          <div className="p-4 space-y-3 text-sm">
            <div>
              <p className="font-semibold text-impa-text line-clamp-2">
                {item.asunto}
              </p>
              <p className="text-xs text-impa-quiet mt-1">
                {format(new Date(item.created_at), "d MMM yyyy", { locale: es })}
                {item.es_anonimo ? " · Reporte anónimo" : ""}
              </p>
            </div>

            <p className="flex items-start gap-1.5 text-impa-muted">
              <MapPin size={14} className="text-impa-600 shrink-0 mt-0.5" />
              <span className="text-xs leading-snug">
                <strong className="text-impa-text">{item.colonia}</strong>
                <br />
                {item.direccion_incidente}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <ReportePrioridadBadge prioridad={item.prioridad} />
              {item.evidencias_urls.length > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-impa-50 text-impa-700 border border-impa-100">
                  {item.evidencias_urls.length} foto
                  {item.evidencias_urls.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onVer(item)}
                className="grid place-items-center w-8 h-8 rounded-lg border border-impa-line bg-white text-impa-muted hover:text-impa-700 hover:bg-impa-50 hover:border-impa-300 transition-colors duration-150 cursor-pointer"
                title="Ver expediente"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      ))}

      {items.length === 0 && (
        <div className="col-span-full bg-white border border-impa-line rounded-2xl p-10 text-center text-impa-quiet italic">
          No hay reportes que mostrar.
        </div>
      )}
    </div>
  );
}
