"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { Playfair_Display, Poppins } from "next/font/google";
import { BookOpen, PawPrint, HeartHandshake, Search, Ban } from "lucide-react";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
});

interface TerminosModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TerminosModal({ open, onClose }: TerminosModalProps) {
    return (
        <ModalPremium open={open} onClose={onClose}>
            <div className="modal-container relative">

                {/* HEADER */}
                <div className="rounded-2xl p-6 shadow-sm border border-slate-100 bg-slate-50 mb-6">
                    <h2
                        className={`${playfair.className} text-3xl md:text-4xl font-bold text-slate-900`}
                    >
                        Términos y Condiciones
                    </h2>
                    <p
                        className={`${poppins.className} text-sm text-slate-500 mt-2 leading-relaxed`}
                    >
                        Información importante antes de continuar.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* SECCIÓN 1 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-5 w-5 text-emerald-600" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-slate-800`}
                            >
                                1. Uso de la plataforma
                            </h3>
                        </div>
                        <p
                            className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}
                        >
                            Te comprometes a proporcionar información verdadera, completa y
                            actualizada.
                        </p>
                    </div>

                    {/* SECCIÓN 2 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <PawPrint className="h-5 w-5 text-emerald-600" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-slate-800`}
                            >
                                2. Proceso de adopción
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                            Enviar una solicitud no garantiza aprobación; cada caso será evaluado.
                        </p>
                    </div>

                    {/* SECCIÓN 3 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <HeartHandshake className="h-5 w-5 text-emerald-600" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-slate-800`}
                            >
                                3. Responsabilidades del adoptante
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                            Si eres aprobado, deberás brindar cuidados adecuados y un ambiente seguro.
                        </p>
                    </div>

                    {/* SECCIÓN 4 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Search className="h-5 w-5 text-emerald-600" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-slate-800`}
                            >
                                4. Seguimiento
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                            Aceptas participar en seguimientos posteriores, enviando evidencia del bienestar de la mascota.
                        </p>
                    </div>

                    {/* SECCIÓN 5 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Ban className="h-5 w-5 text-rose-500" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-slate-800`}
                            >
                                5. Prohibiciones
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                            Está prohibido maltratar, abandonar o comercializar a la mascota.
                        </p>
                    </div>

                    <div className="pt-2 text-center">
                        <p
                            className={`${poppins.className} text-sm text-slate-500 font-medium`}
                        >
                            Al continuar, confirmas que has leído estos términos y condiciones.
                        </p>
                    </div>
                </div>

                {/* BOTÓN FINAL */}
                <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-semibold shadow-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </ModalPremium>
    );
}