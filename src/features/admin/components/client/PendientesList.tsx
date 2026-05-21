"use client";

import React from "react";
import { ClipboardList, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function PendientesList({
    pendientes,
    loading,
    onNavigate,
}: {
    pendientes: { id: number; descripcion: string; link: string }[];
    loading: boolean;
    onNavigate: (link: string) => void;
}) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 text-impa-muted text-sm">
                <Loader2 className="animate-spin h-4 w-4" /> Cargando tareas…
            </div>
        );
    }

    if (pendientes.length === 0) {
        return (
            <EmptyState
                variant="minimal"
                icon={<CheckCircle2 size={24} className="text-impa-500" />}
                title="¡Todo al día!"
                description="No hay tareas pendientes por ahora."
            />
        );
    }

    return (
        <ul className="divide-y divide-impa-line-faint">
            {pendientes.map((p, i) => (
                <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 group stagger-item"
                    style={{ ['--i' as any]: i }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="grid place-items-center w-9 h-9 rounded-lg bg-impa-50 border border-impa-100 text-impa-600 shrink-0 transition-transform duration-200 group-hover:scale-105">
                            <ClipboardList className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-impa-text truncate">{p.descripcion}</span>
                    </div>

                    <button
                        onClick={() => onNavigate(p.link)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-impa-700 hover:text-impa-800 px-3 py-1.5 rounded-lg hover:bg-impa-50 transition-colors duration-150 cursor-pointer shrink-0"
                    >
                        Revisar
                        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                </li>
            ))}
        </ul>
    );
}
