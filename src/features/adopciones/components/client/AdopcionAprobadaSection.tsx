"use client";

import { CheckCircle2, Info, XCircle, PawPrint, ArrowRight, Sparkles, Heart } from "lucide-react";
import dynamic from "next/dynamic";

import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type { CitaAdopcion } from "@/features/adopciones/types/citaAdopcion";
import type { CitaProgramadaUI } from "@/features/citas/types/CitaProgramadaSection";
import type { SolicitudAdopcionUI } from "@/features/adopciones/types/solicitud";

import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import PanelEstado from "@/features/adopciones/components/client/PanelEstado";

import CitaProgramadaSection from "@/features/adopciones/components/client/CitaProgramadaSection";
import CitaAprobadaSection from "@/features/adopciones/components/client/CitaAprobadaSection";
import SolicitudPendienteSection from "@/features/adopciones/components/client/SolicitudPendienteSection";

const StepperAdopcion = dynamic(
  () => import("@/features/adopciones/components/client/StepperAdopcion"),
  { ssr: false }
);

export interface AdopcionAprobadaSectionProps {
  estado: EstadoDocumentos;
  solicitudActiva: SolicitudAdopcionUI | null;
  citaActiva: CitaAdopcion | null;
  citaProgramadaUI: CitaProgramadaUI | null;
  adopcionEstado: "pendiente" | "aprobada" | "rechazada" | null;

  onVerCita: () => void;
  onVerMascotas: () => void;
  onIrFormulario: (solicitudId: string) => void;
  onCancelarSolicitud: () => void;
}

export default function AdopcionAprobadaSection({
  estado,
  solicitudActiva,
  citaActiva,
  citaProgramadaUI,
  adopcionEstado,
  onVerCita,
  onVerMascotas,
  onIrFormulario,
  onCancelarSolicitud,
}: AdopcionAprobadaSectionProps) {
  if (estado !== "aprobado") return null;

  const activeStep =
    adopcionEstado === "aprobada" || adopcionEstado === "rechazada"
      ? 5
      : adopcionEstado === "pendiente"
      ? 4
      : citaActiva
      ? 3
      : solicitudActiva
      ? 2
      : 1;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm">
      {/* Top hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      <div className="p-5 sm:p-6">
        {/* Banner documentos aprobados */}
        <div className="relative overflow-hidden mb-5 flex items-center gap-3 rounded-2xl border border-impa-200 bg-gradient-to-r from-impa-50 via-white to-impa-success-soft/50 p-3.5 shadow-impa-xs">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-impa-cta text-white shadow-impa-sm shrink-0">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-impa-text-strong">
              Documentos validados
              <StatusBadge estado="aprobado" size="xs" dot={false} />
            </p>
            <p className="text-xs text-impa-muted leading-tight mt-0.5">
              Todo está en orden. Puedes continuar con tu proceso de adopción.
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="relative z-10">
          <StepperAdopcion
            activeStep={activeStep}
            solicitudId={solicitudActiva?.id ?? null}
            blockedSteps={{
              3: !(
                citaActiva &&
                citaActiva.estado === "completada" &&
                citaActiva.asistencia === "asistio" &&
                citaActiva.interaccion === "buena_aprobada"
              ),
              4: true,
              5: true,
            }}
            onStepClick={() => {}}
          />
        </div>

        {/* Contenido según el estado */}
        <div className="mt-8">
          {/* CASO 0: no hay solicitud */}
          {!solicitudActiva ? (
            <div className="relative overflow-hidden rounded-2xl border border-impa-200 bg-gradient-to-br from-white via-impa-tinted to-white p-6 shadow-impa-sm">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-impa-cta text-white shadow-impa-sm shrink-0">
                  <PawPrint className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-impa-700 inline-flex items-center gap-1.5">
                    <Sparkles size={11} />
                    Siguiente paso
                  </p>
                  <h4 className="mt-1 text-base font-bold text-impa-text-strong tracking-tight">
                    Selecciona la mascota que te gustaría adoptar
                  </h4>
                  <p className="text-sm text-impa-muted mt-1 leading-relaxed">
                    Explora el catálogo, conoce su historia y elige al compañero ideal
                    para tu familia.
                  </p>
                </div>
                <Button
                  variant="cta"
                  size="lg"
                  onClick={onVerMascotas}
                  className="cursor-pointer shrink-0 w-full sm:w-auto"
                >
                  <PawPrint size={16} />
                  Ver mascotas disponibles
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          ) : citaActiva ? (
            adopcionEstado === "pendiente" ? (
              <PanelEstado
                tone="info"
                icon={<Info className="h-6 w-6" />}
                title="Tu formulario está en revisión"
                desc="Ya completaste el formulario de adopción. El equipo del IMPA lo está revisando y te avisaremos en cuanto haya una resolución."
              />
            ) : adopcionEstado === "aprobada" ? (
              <PanelEstado
                tone="success"
                icon={<Heart className="h-6 w-6 fill-white" />}
                title="¡Adopción aprobada!"
                desc="Felicidades, el proceso de adopción ha sido aprobado. Bienvenido a la familia IMPA — pronto recibirás los detalles para concretar la entrega."
              />
            ) : adopcionEstado === "rechazada" ? (
              <PanelEstado
                tone="danger"
                icon={<XCircle className="h-6 w-6" />}
                title="Adopción no aprobada"
                desc="En esta ocasión la solicitud no fue aprobada. Puedes contactar a un coordinador IMPA para conocer los detalles y, si lo deseas, iniciar un nuevo proceso."
              />
            ) : citaProgramadaUI?.estado === "programada" ? (
              <CitaProgramadaSection
                citaActiva={citaProgramadaUI}
                estado={estado}
                onVerCita={onVerCita}
              />
            ) : citaActiva.estado === "completada" &&
              citaActiva.asistencia === "asistio" &&
              citaActiva.interaccion === "buena_aprobada" ? (
              <CitaAprobadaSection
                mascota={{
                  nombre: solicitudActiva.mascota?.nombre ?? "Mascota",
                  imagen_url: solicitudActiva.mascota?.imagen_url ?? null,
                }}
                onIrFormulario={() => onIrFormulario(solicitudActiva.id)}
              />
            ) : null
          ) : (
            <SolicitudPendienteSection
              solicitudActiva={solicitudActiva}
              citaActiva={citaActiva}
              estado={estado}
              onCancelar={onCancelarSolicitud}
            />
          )}
        </div>
      </div>
    </section>
  );
}
