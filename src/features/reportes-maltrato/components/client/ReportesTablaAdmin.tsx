"use client";

import { Eye, MapPin, ShieldAlert } from "lucide-react";
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

function fechaCorta(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy", { locale: es });
}

export function ReportesTablaAdmin({ items, onVer }: Props) {
  return (
    <div className="hidden lg:flex justify-center w-full">
      <div className="bg-white rounded-2xl border border-impa-line shadow-impa-sm overflow-hidden w-full max-w-[1200px]">
        <div className="w-full overflow-x-auto custom-scroll">
          <table className="w-full text-sm text-left text-impa-text">
            <thead className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line">
              <tr>
                <th className="px-4 py-3 w-[10%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Folio
                </th>
                <th className="px-4 py-3 w-[22%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Asunto
                </th>
                <th className="px-4 py-3 w-[22%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Ubicación
                </th>
                <th className="px-4 py-3 w-[12%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Gravedad
                </th>
                <th className="px-4 py-3 w-[12%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Prioridad
                </th>
                <th className="px-4 py-3 w-[12%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Estado
                </th>
                <th className="px-4 py-3 text-center w-[10%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-impa-line-faint">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="group bg-white hover:bg-impa-tinted/60 transition-colors duration-150"
                >
                  <td className="px-4 py-3 font-bold text-impa-700 align-top">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={14} className="text-impa-600" />
                      {item.folio}
                    </div>
                    <p className="text-[11px] text-impa-quiet mt-1">
                      {fechaCorta(item.created_at)}
                    </p>
                  </td>

                  <td className="px-4 py-3 max-w-[260px] align-top">
                    <p className="font-medium text-impa-text leading-tight line-clamp-2">
                      {item.asunto}
                    </p>
                    {item.es_anonimo ? (
                      <p className="text-[11px] text-impa-quiet mt-1 italic">
                        Reporte anónimo
                      </p>
                    ) : (
                      <p className="text-[11px] text-impa-muted mt-1 truncate">
                        {item.nombre_reportante ?? "—"}
                      </p>
                    )}
                    {item.evidencias_urls.length > 0 && (
                      <span className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-impa-50 text-impa-700 border border-impa-100">
                        {item.evidencias_urls.length} evidencia
                        {item.evidencias_urls.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 align-top">
                    <p className="text-impa-text font-medium leading-tight flex items-center gap-1.5">
                      <MapPin size={12} className="text-impa-600 shrink-0" />
                      {item.colonia}
                    </p>
                    <p className="text-xs text-impa-muted line-clamp-2">
                      {item.direccion_incidente}
                    </p>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <ReporteGravedadBadge gravedad={item.gravedad} />
                  </td>

                  <td className="px-4 py-3 align-top">
                    <ReportePrioridadBadge prioridad={item.prioridad} />
                    {item.asignado_nombre && (
                      <p className="text-[11px] text-impa-muted mt-1">
                        → {item.asignado_nombre}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3 align-top">
                    <ReporteEstadoBadge estado={item.estado} />
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onVer(item)}
                        className="grid place-items-center w-8 h-8 rounded-lg border border-impa-line bg-white text-impa-muted hover:text-impa-700 hover:bg-impa-50 hover:border-impa-300 transition-colors duration-150 cursor-pointer"
                        title="Ver expediente"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-impa-quiet italic"
                  >
                    No hay reportes que mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
