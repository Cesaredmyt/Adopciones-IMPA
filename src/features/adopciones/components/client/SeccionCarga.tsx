"use client";

import React, { useRef, useState } from "react";
import {
    FileCheck2,
    FileUp,
    Upload,
    File as FileIcon,
    X,
    ExternalLink,
    CreditCard,
    Home,
    BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface SeccionCargaProps {
    archivos: Record<string, File | undefined>;
    docs?: {
        tipo: string;
        estado: string;
        motivo_rechazo?: string;
        url?: string;
    }[];
    onPick: (id: string, file?: File) => void;
    onEnviar: () => void;
    deshabilitarEnviar: boolean;
}

type DocDef = {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
};

const DOCUMENTOS: DocDef[] = [
    {
        id: "identificacion",
        label: "Identificación oficial (INE)",
        description: "INE vigente por ambos lados, legible y en color.",
        icon: CreditCard,
    },
    {
        id: "comprobante",
        label: "Comprobante de domicilio",
        description: "Recibo de luz, agua o predial con antigüedad menor a 3 meses.",
        icon: Home,
    },
    {
        id: "curp",
        label: "CURP",
        description: "Constancia oficial impresa desde gob.mx.",
        icon: BadgeCheck,
    },
];

export default function SeccionCarga({
    archivos,
    docs = [],
    onPick,
    onEnviar,
    deshabilitarEnviar,
}: SeccionCargaProps) {
    const getDocInfo = (tipo: string) => docs.find((d) => d.tipo === tipo);
    const hasRechazados = docs.some((d) => d.estado === "rechazado");

    return (
        <section className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm">
            {/* Hairline superior */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

            {/* Header */}
            <header className="flex flex-col gap-1 px-5 sm:px-6 py-5 border-b border-impa-line bg-gradient-to-b from-impa-surface-2/60 to-white">
                <div className="flex items-center gap-2.5">
                    <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-600 shadow-impa-xs">
                        <Upload size={16} />
                    </span>
                    <div>
                        <h3 className="text-[15px] sm:text-base font-bold text-impa-text-strong tracking-tight">
                            Sube tus documentos
                        </h3>
                        <p className="text-xs sm:text-[13px] text-impa-muted leading-tight">
                            Adjunta los archivos requeridos. Un administrador IMPA los revisará.
                        </p>
                    </div>
                </div>
            </header>

            {/* Lista de documentos */}
            <div className="p-4 sm:p-5 space-y-3">
                {DOCUMENTOS.map((doc) => {
                    const info = getDocInfo(doc.id);
                    const estado = info?.estado;
                    const motivo = info?.motivo_rechazo;
                    const puedeSubir =
                        !estado || estado === "rechazado" || estado === "sin_documentos";
                    const nuevoArchivo = archivos[doc.id];

                    return (
                        <DocumentoRow
                            key={doc.id}
                            doc={doc}
                            estado={estado}
                            motivo={motivo}
                            urlActual={info?.url}
                            nuevoArchivo={nuevoArchivo}
                            puedeSubir={puedeSubir}
                            onPick={(f) => onPick(doc.id, f)}
                            onClear={() => onPick(doc.id, undefined)}
                        />
                    );
                })}
            </div>

            {/* Footer con CTA */}
            <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-t border-impa-line bg-impa-surface-2/40">
                <p className="text-xs text-impa-muted flex items-center gap-1.5">
                    <FileIcon size={13} className="text-impa-quiet" />
                    PDF, JPG o PNG · Máximo 5 MB por archivo.
                </p>
                <Button
                    variant="cta"
                    disabled={deshabilitarEnviar}
                    onClick={onEnviar}
                    className="cursor-pointer"
                >
                    <FileCheck2 className="h-4 w-4" />
                    {hasRechazados ? "Reenviar rechazados" : "Enviar para revisión"}
                </Button>
            </footer>
        </section>
    );
}

/* ============================================================
   Fila individual de documento — drag-drop + estado + acciones
   ============================================================ */
function DocumentoRow({
    doc,
    estado,
    motivo,
    urlActual,
    nuevoArchivo,
    puedeSubir,
    onPick,
    onClear,
}: {
    doc: DocDef;
    estado?: string;
    motivo?: string;
    urlActual?: string;
    nuevoArchivo?: File;
    puedeSubir: boolean;
    onPick: (file: File) => void;
    onClear: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const Icon = doc.icon;
    const tieneArchivo = !!nuevoArchivo;

    const containerTone =
        estado === "aprobado"
            ? "border-emerald-200 bg-impa-success-soft/40"
            : estado === "pendiente"
            ? "border-amber-200 bg-impa-warning-soft/40"
            : estado === "rechazado"
            ? "border-red-200 bg-impa-danger-soft/40"
            : tieneArchivo
            ? "border-impa-300 bg-impa-tinted/60"
            : "border-impa-line bg-impa-surface-2/40";

    const handleFiles = (files: FileList | null) => {
        const f = files?.[0];
        if (f && puedeSubir) onPick(f);
    };

    return (
        <div
            className={cn(
                "relative rounded-xl border p-4 transition-all duration-200 ease-impa-out",
                containerTone,
                dragOver && puedeSubir && "border-impa-500 ring-4 ring-impa-500/15 bg-impa-tinted"
            )}
            onDragOver={(e) => {
                if (!puedeSubir) return;
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
                if (!puedeSubir) return;
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
            }}
        >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Icono + nombre */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                        className={cn(
                            "grid place-items-center w-10 h-10 rounded-xl border shrink-0 transition-colors duration-200",
                            estado === "aprobado"
                                ? "bg-white border-emerald-200 text-impa-success"
                                : estado === "pendiente"
                                ? "bg-white border-amber-200 text-impa-warning"
                                : estado === "rechazado"
                                ? "bg-white border-red-200 text-impa-danger"
                                : "bg-white border-impa-line text-impa-600"
                        )}
                    >
                        <Icon size={18} />
                    </span>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-impa-text-strong leading-tight">
                                {doc.label}
                            </p>
                            {estado && <StatusBadge estado={estado} size="xs" />}
                        </div>

                        <p className="text-xs text-impa-muted mt-0.5 leading-relaxed">
                            {doc.description}
                        </p>

                        {/* Motivo de rechazo destacado */}
                        {estado === "rechazado" && motivo && (
                            <div className="mt-2 rounded-lg border border-red-200 bg-impa-danger-soft px-3 py-2 text-xs text-impa-danger-ink leading-relaxed">
                                <span className="font-bold">Motivo del rechazo:</span> {motivo}
                            </div>
                        )}

                        {/* Archivo nuevo seleccionado */}
                        {nuevoArchivo && (
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-impa-300 bg-white px-3 py-2 shadow-impa-xs">
                                <FileIcon size={14} className="text-impa-600 shrink-0" />
                                <span className="text-xs font-semibold text-impa-text truncate flex-1">
                                    {nuevoArchivo.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={onClear}
                                    aria-label="Quitar archivo"
                                    className="grid place-items-center w-6 h-6 rounded-md text-impa-muted hover:bg-impa-surface-3 hover:text-impa-text transition-colors duration-150 cursor-pointer"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        )}

                        {/* Link al archivo previamente subido */}
                        {urlActual?.startsWith("http") && !nuevoArchivo && (
                            <a
                                href={urlActual}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-impa-700 hover:text-impa-800 mt-2 underline-offset-4 hover:underline cursor-pointer"
                            >
                                <ExternalLink size={11} />
                                Ver archivo actual
                            </a>
                        )}
                    </div>
                </div>

                {/* Botón de selección */}
                <div className="flex sm:flex-col items-stretch gap-2 sm:w-auto w-full">
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                        disabled={!puedeSubir}
                    />
                    <Button
                        variant={tieneArchivo ? "outline" : puedeSubir ? "soft" : "ghost"}
                        size="sm"
                        disabled={!puedeSubir}
                        onClick={() => puedeSubir && inputRef.current?.click()}
                        className="cursor-pointer whitespace-nowrap"
                        title={
                            !puedeSubir
                                ? "Este documento ya fue aprobado, no es posible cambiarlo"
                                : tieneArchivo
                                ? "Reemplazar archivo"
                                : "Arrastra aquí o haz clic para seleccionar"
                        }
                    >
                        <FileUp size={14} />
                        {tieneArchivo
                            ? "Reemplazar"
                            : puedeSubir
                            ? "Seleccionar archivo"
                            : "No editable"}
                    </Button>
                </div>
            </div>

            {/* Hint drag-drop solo cuando se puede subir y aún no hay archivo */}
            {puedeSubir && !tieneArchivo && (
                <p className="mt-3 text-[11px] text-impa-quiet flex items-center gap-1.5">
                    <Upload size={11} />
                    También puedes arrastrar y soltar el archivo aquí.
                </p>
            )}
        </div>
    );
}
