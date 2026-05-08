"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { Playfair_Display, Poppins } from "next/font/google";
import { Shield, FileText, Lock, UserCheck } from "lucide-react";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
});

export default function PoliticaPrivacidadModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    return (
        <ModalPremium open={open} onClose={onClose}>
            {/* HEADER */}
            <div className="rounded-2xl p-6 shadow-sm border border-slate-100 bg-slate-50 mb-6">
                <h2
                    className={`${playfair.className} text-3xl md:text-4xl font-bold text-slate-900`}
                >
                    Política de Privacidad
                </h2>
                <p
                    className={`${poppins.className} text-sm text-slate-500 mt-2 leading-relaxed`}
                >
                    Cómo protegemos y utilizamos tu información personal.
                </p>
            </div>

            {/* CONTENIDO */}
            <div className="space-y-4">

                {/* Sección 1 */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-emerald-600" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-slate-800`}
                        >
                            1. Información que recopilamos
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                        Recopilamos datos como nombre, correo electrónico, dirección, documentos
                        oficiales y cualquier información necesaria para evaluar solicitudes de adopción.
                    </p>
                </div>

                {/* Sección 2 */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-emerald-600" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-slate-800`}
                        >
                            2. Uso de los datos
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                        Utilizamos tu información únicamente para gestionar solicitudes, verificar
                        identidad, programar citas y realizar seguimientos posteriores a la adopción.
                    </p>
                </div>

                {/* Sección 3 */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="h-5 w-5 text-emerald-600" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-slate-800`}
                        >
                            3. Protección de datos
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                        Implementamos medidas de seguridad para evitar accesos no autorizados. No
                        compartimos ni vendemos tus datos sin tu consentimiento expreso.
                    </p>
                </div>

                {/* Sección 4 */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <UserCheck className="h-5 w-5 text-emerald-600" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-slate-800`}
                        >
                            4. Derechos del usuario
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-sm text-slate-600 leading-relaxed pl-8`}>
                        Puedes solicitar la corrección, actualización o eliminación de tus datos en cualquier
                        momento escribiendo a nuestro equipo de soporte.
                    </p>
                </div>

                <div className="pt-2 text-center">
                    <p
                        className={`${poppins.className} text-sm text-slate-500 font-medium`}
                    >
                        Al continuar, confirmas que has leído esta Política de Privacidad.
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
        </ModalPremium>
    );
}