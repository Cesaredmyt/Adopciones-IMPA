"use client";

import {
    Mail,
    Phone,
    MapPin,
    UserCircle,
    PawPrint,
    BriefcaseBusiness,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UserModal({
    open,
    user,
    direccion,
    adopciones,
    solicitudesActivas,
    isLoading,
    onClose,
}: {
    open: boolean;
    user: any;
    direccion: any;
    adopciones: any[];
    solicitudesActivas: any[];
    isLoading: boolean;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[900] bg-impa-text-strong/55 backdrop-blur-md flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 140, damping: 18 }}
                        className="relative w-full max-w-2xl bg-white rounded-3xl border border-impa-line shadow-impa-xl overflow-hidden"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* Subtle top highlight */}
                        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

                        {/* HEADER */}
                        <header className="flex items-center justify-between px-6 py-5 bg-gradient-to-b from-impa-surface-2 to-white border-b border-impa-line">
                            <h2 className="text-lg font-bold text-impa-text tracking-tight">
                                Información del usuario
                            </h2>
                            <button
                                onClick={onClose}
                                aria-label="Cerrar"
                                className="grid place-items-center w-9 h-9 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/15"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </header>

                        {/* CONTENT */}
                        <div className="px-6 py-6 max-h-[72vh] overflow-y-auto custom-scroll space-y-8">

                            {/* ===== PERFIL ===== */}
                            {isLoading ? (
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-16 w-16 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="h-16 w-16 rounded-2xl border border-impa-line bg-gradient-to-br from-impa-50 to-white grid place-items-center text-impa-600 shadow-impa-sm">
                                        <UserCircle className="h-9 w-9" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-impa-text leading-tight tracking-tight">
                                            {user.nombres} {user.apellido_paterno}{" "}
                                            {user.apellido_materno || ""}
                                        </h3>
                                        <p className="text-xs text-impa-muted mt-1">
                                            ID {user.id.slice(0, 6)}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ===== INFO DE CONTACTO ===== */}
                            <div className="space-y-4 bg-impa-surface-2/50 border border-impa-line rounded-2xl p-5 shadow-impa-xs">
                                {isLoading ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-4 w-60" />
                                        <Skeleton className="h-4 w-44" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                                        <h4 className="font-bold text-impa-700 text-[11px] uppercase tracking-[0.08em] border-b border-impa-line-faint pb-2 mb-3">
                                            Información de contacto
                                        </h4>

                                        <div className="space-y-3 text-sm text-impa-text mt-1">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-impa-600 shrink-0" />
                                                <span>{user.email}</span>
                                            </div>

                                            {user.telefono && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-4 w-4 text-impa-600 shrink-0" />
                                                    <span>{user.telefono}</span>
                                                </div>
                                            )}

                                            {user.ocupacion && (
                                                <div className="flex items-center gap-3">
                                                    <BriefcaseBusiness className="h-4 w-4 text-impa-600 shrink-0" />
                                                    <span>{user.ocupacion}</span>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-4 w-4 mt-1 text-impa-600 shrink-0" />
                                                {direccion ? (
                                                    <div className="leading-snug">
                                                        <p>
                                                            {direccion.calle}{" "}
                                                            {direccion.numero_exterior}{" "}
                                                            {direccion.colonia}
                                                        </p>
                                                        <p>
                                                            {direccion.municipio},{" "}
                                                            {direccion.estado},{" "}
                                                            CP {direccion.codigo_postal}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-impa-muted">Sin dirección registrada.</p>
                                                )}
                                            </div>

                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* ===== MASCOTAS EN PROCESO ===== */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-impa-text text-[11px] uppercase tracking-[0.08em]">
                                    Mascotas en proceso de adopción
                                </h4>

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(Math.min((solicitudesActivas?.length || 1), 2))].map((_, i) => (
                                            <div key={i} className="flex gap-4 p-4 border border-impa-line bg-white rounded-2xl">
                                                <Skeleton className="h-[80px] w-[80px] rounded-xl" />
                                                <div className="space-y-2 w-full">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : solicitudesActivas.length === 0 ? (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-impa-muted text-sm">
                                        No tiene solicitudes de adopción activas.
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        {solicitudesActivas.map((s: any) => (
                                            <div
                                                key={s.id}
                                                className="flex gap-4 border border-impa-line bg-white rounded-2xl p-4 shadow-impa-xs hover:shadow-impa-md hover:border-impa-line-strong transition-all duration-200"
                                            >
                                                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-impa-surface-2 border border-impa-line shrink-0">
                                                    {s.mascota?.imagen_url ? (
                                                        <img
                                                            src={
                                                                s.mascota.imagen_url.startsWith("http")
                                                                    ? s.mascota.imagen_url
                                                                    : "/ISOTIPO IMPA.png"
                                                            }
                                                            alt={s.mascota.nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full grid place-items-center text-impa-600 opacity-80">
                                                            <PawPrint className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col justify-center">
                                                    <p className="font-semibold text-impa-text text-sm">{s.mascota?.nombre}</p>
                                                    <p className="text-xs text-impa-muted">
                                                        Fecha: {new Date(s.fecha_creada).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-impa-700 font-semibold capitalize mt-1">
                                                        Estado: {s.estado.replace("_", " ")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            {/* ===== ADOPCIONES ===== */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-impa-text text-[11px] uppercase tracking-[0.08em]">
                                    Mascotas adoptadas
                                </h4>

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(Math.min((adopciones?.length || 1), 2))].map((_, i) => (
                                            <div key={i} className="flex gap-4 p-4 border border-impa-line bg-white rounded-2xl">
                                                <Skeleton className="h-[80px] w-[80px] rounded-xl" />
                                                <div className="space-y-2 w-full">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : adopciones.length === 0 ? (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-impa-muted text-sm">
                                        Este usuario no ha adoptado ninguna mascota.
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        {adopciones.map((a) => (
                                            <div
                                                key={a.id}
                                                className="flex gap-4 border border-impa-line bg-white rounded-2xl p-4 shadow-impa-xs hover:shadow-impa-md hover:border-impa-line-strong transition-all duration-200"
                                            >
                                                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-impa-surface-2 border border-impa-line shrink-0">
                                                    {a.imagen_url ? (
                                                        <img
                                                            src={
                                                                a.imagen_url.startsWith("http")
                                                                    ? a.imagen_url
                                                                    : "/ISOTIPO IMPA.png"
                                                            }
                                                            alt={a.mascota_nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full grid place-items-center text-impa-600 opacity-80">
                                                            <PawPrint className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col justify-center">
                                                    <p className="font-semibold text-impa-text text-sm">{a.mascota_nombre}</p>
                                                    <p className="text-xs text-impa-muted">Fecha: {a.fecha_adopcion}</p>
                                                    <p className="text-xs text-impa-700 font-semibold capitalize mt-1">{a.estado}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
