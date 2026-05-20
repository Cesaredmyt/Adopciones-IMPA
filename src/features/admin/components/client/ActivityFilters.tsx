"use client";

import React from "react";

type Filtro = "todo" | "documento" | "cita" | "mascota" | "esterilizacion";

const OPCIONES: { value: Filtro; label: string }[] = [
    { value: "todo", label: "Todo" },
    { value: "documento", label: "Documentos" },
    { value: "cita", label: "Citas" },
    { value: "mascota", label: "Mascotas" },
    { value: "esterilizacion", label: "Esterilizaciones" },
];

export function ActividadFilters({
    filtro,
    setFiltro,
}: {
    filtro: Filtro;
    setFiltro: (f: Filtro) => void;
}) {
    return (
        <div className="flex gap-2 sm:gap-3 min-w-max px-1 pb-1 border-b border-[#eadacb]">
            {OPCIONES.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => setFiltro(value)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-t-md text-sm font-semibold transition-all duration-200 border-b-2 ${
                        filtro === value
                            ? "border-[#BC5F36] text-[#BC5F36] bg-[#fff8f4]"
                            : "border-transparent text-[#7a5c49] hover:text-[#BC5F36]"
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
