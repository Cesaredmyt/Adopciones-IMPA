"use client";

import React from "react";
import { FileText, CalendarDays, PawPrint, Stethoscope, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTimeAgo(fechaStr: string) {
    const fecha = new Date(fechaStr);
    const diffMs = Date.now() - fecha.getTime();
    const minutos = Math.floor(diffMs / 60000);
    if (minutos < 1) return "justo ahora";
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    return `hace ${dias} día${dias > 1 ? "s" : ""}`;
}

const colorByTipo: Record<string, { bg: string; text: string; border: string }> = {
    documento:       { bg: "bg-impa-warning-soft", text: "text-impa-warning-ink",  border: "border-amber-200" },
    cita:            { bg: "bg-impa-info-soft",    text: "text-impa-info-ink",     border: "border-sky-200" },
    mascota:         { bg: "bg-impa-50",           text: "text-impa-700",          border: "border-impa-200" },
    esterilizacion:  { bg: "bg-impa-accent-soft",  text: "text-impa-accent-ink",   border: "border-impa-accent" },
};

export function ActivityItem({
    tipo,
    mensaje,
    fecha,
}: {
    tipo: string;
    mensaje: string;
    fecha: string;
}) {
    const iconos: Record<string, React.ReactNode> = {
        documento: <FileText className="h-4 w-4" />,
        cita: <CalendarDays className="h-4 w-4" />,
        mascota: <PawPrint className="h-4 w-4" />,
        esterilizacion: <Stethoscope className="h-4 w-4" />,
    };
    const c = colorByTipo[tipo] || { bg: "bg-impa-surface-3", text: "text-impa-muted", border: "border-impa-line" };

    return (
        <li className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 border-b border-impa-line-faint last:border-0 transition-colors duration-150">
            <span className={cn("grid place-items-center w-9 h-9 rounded-lg border shrink-0 transition-transform duration-200 group-hover:scale-105", c.bg, c.text, c.border)}>
                {iconos[tipo] ?? <Activity className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-sm text-impa-text leading-snug">{mensaje}</p>
                <p className="text-xs text-impa-quiet mt-0.5">{formatTimeAgo(fecha)}</p>
            </div>
        </li>
    );
}
