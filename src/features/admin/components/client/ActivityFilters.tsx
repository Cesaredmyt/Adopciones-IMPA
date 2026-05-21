"use client";

import React from "react";
import { Tabs } from "@/components/ui/Tabs";
import { FileText, CalendarDays, PawPrint, Stethoscope, LayoutGrid } from "lucide-react";

type Filtro = "todo" | "documento" | "cita" | "mascota" | "esterilizacion";

const OPCIONES: { value: Filtro; label: string; icon: any }[] = [
    { value: "todo", label: "Todo", icon: LayoutGrid },
    { value: "documento", label: "Documentos", icon: FileText },
    { value: "cita", label: "Citas", icon: CalendarDays },
    { value: "mascota", label: "Mascotas", icon: PawPrint },
    { value: "esterilizacion", label: "Esterilizaciones", icon: Stethoscope },
];

export function ActividadFilters({
    filtro,
    setFiltro,
}: {
    filtro: Filtro;
    setFiltro: (f: Filtro) => void;
}) {
    return (
        <Tabs
            variant="segmented"
            size="sm"
            value={filtro}
            onChange={(v) => setFiltro(v as Filtro)}
            items={OPCIONES.map((o) => ({
                value: o.value,
                label: o.label,
                icon: o.icon,
            }))}
        />
    );
}
