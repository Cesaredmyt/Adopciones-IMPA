"use client";

import { useMemo } from "react";
import DatePicker from "react-datepicker";
import { Calendar, X } from "lucide-react";
import type { Cita } from "../../types/cita";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;

    isSaving: boolean;

    fecha: string;
    hora: string;

    onFechaChange: (v: string) => void;
    onHoraChange: (v: string) => void;

    cita: Cita | null;
    citas: Cita[];
};

export default function CitaReprogramarModal({
    open,
    onClose,
    onSubmit,
    isSaving,
    fecha,
    hora,
    onFechaChange,
    onHoraChange,
    cita,
    citas,
}: Props) {

    

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const maxFecha = useMemo(() => {
        const f = new Date();
        f.setMonth(f.getMonth() + 1);
        f.setHours(0, 0, 0, 0);
        return f;
    }, []);


    const dateValue = useMemo(() => {
        if (!fecha) return null;
        const [y, m, d] = fecha.split("-");
        return new Date(Number(y), Number(m) - 1, Number(d));
    }, [fecha]);

    if (!open || !cita) return null;

    const horasDisponibles = [
        "08:30", "09:00", "09:30",
        "10:00", "10:30", "11:00",
        "11:30", "12:00", "12:30",
        "13:00", "13:30", "14:00",
    ];

    const ahora = new Date();
    const hoyStr = new Date().toISOString().slice(0, 10);

    const horasConEstado = horasDisponibles.map((h) => {
        const ocupado = citas.some(
            (c) =>
                c.fecha_cita === fecha &&
                c.hora_cita.slice(0, 5) === h &&
                c.estado === "programada" &&   
                c.id !== cita.id
        );


        
        let pasada = false;
        if (fecha === hoyStr) {
            const [hh, mm] = h.split(":").map(Number);
            const hDate = new Date();
            hDate.setHours(hh, mm, 0, 0);
            if (hDate <= ahora) pasada = true;
        }

        return { hora: h, ocupado, pasada };
    });

    const handleFecha = (date: Date | null) => {
        if (!date) return onFechaChange("");

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        onFechaChange(`${y}-${m}-${d}`);
        onHoraChange("");
    };

    return (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-impa-text-strong/55 backdrop-blur-md p-4 animate-fade-in cursor-default">

            {/* CONTENEDOR */}
            <div className="relative w-full max-w-lg rounded-2xl bg-white border border-impa-line shadow-impa-xl overflow-hidden animate-scale-in">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-impa-line bg-gradient-to-b from-impa-surface-2 to-white">
                    <div className="flex items-center gap-2.5">
                        <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-700">
                            <Calendar className="w-4 h-4" />
                        </span>
                        <h3 className="text-lg font-bold text-impa-text tracking-tight">Reprogramar cita</h3>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="grid place-items-center w-9 h-9 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="px-6 py-5 space-y-6">

                    {/* INFO DEL USUARIO */}
                    <div className="bg-impa-50 border border-impa-200 rounded-xl px-4 py-3">
                        <p className="text-sm text-impa-text">
                            <span className="font-semibold">
                                {cita.usuario?.nombres} {cita.usuario?.apellido_paterno} {cita.usuario?.apellido_materno}
                            </span>{" "}
                            tiene cita con{" "}
                            <span className="italic font-semibold text-impa-700">
                                {cita.mascota?.nombre}
                            </span>.
                        </p>
                        <p className="text-xs text-impa-muted mt-1">Selecciona nueva fecha y hora.</p>
                    </div>

                    {/* FECHA */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-impa-text">
                            Nueva fecha
                        </label>

                        <div className="relative cursor-pointer">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-impa-muted h-4 w-4 pointer-events-none z-[1]" />

                            <DatePicker
                                selected={dateValue}
                                onChange={handleFecha}
                                minDate={hoy}
                                maxDate={maxFecha}
                                filterDate={(d) => {
                                    const esFinDeSemana = d.getDay() === 0 || d.getDay() === 6;

                                    const dClean = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                    const hoyClean = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                                    const maxClean = new Date(maxFecha.getFullYear(), maxFecha.getMonth(), maxFecha.getDate());

                                    const dentroDeRango = dClean >= hoyClean && dClean <= maxClean;

                                    return dentroDeRango && !esFinDeSemana;
                                }}

                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecciona la fecha"
                                className="w-full h-11 pl-10 pr-10 rounded-xl border border-impa-line bg-white text-sm text-impa-text shadow-impa-xs cursor-pointer transition-[border-color,box-shadow,background-color] duration-200 ease-impa-out hover:border-impa-300 hover:bg-impa-tinted focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:bg-white"
                                wrapperClassName="w-full cursor-pointer"
                                calendarClassName="react-datepicker-full"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                portalId="datepicker-root"
                                popperPlacement="bottom-start"
                                popperClassName="z-[2000]"
                            />

                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-impa-600 opacity-60 h-4 w-4 pointer-events-none" />
                        </div>
                    </div>

                    {/* HORAS */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-impa-text">
                            Nueva hora
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                            {horasConEstado.map(({ hora: h, ocupado, pasada }) => {
                                const disabled = ocupado || pasada;

                                return (
                                    <button
                                        key={h}
                                        disabled={disabled}
                                        onClick={() => onHoraChange(h)}
                                        className={`
                                            py-2 rounded-lg border text-sm font-semibold transition-all duration-150
                                            ${disabled
                                                ? "bg-impa-surface-2 text-impa-quiet border-impa-line cursor-not-allowed"
                                                : hora === h
                                                    ? "bg-impa-cta text-white border-impa-600 shadow-impa-sm cursor-pointer"
                                                    : "bg-white text-impa-text border-impa-line shadow-impa-xs hover:bg-impa-50 hover:border-impa-300 hover:-translate-y-px cursor-pointer"
                                            }
                                        `}
                                    >
                                        {h}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 border-t border-impa-line bg-impa-surface-2/50 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="h-10 px-4 rounded-xl border border-impa-line bg-white text-sm font-semibold text-impa-text shadow-impa-xs hover:bg-impa-50 hover:border-impa-300 transition-all duration-150 cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={isSaving}
                        onClick={onSubmit}
                        className="h-10 px-4 rounded-xl bg-impa-cta text-white text-sm font-semibold shadow-impa-sm disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-impa-out cursor-pointer"
                    >
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>

            </div>
        </div>
    );
}
