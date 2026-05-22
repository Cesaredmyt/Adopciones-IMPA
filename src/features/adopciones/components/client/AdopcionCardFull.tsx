"use client";
import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {X} from "lucide-react";
import type {AdopcionAdminRow} from "@/features/adopciones/types/adopciones";
import {Button} from "@/components/ui/Button";

// 🧩 Helpers
function capitalize(str?: string | null): string {
    if (!str) return "—";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatText(str?: string | null): string {
    if (!str) return "—";
    return capitalize(str.replace(/_/g, " "));
}

export default function AdopcionCardFull({
    adopcion,
    open,
    onClose,
    onAprobar,
    onRechazar,
}: {
    adopcion: AdopcionAdminRow | null;
    open: boolean;
    onClose: () => void;
    onAprobar: (id: string) => void;
    onRechazar: (id: string) => void;
}) {
    if (!adopcion) return null;

    // 🎨 Estado con color y texto formateado
    const estadoClase =
        adopcion.estado === "pendiente"
            ? "bg-amber-50 text-amber-700 border border-amber-200"
            : adopcion.estado === "aprobada"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200";

    const estadoTexto = capitalize(adopcion.estado);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="overlay"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-impa-text-strong/55 backdrop-blur-md px-4 py-8"
                    onClick={onClose}
                >
                    <motion.article
                        key="card"
                        initial={{opacity: 0, scale: 0.95, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.95, y: 20}}
                        transition={{duration: 0.25}}
                        className="relative z-10 w-[min(1100px,92vw)] max-h-[90vh] bg-white rounded-3xl shadow-impa-xl grid md:grid-cols-2 overflow-hidden border border-impa-line"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 🐾 Columna izquierda */}
                        <div className="relative h-full bg-impa-surface-2">
                            <img
                                src={adopcion.mascotaImagen || adopcion.evidencias?.[0] || "/ISOTIPO IMPA.png"}
                                alt={adopcion.mascotaNombre ?? "Mascota"}
                                className="w-full h-full object-cover"
                            />

                            {/* Botón cerrar */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-impa-text shadow-impa-md transition-all duration-200 hover:bg-white hover:shadow-impa-lg"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Nombre e info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white px-6 py-4">
                                <h2 className="text-2xl font-bold">
                                    {capitalize(adopcion.mascotaNombre ?? "Mascota")}
                                </h2>
                                <p className="text-sm text-white/80">
                                    {capitalize(adopcion.usuarioNombre ?? "Adoptante")}
                                </p>
                            </div>
                        </div>

                        {/* 📄 Columna derecha */}
                        <div className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[90vh] text-impa-text custom-scroll bg-gradient-to-b from-white to-impa-surface-2/40">
                            <section className="space-y-4">
                                {/* Estado */}
                                <div className="flex flex-wrap gap-2">
                                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${estadoClase}`}>
                                        {estadoTexto}
                                    </span>
                                </div>

                                {/* Datos principales */}
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                                    <div>
                                        <dt className="font-semibold text-impa-muted">Tipo de vivienda</dt>
                                        <dd>{formatText(adopcion.tipo_vivienda)}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-impa-muted">Espacio disponible</dt>
                                        <dd>{formatText(adopcion.espacio_disponible)}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-impa-muted">Otras mascotas</dt>
                                        <dd>{adopcion.otras_mascotas ? "Sí" : "No"}</dd>
                                    </div>
                                </dl>

                                {/* Observaciones del adoptante */}
                                {adopcion.observaciones_usuario && (
                                    <div className="mt-3">
                                        <h3 className="font-semibold text-impa-text mb-1">
                                            Observaciones del adoptante
                                        </h3>
                                        <p className="text-sm text-impa-muted">
                                            {capitalize(adopcion.observaciones_usuario)}
                                        </p>
                                    </div>
                                )}

                                {/* Observaciones del admin */}
                                {adopcion.observaciones_admin && (
                                    <div className="mt-3">
                                        <h3 className="font-semibold text-impa-text mb-1">
                                            Observaciones del administrador
                                        </h3>
                                        <p className="text-sm text-impa-muted">
                                            {capitalize(adopcion.observaciones_admin)}
                                        </p>
                                    </div>
                                )}

                                {/* Galería de evidencias */}
                                <div className="mt-6 border-t border-impa-line pt-4">
                                    <h3 className="font-semibold text-impa-text mb-2">Evidencias del hogar</h3>
                                    {adopcion.evidencias?.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {adopcion.evidencias.map((url, i) => (
                                                <a
                                                    key={i}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block border border-impa-line rounded-xl overflow-hidden shadow-impa-xs hover:border-impa-300 transition-colors"
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`Evidencia ${i + 1}`}
                                                        className="w-full h-32 object-cover hover:opacity-90 transition"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-impa-muted">Sin fotos</p>
                                    )}
                                </div>
                            </section>

                            {/* Botones finales */}
                            {adopcion.estado === "pendiente" && (
                                <div className="mt-6 flex justify-end gap-3 border-t border-impa-line pt-4">
                                    <Button variant="destructive" size="sm" onClick={() => onRechazar(adopcion.id)}>
                                        Rechazar
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => onAprobar(adopcion.id)}>
                                        Aprobar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.article>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
