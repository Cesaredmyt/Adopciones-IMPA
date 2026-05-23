"use client";

import { motion } from "framer-motion";
import { Clock, XCircle, Info } from "lucide-react";
import dynamic from "next/dynamic";
import PanelEstado from "./PanelEstado";

import type {
    DocumentoUsuario,
    EstadoDocumentos,
} from "@/features/adopciones/types/documentos";

const SeccionCarga = dynamic(() => import("./SeccionCarga"), {
    ssr: false,
});

interface DocumentosSectionProps {
    estado: EstadoDocumentos;
    documentos: DocumentoUsuario[];
    archivos: Record<string, File | undefined>;
    onPick: (id: string, file?: File) => void;
    onEnviar: () => void;
    deshabilitarEnviar: boolean;
}

export default function DocumentosSection({
    estado,
    documentos,
    archivos,
    onPick,
    onEnviar,
    deshabilitarEnviar,
}: DocumentosSectionProps) {
    /* ---------------- Rechazado ---------------- */
    if (estado === "rechazado") {
        const docsNormalizados = documentos.map((doc) => ({
            ...doc,
            motivo_rechazo: doc.motivo_rechazo ?? undefined,
            url: doc.url ?? undefined,
        }));

        return (
            <div className="space-y-4">
                <PanelEstado
                    tone="danger"
                    icon={<XCircle className="h-6 w-6" />}
                    title="Documentos rechazados"
                    desc="Uno o más de tus documentos requieren corrección. Revisa el motivo de cada uno y vuelve a subir los archivos marcados."
                />

                <SeccionCarga
                    archivos={archivos}
                    docs={docsNormalizados}
                    onPick={onPick}
                    onEnviar={onEnviar}
                    deshabilitarEnviar={deshabilitarEnviar}
                />
            </div>
        );
    }

    /* ---------------- Sin documentos ---------------- */
    if (estado === "sin_documentos") {
        const docsNormalizados = documentos.map((doc) => ({
            ...doc,
            motivo_rechazo: doc.motivo_rechazo ?? undefined,
            url: doc.url ?? undefined,
        }));

        return (
            <div className="space-y-4">
                <SeccionCarga
                    archivos={archivos}
                    docs={docsNormalizados}
                    onPick={onPick}
                    onEnviar={onEnviar}
                    deshabilitarEnviar={deshabilitarEnviar}
                />

                {/* FAQs */}
                <section className="relative overflow-hidden rounded-2xl border border-impa-line bg-white p-5 sm:p-6 text-impa-text shadow-impa-sm">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

                    <div className="flex items-center gap-2.5">
                        <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-info-soft border border-sky-200 text-impa-info">
                            <Info className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-bold tracking-tight text-impa-text-strong">
                            Preguntas frecuentes
                        </h3>
                    </div>
                    <ul className="mt-4 grid gap-2 text-sm text-impa-muted pl-1">
                        <li className="flex items-start gap-2">
                            <span className="impa-dot bg-impa-500 mt-1.5 shrink-0" />
                            Formatos aceptados: <strong className="text-impa-text">PDF, JPG, PNG</strong>. Tamaño máximo 5 MB.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="impa-dot bg-impa-500 mt-1.5 shrink-0" />
                            La revisión la realiza un administrador IMPA en un plazo de 24-48 hrs hábiles.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="impa-dot bg-impa-500 mt-1.5 shrink-0" />
                            Si hay observaciones, podrás corregir y reenviar solo los documentos marcados.
                        </li>
                    </ul>
                </section>
            </div>
        );
    }

    /* ---------------- En revisión ---------------- */
    if (estado === "en_revision") {
        return (
            <section className="relative overflow-hidden rounded-2xl border border-impa-200 bg-gradient-to-br from-white via-impa-tinted to-white p-10 text-center shadow-impa-sm">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-full bg-impa-cta blur-2xl opacity-20 scale-150"
                            aria-hidden
                        />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white border-2 border-impa-200 shadow-impa-sm"
                        >
                            <Clock className="h-8 w-8 text-impa-600" />
                        </motion.div>
                    </div>

                    <div className="space-y-1.5">
                        <h2 className="text-lg sm:text-xl font-bold text-impa-text-strong tracking-tight">
                            Tus documentos están en revisión
                        </h2>
                        <p className="max-w-md mx-auto text-sm text-impa-muted leading-relaxed">
                            Un administrador IMPA revisará que todo esté correcto. Te avisaremos por
                            correo cuando hayan sido aprobados o requieran corrección.
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-impa-info-soft border border-sky-200 text-[11px] font-bold uppercase tracking-wider text-impa-info-ink">
                        <span className="impa-dot bg-impa-info impa-pulse-ring" />
                        Tiempo estimado: 24-48 hrs
                    </span>
                </div>
            </section>
        );
    }

    /* ---------------- Aprobado ---------------- */
    return null;
}
