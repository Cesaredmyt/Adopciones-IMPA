"use client";

import { useState } from "react";
import { CheckCircle2, Info, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PASOS_ADOPCION = [
  {
    id: 1,
    titulo: "Mascotas",
    desc: "Elige a tu compañero.",
    detalle:
      "Explora la lista completa de mascotas disponibles y selecciona una para iniciar tu proceso.",
    ruta: "/dashboards/usuario/mascotas",
  },
  {
    id: 2,
    titulo: "Cita",
    desc: "Agenda una visita.",
    detalle:
      "Programa una visita al IMPA para conocer personalmente a tu mascota.",
    ruta: "/dashboards/usuario/citas",
  },
  {
    id: 3,
    titulo: "Formulario",
    desc: "Llena tus datos.",
    detalle:
      "Completa el formulario para continuar con la evaluación del IMPA.",
    ruta: "/dashboards/usuario/citas",
  },
  {
    id: 4,
    titulo: "Evaluación",
    desc: "Estamos revisando.",
    detalle:
      "Revisaremos tus documentos, formulario y visita para determinar la aprobación.",
    ruta: null,
  },
  {
    id: 5,
    titulo: "Finalizar",
    desc: "Adopción aprobada.",
    detalle:
      "Si todo es aprobado, podrás completar oficialmente la adopción.",
    ruta: null,
  },
];

/**
 * Stepper específico del flujo de adopción (5 pasos, con navegación, bloqueos y tooltips).
 * Visualmente alineado con el primitivo `<Stepper>` del design system:
 * - Completed: bg-impa-cta verde sólido con check blanco
 * - Active: borde verde + glow + ring (impa-glow + ring impa-500/15)
 * - Locked: candado, gris quiet
 * - Upcoming: borde sutil, número
 */
export default function StepperAdopcion({
  activeStep,
  solicitudId,
  blockedSteps,
  onStepClick,
}: {
  activeStep: number;
  solicitudId?: string | null;
  blockedSteps?: Record<number, boolean>;
  onStepClick?: (step: number) => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  const totalSteps = PASOS_ADOPCION.length;
  const progress =
    totalSteps <= 1 ? 0 : ((activeStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative mt-8">
      {/* Línea base */}
      <div className="absolute left-0 right-0 top-[34px] z-0 h-[3px] -translate-y-1/2 rounded-full bg-impa-line" />

      {/* Línea de progreso (verde IMPA) */}
      <div
        className="absolute left-0 top-[34px] z-0 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-impa-500 to-impa-600 transition-all duration-700 ease-impa-out"
        style={{ width: `${progress}%` }}
      />

      {/* Pasos */}
      <div className="relative grid gap-4 md:grid-cols-5 z-10">
        {PASOS_ADOPCION.map((paso) => {
          const completado = paso.id < activeStep;
          const activo = paso.id === activeStep;
          const bloqueado =
            paso.id !== activeStep || blockedSteps?.[paso.id] === true;

          const handleClick = () => {
            if (bloqueado) return;
            if (onStepClick) {
              onStepClick(paso.id);
              return;
            }
            if (!paso.ruta) return;
            if (paso.ruta === "formulario" && solicitudId) {
              router.push(`/dashboards/usuario/form-adopcion/${solicitudId}`);
              return;
            }
            if (paso.ruta && paso.ruta !== "formulario") {
              router.push(paso.ruta);
            }
          };

          return (
            <div
              key={paso.id}
              onMouseEnter={() => setHovered(paso.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={handleClick}
              className={cn(
                "relative rounded-2xl border p-4 text-center transition-all duration-300 ease-impa-out",
                completado &&
                  "border-impa-200 bg-impa-50/60 text-impa-text shadow-impa-xs",
                activo &&
                  "scale-[1.02] border-impa-500 bg-white text-impa-text shadow-impa-md ring-4 ring-impa-500/10",
                !completado &&
                  !activo &&
                  (bloqueado
                    ? "border-impa-line bg-impa-bg-elev text-impa-quiet opacity-80"
                    : "border-impa-line bg-white text-impa-muted"),
                bloqueado
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:-translate-y-0.5 hover:border-impa-300 hover:shadow-impa-sm"
              )}
            >
              {/* Círculo del paso */}
              <div className="flex justify-center mb-2">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-200 ease-impa-out shrink-0",
                    completado &&
                      "bg-impa-cta border-impa-600 text-white shadow-impa-sm",
                    activo &&
                      "bg-white border-impa-500 text-impa-700 shadow-impa-glow ring-4 ring-impa-500/15",
                    !completado &&
                      !activo &&
                      (bloqueado
                        ? "bg-white border-impa-line text-impa-quiet"
                        : "bg-white border-impa-line text-impa-muted")
                  )}
                >
                  {completado ? (
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                  ) : bloqueado && paso.id > activeStep ? (
                    <LockKeyhole className="h-4 w-4" />
                  ) : (
                    paso.id
                  )}
                </span>
              </div>

              <p
                className={cn(
                  "text-sm font-bold leading-tight",
                  activo ? "text-impa-text-strong" : "text-impa-text"
                )}
              >
                {paso.titulo}
              </p>
              <p className="mt-1 text-xs text-impa-muted leading-snug">{paso.desc}</p>

              {/* Estado del paso */}
              <p
                className={cn(
                  "mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold",
                  completado && "text-impa-700",
                  activo && "text-impa-600",
                  !completado && !activo && (bloqueado ? "text-impa-quiet" : "text-impa-muted")
                )}
              >
                <Info className="h-3 w-3" />
                {completado
                  ? "Completado"
                  : activo
                  ? "Paso actual"
                  : bloqueado
                  ? "No disponible"
                  : "Pendiente"}
              </p>

              {/* Tooltip detallado al hover */}
              {hovered === paso.id && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-60 rounded-xl border border-impa-line bg-white shadow-impa-xl p-4 text-xs leading-relaxed text-impa-muted animate-fade-in z-20 text-left">
                  <p className="mb-1 font-bold text-impa-text-strong">
                    {paso.titulo}
                  </p>
                  <p>{paso.detalle}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
