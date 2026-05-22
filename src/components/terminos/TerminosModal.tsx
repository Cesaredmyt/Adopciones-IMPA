"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { BookOpen, PawPrint, HeartHandshake, Search, Ban } from "lucide-react";

interface TerminosModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TerminosModal({ open, onClose }: TerminosModalProps) {
    return (
        <ModalPremium open={open} onClose={onClose}>
            <div className="modal-container relative">

                {/* HEADER */}
                <div className="mb-6 rounded-2xl border border-impa-line bg-impa-tinted p-6 shadow-impa-sm">
                    <h2
                        className="font-display text-3xl md:text-4xl font-bold text-impa-text"
                    >
                        Términos y Condiciones
                    </h2>
                    <p
                        className="mt-2 text-sm leading-relaxed text-impa-muted"
                    >
                        Información importante antes de continuar.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* SECCIÓN 1 */}
                    <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-5 w-5 text-impa-600" />
                            <h3
                                className="font-display text-xl font-semibold text-impa-text"
                            >
                                1. Uso de la plataforma
                            </h3>
                        </div>
                        <p
                            className="pl-8 text-sm leading-relaxed text-impa-muted"
                        >
                            Te comprometes a proporcionar información verdadera, completa y
                            actualizada.
                        </p>
                    </div>

                    {/* SECCIÓN 2 */}
                    <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <PawPrint className="h-5 w-5 text-impa-600" />
                            <h3
                                className="font-display text-xl font-semibold text-impa-text"
                            >
                                2. Proceso de adopción
                            </h3>
                        </div>
                        <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                            Enviar una solicitud no garantiza aprobación; cada caso será evaluado.
                        </p>
                    </div>

                    {/* SECCIÓN 3 */}
                    <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <HeartHandshake className="h-5 w-5 text-impa-600" />
                            <h3
                                className="font-display text-xl font-semibold text-impa-text"
                            >
                                3. Responsabilidades del adoptante
                            </h3>
                        </div>
                        <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                            Si eres aprobado, deberás brindar cuidados adecuados y un ambiente seguro.
                        </p>
                    </div>

                    {/* SECCIÓN 4 */}
                    <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Search className="h-5 w-5 text-impa-600" />
                            <h3
                                className="font-display text-xl font-semibold text-impa-text"
                            >
                                4. Seguimiento
                            </h3>
                        </div>
                        <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                            Aceptas participar en seguimientos posteriores, enviando evidencia del bienestar de la mascota.
                        </p>
                    </div>

                    {/* SECCIÓN 5 */}
                    <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Ban className="h-5 w-5 text-rose-500" />
                            <h3
                                className="font-display text-xl font-semibold text-impa-text"
                            >
                                5. Prohibiciones
                            </h3>
                        </div>
                        <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                            Está prohibido maltratar, abandonar o comercializar a la mascota.
                        </p>
                    </div>

                    <div className="pt-2 text-center">
                        <p
                            className="text-sm font-medium text-impa-muted"
                        >
                            Al continuar, confirmas que has leído estos términos y condiciones.
                        </p>
                    </div>
                </div>

                {/* BOTÓN FINAL */}
                <div className="mt-6 flex justify-end border-t border-impa-line pt-4">
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-xl bg-impa-500 px-6 py-2.5 font-semibold text-white shadow-impa-sm transition hover:bg-impa-600 hover:shadow-impa-md"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </ModalPremium>
    );
}
