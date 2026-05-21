"use client";

import { Clock, CalendarClock, CheckCircle, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

export type Cita = {
  id: string;
  fecha_cita: string;
  hora_cita: string;
  estado: "programada" | "completada" | "cancelada";

  usuario?: { nombres?: string; apellido_paterno?: string; apellido_materno?: string; email?: string } | null;
  mascotas?: { id: string; nombre: string } | null;

  asistencia?: "asistio" | "no_asistio_no_apto" | null;
  interaccion?: "buena_aprobada" | "no_apta" | null;
  nota?: string | null;
};

type Props = {
  items: Cita[];

  onReprogramar: (c: Cita) => void;
  onCancelar: (id: string) => void;
  onEvaluar: (c: Cita) => void;
};

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted",
        props.className
      )}
    />
  );
}

const badgeAsistencia = (a: Cita["asistencia"]) => {
  if (a === "asistio")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        asistió
      </span>
    );
  if (a === "no_asistio_no_apto")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 bg-red-50 text-red-700 border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        no asistió / no apto
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 bg-impa-surface-3 text-impa-muted border border-impa-line">
      pendiente
    </span>
  );
};

const badgeInteraccion = (i: Cita["interaccion"]) => {
  if (i === "buena_aprobada")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        aprobada
      </span>
    );
  if (i === "no_apta")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 bg-red-50 text-red-700 border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        no apta
      </span>
    );
  return (
    <span className="inline-flex items-center text-xs font-semibold rounded-full px-2.5 py-1 bg-impa-surface-3 text-impa-quiet border border-impa-line">
      —
    </span>
  );
};

const badgeEstado = (estado: Cita["estado"]) => {
  const map = {
    programada: "bg-amber-50 text-amber-700 border-amber-200",
    completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelada: "bg-impa-surface-3 text-impa-muted border-impa-line",
  } as const;

  const dot = {
    programada: "bg-amber-500",
    completada: "bg-emerald-500",
    cancelada: "bg-impa-quiet",
  } as const;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 border ${map[estado]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[estado]}`} />
      {estado}
    </span>
  );
};

export default function CitasTable({
  items,
  onReprogramar,
  onCancelar,
  onEvaluar,
}: Props) {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white rounded-2xl border border-impa-line shadow-impa-sm overflow-hidden">

      {/* MOBILE VIEW - CARDS */}
      {isMobile && (
        <div className="p-3 space-y-3 md:hidden">
          {items.map((cita: any) => (
            <div
              key={cita.id}
              className="rounded-2xl border border-impa-line bg-white p-4 shadow-impa-xs flex flex-col gap-2 max-w-full overflow-hidden transition-all duration-200 hover:shadow-impa-md"
            >
              <p className="font-semibold text-impa-text text-base break-words max-w-full">
                {[
                  cita.usuario?.nombres,
                  cita.usuario?.apellido_paterno,
                  cita.usuario?.apellido_materno,
                ].filter(Boolean).join(" ")}
              </p>
              <p className="text-sm text-impa-muted break-all max-w-full">
                {cita.usuario?.email}
              </p>

              <p className="mt-1 text-sm font-medium text-impa-text">
                Mascota: <span className="font-semibold">{cita.mascota?.nombre ?? "—"}</span>
              </p>

              <p className="text-sm text-impa-muted whitespace-nowrap flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-impa-600" />
                {new Date(cita.fecha_cita).toLocaleDateString("es-MX")} — {cita.hora_cita.slice(0, 5)}
              </p>

              <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                {badgeEstado(cita.estado)}
                {badgeAsistencia(cita.asistencia)}
                {badgeInteraccion(cita.interaccion)}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {cita.estado === "programada" && !cita.asistencia && !cita.interaccion && (
                  <>
                    <button
                      className="inline-flex items-center gap-1 rounded-lg border border-impa-line px-2.5 py-1.5 text-xs font-semibold text-impa-text hover:bg-impa-50 hover:border-impa-300 transition-colors duration-150 cursor-pointer"
                      onClick={() => onReprogramar(cita)}
                    >
                      <CalendarClock size={13} />
                      Reprogramar
                    </button>

                    <button
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors duration-150 cursor-pointer"
                      onClick={() => onEvaluar(cita)}
                    >
                      <CheckCircle size={13} />
                      Evaluar
                    </button>

                    <button
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors duration-150 cursor-pointer"
                      onClick={() => onCancelar(cita.id)}
                    >
                      <XCircle size={13} />
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-impa-muted text-sm">
              No hay citas para mostrar
            </div>
          )}
        </div>
      )}

      {/* DESKTOP VIEW - TABLE */}
      {!isMobile && (
        <div className="overflow-x-auto hidden md:block custom-scroll">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-[1]">
              <tr className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line">
                <Th className="text-left">Usuario</Th>
                <Th className="text-left">Mascota</Th>
                <Th className="text-left">Fecha</Th>
                <Th className="text-left">Hora</Th>
                <Th className="text-left">Estado</Th>
                <Th className="text-left">Asistencia</Th>
                <Th className="text-left">Interacción</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-impa-line-faint">
              {items.map((cita: any) => (
                <tr
                  key={cita.id}
                  className="group bg-white hover:bg-impa-tinted/60 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-impa-text font-medium">
                    <div className="leading-tight">
                      <div className="group-hover:text-impa-700 transition-colors duration-150">
                        {[
                          cita.usuario?.nombres,
                          cita.usuario?.apellido_paterno,
                          cita.usuario?.apellido_materno,
                        ].filter(Boolean).join(" ")}
                      </div>
                      <div className="text-xs text-impa-muted mt-0.5">{cita.usuario?.email}</div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-impa-text">
                    {cita.mascota?.nombre || "—"}
                  </td>

                  <td className="px-4 py-3 text-impa-text">
                    {new Intl.DateTimeFormat("es-MX", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(cita.fecha_cita + "T00:00:00Z"))}
                  </td>

                  <td className="px-4 py-3 text-impa-text">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-impa-600" />
                      {(cita.hora_cita || "").slice(0, 5)}
                    </span>
                  </td>

                  <td className="px-4 py-3">{badgeEstado(cita.estado)}</td>
                  <td className="px-4 py-3">{badgeAsistencia(cita.asistencia)}</td>
                  <td className="px-4 py-3">{badgeInteraccion(cita.interaccion)}</td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap gap-1.5 justify-end opacity-80 group-hover:opacity-100 transition-opacity duration-150">
                      {cita.estado === "programada" && !cita.asistencia && !cita.interaccion && (
                        <>
                          <button
                            onClick={() => onReprogramar(cita)}
                            className="inline-flex items-center gap-1 rounded-lg border border-impa-line px-2.5 py-1.5 text-xs font-semibold text-impa-text hover:bg-impa-50 hover:border-impa-300 transition-colors duration-150 cursor-pointer"
                          >
                            <CalendarClock size={13} />
                            Reprogramar
                          </button>

                          <button
                            onClick={() => onEvaluar(cita)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors duration-150 cursor-pointer"
                          >
                            <CheckCircle size={13} />
                            Evaluar
                          </button>

                          <button
                            onClick={() => onCancelar(cita.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors duration-150 cursor-pointer"
                          >
                            <XCircle size={13} />
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center">
                    <div className="text-impa-muted text-sm">No hay citas para mostrar</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
