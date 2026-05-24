"use client";

import { PawPrint, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { SolicitudAdopcionMin } from "@/features/perfil/types/perfil";

/**
 * Lista de mascotas en proceso de adopción dentro del Perfil.
 * Se renderiza como sub-sección dentro de "Mis mascotas".
 * Cards horizontales compactas con foto + nombre + folio + estado.
 */
export default function PerfilSolicitudesCard({
  solicitudes,
}: {
  solicitudes: SolicitudAdopcionMin[];
}) {
  if (solicitudes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-impa-line bg-impa-surface-2/40 p-4">
      <h3 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-impa-700 mb-3">
        <Clock size={11} />
        En proceso de adopción
        <span className="px-1.5 py-0.5 rounded-full bg-impa-50 border border-impa-200 text-[10px] text-impa-700 normal-case tracking-normal">
          {solicitudes.length}
        </span>
      </h3>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {solicitudes.map((sol) => (
          <li
            key={sol.id}
            className="rounded-xl border border-impa-line bg-white p-3 shadow-impa-xs transition-all duration-200 hover:shadow-impa-sm hover:border-impa-line-strong"
          >
            <div className="flex items-center gap-2.5">
              {sol.mascota?.imagen_url ? (
                <img
                  src={sol.mascota.imagen_url}
                  alt={sol.mascota.nombre ?? "Mascota"}
                  className="w-12 h-12 rounded-xl object-cover border border-impa-line"
                />
              ) : (
                <span className="grid place-items-center w-12 h-12 rounded-xl bg-impa-tinted border border-impa-line text-impa-600">
                  <PawPrint size={16} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-impa-text-strong truncate">
                  {sol.mascota?.nombre ?? "Mascota"}
                </p>
                {sol.numero_solicitud && (
                  <p className="text-[11px] text-impa-muted truncate">
                    Solicitud #{sol.numero_solicitud}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2.5">
              <StatusBadge estado={sol.estado} size="xs" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
