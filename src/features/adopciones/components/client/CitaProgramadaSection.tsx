"use client";

import { CalendarCheck, Info, ArrowRight, PawPrint, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { CitaProgramadaSectionProps } from "@/features/citas/types/CitaProgramadaSection.ts";

function formateaFechaBonita(isoDate: string) {
    const [year, month, day] = isoDate.split("-").map(Number);
    const fecha = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(fecha);
}

/**
 * Sección mostrada cuando el adoptante ya tiene una cita agendada.
 * Identidad IMPA: green primary, info tones secundarios, datos visuales claros
 * (mascota / fecha / hora) y panel "¿Qué sigue?" como guía contextual.
 */
export default function CitaProgramadaSection({
    citaActiva,
    onVerCita,
}: CitaProgramadaSectionProps) {
    if (citaActiva.estado !== "programada") {
        return null;
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-impa-200 bg-gradient-to-br from-white via-impa-50/40 to-white shadow-impa-sm animate-fade-in mt-6 mb-4">
            {/* Top hairline */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-300/60 to-transparent" />

            <div className="relative p-6 sm:p-7">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Columna principal */}
                    <div className="flex-1 min-w-0">
                        <StatusBadge estado="programada" label="Cita programada" size="sm" />

                        <h3 className="mt-3 text-lg sm:text-xl font-bold text-impa-text-strong tracking-tight flex items-center gap-2.5">
                            <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-cta text-white shadow-impa-sm">
                                <CalendarCheck className="h-4 w-4" />
                            </span>
                            ¡Ya tienes una cita programada!
                        </h3>

                        <p className="mt-2 text-sm text-impa-muted leading-relaxed max-w-xl">
                            Acude a tu cita en la fecha y hora indicadas. Después de la visita,
                            el equipo IMPA evaluará la interacción para continuar con el proceso.
                        </p>

                        {/* Datos clave */}
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <InfoTile
                                icon={<PawPrint size={13} />}
                                label="Mascota"
                                value={citaActiva.mascota?.nombre ?? "Sin nombre"}
                            />
                            <InfoTile
                                icon={<Calendar size={13} />}
                                label="Fecha"
                                value={formateaFechaBonita(citaActiva.fecha_cita)}
                                className="capitalize"
                            />
                            <InfoTile
                                icon={<Clock size={13} />}
                                label="Hora"
                                value={citaActiva.hora_cita}
                            />
                        </div>
                    </div>

                    {/* Columna lateral: ¿Qué sigue? */}
                    <aside className="w-full md:w-60 rounded-2xl border border-impa-line bg-white px-4 py-4 text-xs text-impa-text shadow-impa-xs shrink-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-impa-700 mb-3 flex items-center gap-1.5">
                            <Info className="h-3 w-3" />
                            ¿Qué sigue?
                        </p>
                        <ol className="space-y-2 text-impa-muted leading-relaxed list-none">
                            <NextStepItem n={1}>Asiste a tu cita en el IMPA.</NextStepItem>
                            <NextStepItem n={2}>El equipo evaluará la interacción.</NextStepItem>
                            <NextStepItem n={3}>Si es aprobada, podrás continuar el proceso.</NextStepItem>
                        </ol>
                    </aside>
                </div>

                {/* CTA */}
                <div className="mt-5 flex justify-end">
                    <Button variant="outline" size="sm" onClick={onVerCita} className="cursor-pointer">
                        Ver detalles de mi cita
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function InfoTile({
    icon,
    label,
    value,
    className,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className="rounded-xl border border-impa-line bg-white px-3.5 py-3 shadow-impa-xs">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-impa-700 flex items-center gap-1.5">
                <span className="text-impa-600">{icon}</span>
                {label}
            </p>
            <p className={`mt-1 text-sm font-bold text-impa-text-strong ${className ?? ""}`}>
                {value}
            </p>
        </div>
    );
}

function NextStepItem({
    n,
    children,
}: {
    n: number;
    children: React.ReactNode;
}) {
    return (
        <li className="flex items-start gap-2">
            <span className="grid place-items-center w-4 h-4 rounded-full bg-impa-50 border border-impa-200 text-impa-700 text-[9px] font-bold shrink-0 mt-0.5">
                {n}
            </span>
            <span>{children}</span>
        </li>
    );
}
