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
      <div className="bg-white rounded-xl shadow-md overflow-x-auto w-full max-w-[1200px]">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#FFF6E5] text-[#0f830f]">
            <tr>
              <th className="px-4 py-3 w-[10%]">Folio</th>
              <th className="px-4 py-3 w-[18%]">Mascota</th>
              <th className="px-4 py-3 w-[18%]">Solicitante</th>
              <th className="px-4 py-3 w-[18%]">Programada</th>
              <th className="px-4 py-3 w-[12%]">Estado</th>
              <th className="px-4 py-3 text-center w-[24%]">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5e6d3] text-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#f6f8f6]">
                <td className="px-4 py-3 font-semibold text-[#0f830f]">
                  {item.folio}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 max-w-[180px]">
                    {item.mascota_imagen && (
                      <img
                        src={item.mascota_imagen}
                        alt={item.mascota_nombre}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    )}
                    <span className="truncate">{item.mascota_nombre}</span>
                  </div>
                </td>

                <td className="px-4 py-3 break-words max-w-[200px]">
                  <p className="font-medium text-slate-800">
                    {item.usuario_nombre}
                  </p>
                  <p className="text-xs text-slate-500">{item.usuario_correo}</p>
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {fechaCorta(item.fecha_programada)}
                </td>

                <td className="px-4 py-3">
                  <EsterilizacionEstadoBadge estado={item.estado} />
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center flex-wrap gap-2">
                    <button
                      onClick={() => onVer(item)}
                      className="p-2 text-slate-500 hover:text-[#0f830f] hover:bg-impa-50 rounded-md transition"
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
                        Registrar resultado
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
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400 italic"
                >
                  No hay esterilizaciones que mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
