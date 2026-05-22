"use client";

import { CheckCircle2, Info, XCircle, PawPrint } from "lucide-react";
import dynamic from "next/dynamic";

import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type { CitaAdopcion } from "@/features/adopciones/types/citaAdopcion";
import type { CitaProgramadaUI } from "@/features/citas/types/CitaProgramadaSection";
import type { SolicitudAdopcionUI } from "@/features/adopciones/types/solicitud";

import { Button } from "@/components/ui/Button";

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
        <section className="rounded-2xl border border-impa-line bg-white p-5 text-impa-text shadow-impa-sm">
            {/* ✅ Banner documentos aprobados */}
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-impa-200 bg-impa-50 p-3 shadow-impa-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-impa-600 shadow-impa-xs">
                    <CheckCircle2 className="h-5 w-5" />
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-impa-800">
                        Documentos validados
                    </span>
                    <span className="mt-0.5 text-xs text-impa-700">
                        Todo está en orden. Puedes continuar con tu proceso de adopción.
                    </span>
                </div>
            </div>

            {/* ✅ Stepper (siempre visible en aprobado) */}
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
                    onStepClick={() => { }}
                />
            </div>

            {/* ✅ Contenido debajo del stepper */}
            <div className="mt-6">
                {/* CASO 0: NO hay solicitud → NO hay mascota seleccionada */}
                {!solicitudActiva ? (
                    <div className="rounded-2xl border border-impa-line bg-impa-tinted p-4 shadow-impa-xs">
                        <div className="flex items-center gap-2 mb-2">
                            <PawPrint className="h-5 w-5 text-impa-600" />
                            <p className="text-sm font-extrabold text-impa-text">
                                1) Mascota seleccionada
                            </p>
                        </div>

                        <p className="mt-1 text-sm text-impa-muted">
                            Aún no has seleccionado una mascota.
                        </p>

                        <Button className="mt-3 w-full" onClick={onVerMascotas}>
                            Ver mascotas disponibles
                        </Button>
                    </div>
                ) : citaActiva ? (
                    adopcionEstado === "pendiente" ? (
                        <div className="mb-2 mt-0 rounded-2xl border border-impa-line bg-impa-tinted p-6 shadow-impa-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-impa-500 text-white shadow-impa-sm">
                                    <Info className="h-6 w-6" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-extrabold text-impa-text">
                                        Tu formulario está en revisión
                                    </h3>
                                    <p className="mt-1 text-sm text-impa-muted">
                                        Ya completaste el formulario de adopción. El equipo del IMPA lo
                                        está revisando.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : adopcionEstado === "aprobada" ? (
                        <div className="mb-2 rounded-2xl border border-impa-200 bg-impa-50 p-5">
                            <h3 className="flex items-center gap-2 text-sm font-extrabold text-impa-800">
                                <CheckCircle2 className="h-4 w-4" />
                                ¡Adopción aprobada!
                            </h3>
                            <p className="mt-2 text-sm text-impa-700">
                                Felicidades, el proceso de adopción ha sido aprobado.
                            </p>
                        </div>
                    ) : adopcionEstado === "rechazada" ? (
                        <div className="rounded-xl border border-red-300 bg-red-50 p-5 mb-2">
                            <h3 className="text-sm font-extrabold text-red-800 flex items-center gap-2">
                                <XCircle className="h-4 w-4" />
                                Adopción no aprobada
                            </h3>
                            <p className="mt-2 text-sm text-red-700">
                                En esta ocasión la solicitud no fue aprobada.
                            </p>
                        </div>
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
        </section>
    );
}
