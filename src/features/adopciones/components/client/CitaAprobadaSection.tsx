"use client";

import { CheckCircle2, FileText, PawPrint, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

export interface CitaAprobadaSectionProps {
    mascota: {
        nombre: string;
        imagen_url: string | null;
    };
    onIrFormulario: () => void;
}

/**
 * Sección visible cuando el adoptante asistió a la visita y la interacción
 * con la mascota fue aprobada por el IMPA. CTA para llenar el formulario final.
 *
 * Identidad: verde IMPA (success) + foto destacada + checklist de confirmación.
 */
export default function CitaAprobadaSection({
    mascota,
    onIrFormulario,
}: CitaAprobadaSectionProps) {
    return (
        <div
            className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-impa-success-soft/40 to-white shadow-impa-sm animate-fade-in mt-6 mb-6"
        >
            {/* Top hairline verde */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />

            {/* Sparkle confetti decoration */}
            <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 opacity-20">
                <Sparkles size={120} className="text-impa-500" />
            </div>

            <div className="relative p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-impa-cta text-white shadow-impa-sm shrink-0">
                        <CheckCircle2 className="h-7 w-7" strokeWidth={2.5} />
                    </div>

                    <div className="min-w-0">
                        <StatusBadge estado="aprobada" label="Visita aprobada" size="sm" />
                        <h3 className="mt-2 text-lg sm:text-xl font-bold text-impa-success-ink tracking-tight leading-tight">
                            ¡Tu cita fue aprobada!
                        </h3>
                        <p className="text-sm text-impa-success-ink/85 mt-1 leading-relaxed">
                            El IMPA confirmó que la interacción con tu mascota fue positiva.
                            Ahora puedes continuar con el formulario final.
                        </p>
                    </div>
                </div>

                {/* Detalle de mascota + checklist */}
                <div className="mt-6 grid sm:grid-cols-[160px_1fr] gap-5 sm:gap-6 items-start">
                    <div className="relative w-full overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-impa-md ring-1 ring-impa-line">
                        <img
                            src={mascota.imagen_url || "/ISOTIPO IMPA.png"}
                            alt={mascota.nombre}
                            className="w-full h-40 sm:h-44 object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-impa-text-strong/85 via-impa-text-strong/20 to-transparent p-3">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-impa-700">
                                <PawPrint size={10} />
                                Mascota
                            </div>
                            <p className="mt-1 text-white text-sm font-bold leading-tight">
                                {mascota.nombre}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm text-impa-text leading-relaxed">
                            La convivencia con <strong className="text-impa-700">{mascota.nombre}</strong> fue
                            evaluada como <strong className="text-impa-success-ink">positiva</strong> por
                            nuestro equipo. ¡Estás a un paso de cambiar dos vidas!
                        </p>

                        <ul className="space-y-1.5 text-xs sm:text-sm">
                            {[
                                "Mascota seleccionada y compatible",
                                "Documentos validados",
                                "Visita presencial aprobada",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-2 text-impa-success-ink/90"
                                >
                                    <span className="grid place-items-center w-4 h-4 rounded-full bg-impa-success text-white shrink-0">
                                        <CheckCircle2 size={11} strokeWidth={3} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                            <li className="flex items-center gap-2 text-impa-muted">
                                <span className="w-4 h-4 rounded-full border-2 border-dashed border-impa-quiet shrink-0" />
                                Llenar formulario final de adopción
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">
                    <Button
                        variant="cta"
                        size="lg"
                        onClick={onIrFormulario}
                        className="cursor-pointer"
                    >
                        <FileText className="h-4 w-4" />
                        Llenar formulario de adopción
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
