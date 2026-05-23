"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Lightbulb,
  PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import MascotaSeleccionadaCard from "./MascotaSeleccionadaCard";
import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type { CitaAdopcion } from "@/features/adopciones/types/citaAdopcion";
import type { SolicitudAdopcionUI } from "@/features/adopciones/types/solicitud";

interface SolicitudPendienteSectionProps {
  solicitudActiva: SolicitudAdopcionUI;
  citaActiva: CitaAdopcion | null;
  estado: EstadoDocumentos;
  onCancelar: () => void;
}

/**
 * Estado: usuario YA seleccionó mascota pero AÚN no agendó cita.
 * Identidad IMPA: tinted bg, mascota destacada a la izquierda, panel de "qué sigue"
 * + consejos prácticos a la derecha. CTA primario "Agendar visita" prominente.
 */
export default function SolicitudPendienteSection({
  solicitudActiva,
  citaActiva,
  estado,
  onCancelar,
}: SolicitudPendienteSectionProps) {
  const router = useRouter();
  const [mostrarAgendar, setMostrarAgendar] = useState(false);

  const puedeAgendar = estado === "aprobado" && !citaActiva;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-impa-200 bg-gradient-to-br from-white via-impa-tinted to-white shadow-impa-sm mt-5 mb-4">
      {/* Top hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-300/60 to-transparent" />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-impa-cta text-white shadow-impa-sm shrink-0">
            <PawPrint className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <StatusBadge estado="pendiente" label="Solicitud pendiente" size="sm" />
            <h3 className="mt-2 text-base sm:text-lg font-bold text-impa-text-strong tracking-tight">
              Continúa con tu adopción
            </h3>
            <p className="mt-1 text-sm text-impa-muted leading-relaxed max-w-2xl">
              Ya tienes una solicitud activa. Ahora puedes agendar tu cita para conocer
              personalmente a <strong className="text-impa-700">tu mascota seleccionada</strong>.
            </p>
          </div>
        </div>

        {solicitudActiva?.mascota_id && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-6 lg:gap-10 items-start">
            {/* CTA desktop (full-width arriba de las dos columnas) */}
            <div className="hidden lg:col-span-2 lg:block">
              <Button
                variant="cta"
                size="lg"
                full
                onClick={() => router.push("/dashboards/usuario/citas")}
                className="cursor-pointer"
              >
                <CalendarDays size={18} />
                Agendar visita
                <ArrowRight size={16} />
              </Button>
            </div>

            {/* Columna izquierda: ficha de mascota */}
            <div className="flex flex-col gap-4">
              <div className="w-full rounded-2xl border border-impa-line bg-white/95 p-5 shadow-impa-sm backdrop-blur-md">
                <MascotaSeleccionadaCard
                  mascota={solicitudActiva.mascota}
                  onCancelar={onCancelar}
                />
              </div>

              {/* Toggle mobile para info adicional */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  full
                  onClick={() => setMostrarAgendar((v) => !v)}
                  className="cursor-pointer"
                >
                  {mostrarAgendar ? "Ocultar detalles" : "Ver información de la visita"}
                  <ArrowRight
                    size={14}
                    className={`transition-transform duration-200 ${
                      mostrarAgendar ? "rotate-90" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Columna derecha: timeline de proceso + consejos */}
            <div className="relative">
              {/* Línea decorativa vertical (desktop) */}
              <div
                aria-hidden
                className="absolute bottom-0 left-2 top-0 hidden w-px bg-gradient-to-b from-impa-200 via-impa-100 to-transparent lg:block"
              />

              <div className="space-y-4 pl-0 lg:pl-8">
                {(mostrarAgendar || typeof window === "undefined") && (
                  <div className="space-y-4 lg:!block" data-mostrar={mostrarAgendar}>
                    {/* ¿Qué sigue? */}
                    <div className="rounded-2xl border border-impa-line bg-white/95 p-5 shadow-impa-sm backdrop-blur-md">
                      <h4 className="mb-2.5 inline-flex items-center gap-2 text-sm font-bold text-impa-text-strong">
                        <span className="grid place-items-center w-7 h-7 rounded-lg bg-impa-50 border border-impa-200 text-impa-600">
                          <CalendarDays size={14} />
                        </span>
                        ¿Qué sigue ahora?
                      </h4>
                      <ul className="space-y-1.5 text-xs text-impa-muted leading-relaxed pl-1">
                        <li className="flex items-start gap-2">
                          <span className="impa-dot bg-impa-500 mt-1.5 shrink-0" />
                          Agenda tu visita para convivir con tu mascota.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="impa-dot bg-impa-500 mt-1.5 shrink-0" />
                          El IMPA evaluará cómo interactúan.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="impa-dot bg-impa-500 mt-1.5 shrink-0" />
                          Si es aprobada, llenarás el formulario final.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="impa-dot bg-impa-500 mt-1.5 shrink-0" />
                          Un administrador revisará tu información.
                        </li>
                      </ul>
                    </div>

                    {/* Estado de tu proceso */}
                    <div className="rounded-2xl border border-impa-line bg-white/95 p-5 shadow-impa-sm backdrop-blur-md">
                      <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-impa-text-strong">
                        <span className="grid place-items-center w-7 h-7 rounded-lg bg-impa-info-soft border border-sky-200 text-impa-info">
                          <BookOpenCheck size={14} />
                        </span>
                        Estado de tu proceso
                      </h4>
                      <div className="grid gap-2 text-xs text-impa-muted">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-impa-success" />
                          <span className="text-impa-text">Mascota seleccionada</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight size={15} className="text-impa-600" />
                          <span className="text-impa-text font-semibold">
                            Pendiente: agendar visita
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-70">
                          <Clock3 size={15} />
                          Formulario después de la visita
                        </div>
                        <div className="flex items-center gap-2 opacity-70">
                          <Clock3 size={15} />
                          Aprobación final
                        </div>
                      </div>
                    </div>

                    {/* Consejos */}
                    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-impa-warning-soft/60 p-5 shadow-impa-xs">
                      <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-impa-text-strong">
                        <span className="grid place-items-center w-7 h-7 rounded-lg bg-white border border-amber-200 text-impa-warning">
                          <Lightbulb size={14} />
                        </span>
                        Consejos para tu visita
                      </h4>
                      <ul className="space-y-1.5 text-xs leading-relaxed text-impa-warning-ink/80">
                        <li>· Llega 10 a 15 minutos antes.</li>
                        <li>· Puedes traer fotos del hogar.</li>
                        <li>· Mantén las vacunas al día si tienes otras mascotas.</li>
                        <li>· Sé tú mismo, la convivencia es lo más importante.</li>
                      </ul>
                    </div>

                    {/* CTA mobile */}
                    {puedeAgendar && (
                      <Button
                        variant="cta"
                        full
                        onClick={() => router.push("/dashboards/usuario/citas")}
                        className="cursor-pointer lg:hidden"
                      >
                        <CalendarDays size={16} />
                        Agendar visita
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
