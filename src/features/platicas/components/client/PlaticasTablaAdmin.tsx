"use client";

import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
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

function fechaCorta(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy, h:mm a", { locale: es });
}

function fechaSolo(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy", { locale: es });
}

export function PlaticasTablaAdmin({
  items,
  onVer,
  onMarcarRevision,
  onAgendar,
  onRechazar,
  onFinalizar,
  onCancelar,
}: Props) {
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
                <th className="px-4 py-3 w-[20%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Solicitante
                </th>
                <th className="px-4 py-3 w-[18%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Lugar
                </th>
                <th className="px-4 py-3 w-[14%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Fecha tentativa
                </th>
                <th className="px-4 py-3 w-[10%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Personas
                </th>
                <th className="px-4 py-3 w-[12%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                  Estado
                </th>
                <th className="px-4 py-3 text-center w-[16%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
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
                  <td className="px-4 py-3 font-bold text-impa-700">
                    {item.folio}
                  </td>

                  <td className="px-4 py-3 break-words max-w-[220px]">
                    <p className="font-medium text-impa-text leading-tight group-hover:text-impa-700 transition-colors duration-150">
                      {item.nombre_solicitante}
                    </p>
                    <p className="text-xs text-impa-muted mt-0.5">
                      {item.telefono_contacto}
                    </p>
                    <p className="text-[11px] text-impa-quiet mt-0.5">
                      {item.usuario_correo}
                    </p>
                  </td>

                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-impa-text font-medium leading-tight">
                      {labelTipoLugarPlatica(item.tipo_lugar)}
                    </p>
                    {item.nombre_lugar && (
                      <p className="text-xs text-impa-muted truncate">
                        {item.nombre_lugar}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3 text-impa-muted">
                    <div className="text-sm">{fechaSolo(item.fecha_tentativa)}</div>
                    {item.fecha_definitiva && (
                      <div className="text-[11px] text-impa-700 font-medium">
                        Agendada: {fechaCorta(item.fecha_definitiva)}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 text-impa-text font-semibold">
                    {item.numero_personas}
                  </td>

                  <td className="px-4 py-3">
                    <PlaticaEstadoBadge estado={item.estado} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center flex-wrap gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity duration-150">
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
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-impa-quiet italic"
                  >
                    No hay solicitudes de pláticas que mostrar.
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
