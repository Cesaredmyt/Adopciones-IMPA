"use client";
import { Search, ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
    q: string;
    onQ: (v: string) => void;
    especie: string;
    onEspecie: (v: string) => void;
    sexo: string;
    onSexo: (v: string) => void;
    ESPECIES: readonly string[];
};

type Opt = { label: string; value: string };

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, onClose]);
}

function MenuSelect({
    value,
    onChange,
    options,
    ariaLabel,
}: {
    value: string;
    onChange: (v: string) => void;
    options: Opt[];
    ariaLabel: string;
}) {
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    useClickOutside(boxRef, () => setOpen(false));

    const current = options.find((o) => o.value === value) ?? options[0];

    return (
        <div className="relative w-full" ref={boxRef}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    "flex items-center justify-between gap-2 w-full h-11 px-3.5 rounded-xl border text-sm font-medium cursor-pointer",
                    "transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out",
                    "bg-white shadow-impa-xs hover:bg-impa-tinted hover:border-impa-300",
                    "focus-visible:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15",
                    open ? "border-impa-500 ring-4 ring-impa-500/15 bg-white" : "border-impa-line"
                )}
            >
                <span className={cn("truncate", current.value === options[0].value ? "text-impa-muted" : "text-impa-text")}>
                    {current.label}
                </span>
                <ChevronDown
                    size={16}
                    className={cn("text-impa-muted transition-transform duration-200 shrink-0", open && "rotate-180")}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-xl bg-white border border-impa-line shadow-impa-lg overflow-hidden animate-fade-slide p-1"
                >
                    {options.map((opt) => {
                        const active = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                role="option"
                                aria-selected={active}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer",
                                    "transition-colors duration-150",
                                    active
                                        ? "bg-impa-50 text-impa-700 font-semibold"
                                        : "text-impa-text hover:bg-impa-surface-3"
                                )}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function Filters({ q, onQ, especie, onEspecie, sexo, onSexo, ESPECIES }: Props) {
    const especieOpts: Opt[] = [
        { label: "Todas las especies", value: "Todas" },
        ...ESPECIES.map((e) => ({ label: e, value: e })),
    ];
    const sexoOpts: Opt[] = [
        { label: "Ambos sexos", value: "Todos" },
        { label: "Macho", value: "Macho" },
        { label: "Hembra", value: "Hembra" },
    ];

    return (
        <section className="grid gap-3 sm:grid-cols-[1fr_220px_200px] my-5">
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-impa-muted pointer-events-none"
                />
                <input
                    value={q}
                    onChange={(e) => onQ(e.target.value)}
                    placeholder="Busca por nombre, raza o descripción…"
                    className={cn(
                        "w-full h-11 pl-10 pr-9 rounded-xl border border-impa-line bg-white text-sm text-impa-text shadow-impa-xs",
                        "transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out",
                        "placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-tinted",
                        "focus-visible:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15 focus-visible:bg-white"
                    )}
                />
                {q && (
                    <button
                        onClick={() => onQ("")}
                        aria-label="Limpiar búsqueda"
                        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-7 h-7 rounded-md text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <MenuSelect value={especie} onChange={onEspecie} options={especieOpts} ariaLabel="Filtrar por especie" />
            <MenuSelect value={sexo} onChange={onSexo} options={sexoOpts} ariaLabel="Filtrar por sexo" />
        </section>
    );
}
