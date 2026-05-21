"use client";

import { Button } from "@/components/ui/Button";
import { CitasVeterinariasEstadoBadge } from "./CitasVeterinariasEstadoBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function CitasVeterinariasTablaAdmin({
  citas,
  onAprobar,
  onCancelar,
}: {
  citas: any[];
  onAprobar: (c: any) => void;
  onCancelar: (c: any) => void;
}) {
  return (
    <div className="hidden lg:flex justify-center w-full">
      <div className="bg-white rounded-2xl border border-impa-line shadow-impa-sm overflow-hidden w-full max-w-[1200px]">
        <div className="w-full overflow-x-auto custom-scroll">
          <table className="w-full text-sm text-left text-impa-text">

            <thead className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line">
              <tr>
                <th className="px-4 py-3 w-[18%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Adoptante</th>
                <th className="px-4 py-3 w-[18%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Mascota</th>
                <th className="px-4 py-3 w-[18%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Fecha</th>
                <th className="px-4 py-3 w-[20%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Motivo</th>
                <th className="px-4 py-3 w-[12%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Estado</th>
                <th className="px-4 py-3 text-center w-[14%] text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-impa-line-faint">

              {citas.map((item) => (
                <tr key={item.id} className="group bg-white hover:bg-impa-tinted/60 transition-colors duration-150">

                  {/* Adoptante */}
                  <td className="px-4 py-3 whitespace-normal break-words max-w-[180px] font-medium group-hover:text-impa-700 transition-colors duration-150">
                    {item.adoptante_nombre}
                  </td>

                  {/* Mascota */}
                  <td className="px-4 py-3 max-w-[160px]">
                    <div className="flex items-center gap-2.5">
                      {item.mascota_imagen ? (
                        <img
                          src={item.mascota_imagen}
                          alt={item.mascota_nombre}
                          className="w-9 h-9 rounded-lg object-cover border border-impa-line"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-impa-surface-2 border border-impa-line" />
                      )}
                      <span className="truncate max-w-[100px] font-medium">
                        {item.mascota_nombre}
                      </span>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="px-4 py-3 whitespace-normal break-words max-w-[200px] text-impa-text">
                    {format(
                      new Date(item.fecha_cita),
                      "EEEE d 'de' MMMM, h:mm a",
                      { locale: es }
                    )}
                  </td>

                  {/* Motivo */}
                  <td className="px-4 py-3 whitespace-normal break-words max-w-[260px] text-impa-muted">
                    {item.motivo}
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3">
                    <CitasVeterinariasEstadoBadge estado={item.estado} />
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-center">
                    {item.estado === "pendiente" ? (
                      <div className="flex justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-150">
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
                          onClick={() => onCancelar(item)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-impa-quiet italic text-xs">
                        {item.estado}
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
