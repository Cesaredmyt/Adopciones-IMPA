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

function fechaCorta(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy, h:mm a", { locale: es });
}

export function EsterilizacionesTablaAdmin({
  items,
  onAprobar,
  onRechazar,
  onProgramar,
  onIniciar,
  onCompletar,
  onCancelar,
  onVer,
}: Props) {
  return (
    <div className="hidden lg:flex justify-center w-full">
      <div className="bg-white rounded-2xl border border-impa-line shadow-impa-sm overflow-hidden w-full max-w-[1200px]">
        <div className="w-full overflow-x-auto custom-scroll">
          <table className="w-full text-sm text-left text-impa-text">
            <thead className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line">
              <tr>
                <th className="px-4 py-3 w-[10%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Folio</th>
                <th className="px-4 py-3 w-[18%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Mascota</th>
                <th className="px-4 py-3 w-[18%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Solicitante</th>
                <th className="px-4 py-3 w-[18%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Programada</th>
                <th className="px-4 py-3 w-[12%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Estado</th>
                <th className="px-4 py-3 text-center w-[24%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-impa-line-faint">
              {items.map((item) => (
                <tr key={item.id} className="group bg-white hover:bg-impa-tinted/60 transition-colors duration-150">
                  <td className="px-4 py-3 font-bold text-impa-700">
                    {item.folio}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5 max-w-[180px]">
                      {item.mascota_imagen ? (
                        <img
                          src={item.mascota_imagen}
                          alt={item.mascota_nombre}
                          className="w-9 h-9 rounded-lg object-cover border border-impa-line"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-impa-surface-2 border border-impa-line" />
                      )}
                      <span className="truncate font-medium">{item.mascota_nombre}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 break-words max-w-[200px]">
                    <p className="font-medium text-impa-text leading-tight group-hover:text-impa-700 transition-colors duration-150">
                      {item.usuario_nombre}
                    </p>
                    <p className="text-xs text-impa-muted mt-0.5">{item.usuario_correo}</p>
                  </td>

                  <td className="px-4 py-3 text-impa-muted">
                    {fechaCorta(item.fecha_programada)}
                  </td>

                  <td className="px-4 py-3">
                    <EsterilizacionEstadoBadge estado={item.estado} />
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
                          Registrar resultado
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
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-impa-quiet italic"
                  >
                    No hay esterilizaciones que mostrar.
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
