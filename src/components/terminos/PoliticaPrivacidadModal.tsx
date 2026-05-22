"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { Shield, FileText, Lock, UserCheck } from "lucide-react";

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
            <div className="mb-6 rounded-2xl border border-impa-line bg-impa-tinted p-6 shadow-impa-sm">
                <h2
                    className="font-display text-3xl md:text-4xl font-bold text-impa-text"
                >
                    Política de Privacidad
                </h2>
                <p
                    className="mt-2 text-sm leading-relaxed text-impa-muted"
                >
                    Cómo protegemos y utilizamos tu información personal.
                </p>
            </div>

            {/* CONTENIDO */}
            <div className="space-y-4">

                {/* Sección 1 */}
                <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-impa-600" />
                        <h3
                            className="font-display text-xl font-semibold text-impa-text"
                        >
                            1. Información que recopilamos
                        </h3>
                    </div>
                    <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                        Recopilamos datos como nombre, correo electrónico, dirección, documentos
                        oficiales y cualquier información necesaria para evaluar solicitudes de adopción.
                    </p>
                </div>

                {/* Sección 2 */}
                <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-impa-600" />
                        <h3
                            className="font-display text-xl font-semibold text-impa-text"
                        >
                            2. Uso de los datos
                        </h3>
                    </div>
                    <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                        Utilizamos tu información únicamente para gestionar solicitudes, verificar
                        identidad, programar citas y realizar seguimientos posteriores a la adopción.
                    </p>
                </div>

                {/* Sección 3 */}
                <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="h-5 w-5 text-impa-600" />
                        <h3
                            className="font-display text-xl font-semibold text-impa-text"
                        >
                            3. Protección de datos
                        </h3>
                    </div>
                    <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                        Implementamos medidas de seguridad para evitar accesos no autorizados. No
                        compartimos ni vendemos tus datos sin tu consentimiento expreso.
                    </p>
                </div>

                {/* Sección 4 */}
                <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <UserCheck className="h-5 w-5 text-impa-600" />
                        <h3
                            className="font-display text-xl font-semibold text-impa-text"
                        >
                            4. Derechos del usuario
                        </h3>
                    </div>
                    <p className="pl-8 text-sm leading-relaxed text-impa-muted">
                        Puedes solicitar la corrección, actualización o eliminación de tus datos en cualquier
                        momento escribiendo a nuestro equipo de soporte.
                    </p>
                </div>

                <div className="pt-2 text-center">
                    <p
                        className="text-sm font-medium text-impa-muted"
                    >
                        Al continuar, confirmas que has leído esta Política de Privacidad.
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
        </ModalPremium>
    );
}
