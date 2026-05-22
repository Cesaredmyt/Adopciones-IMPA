"use client";

import { CalendarCheck, PawPrint, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import { isWeekend } from "date-fns";

import type { SolicitudActiva } from "@/features/citas/types/solicitud-activa";

type FormularioAgendarCitaProps = {
    solicitudActiva: SolicitudActiva;
    fecha: string;
    fechaDate: Date | undefined;
    horaSeleccionada: string;
    horasOcupadas: string[];

    setFecha: (v: string) => void;
    setFechaDate: (v: Date | undefined) => void;
    setHoraSeleccionada: (v: string) => void;

    confirmarCita: () => void;
    setPaso: (v: "inicio") => void;

    horaEsPasada: (hora: string, fecha?: Date) => boolean;
    confirmarCitaMutation: { isPending: boolean };

    showSoftToast: (msg: string) => void;
};

export default function FormularioAgendarCita({
    solicitudActiva,
    fecha,
    fechaDate,
    horaSeleccionada,
    horasOcupadas,
    setFecha,
    setFechaDate,
    setHoraSeleccionada,
    confirmarCita,
    setPaso,
    horaEsPasada,
    confirmarCitaMutation,
    showSoftToast,
}: FormularioAgendarCitaProps) {
    const mascota = solicitudActiva.mascota;

    return (
        <section className="rounded-2xl border border-impa-line bg-white p-5 text-impa-text shadow-impa-sm sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-3 text-2xl font-extrabold text-impa-text sm:text-3xl">
                    <PawPrint className="h-5 w-5 text-impa-600" />
                    Cita para {mascota?.nombre}
                </h3>

                <Button
                    variant="ghost"
                    onClick={() => setPaso("inicio")}
                    className="cursor-pointer text-impa-700 hover:bg-impa-50"
                >
                    Regresar
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Mascota */}
                <div className="flex flex-col items-center rounded-2xl border border-impa-line bg-impa-tinted p-5 text-center shadow-impa-xs">
                    <img
                        src={mascota?.imagen_url || "/ISOTIPO IMPA.png"}
                        alt={mascota?.nombre ?? "Mascota"}
                        className="mb-4 h-40 w-40 rounded-xl border border-impa-line object-cover shadow-impa-sm"
                    />
                    <h4 className="text-lg font-bold text-impa-text">
                        {mascota?.nombre}
                    </h4>
                    <p className="mt-1 text-sm text-impa-muted">
                        <MapPin className="inline h-4 w-4 text-impa-600" /> IMPA Morelia
                    </p>
                </div>

                {/* Selección */}
                <div className="space-y-6">
                    {/* Fecha */}
                    <div>
                        <label className="block text-sm font-extrabold mb-3">
                            Selecciona la fecha
                        </label>

                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={fechaDate}
                                onSelect={(day: Date | undefined) => {
                                    const hoy = new Date();
                                    hoy.setHours(0, 0, 0, 0);

                                    const limite = new Date();
                                    limite.setMonth(limite.getMonth() + 1);
                                    limite.setHours(0, 0, 0, 0);

                                    // Sin fecha → limpiar todo
                                    if (!day) {
                                        setFechaDate(undefined);
                                        setFecha("");
                                        setHoraSeleccionada("");
                                        return;
                                    }

                                    // Más de 1 mes
                                    if (day > limite) {
                                        showSoftToast(
                                            "Solo puedes agendar dentro del próximo mes 📅"
                                        );
                                        setFechaDate(undefined);
                                        setFecha("");
                                        setHoraSeleccionada("");
                                        return;
                                    }

                                    // Nueva fecha válida → limpiar hora previa
                                    setHoraSeleccionada("");
                                    setFechaDate(day);

                                    const year = day.getFullYear();
                                    const month = String(day.getMonth() + 1).padStart(2, "0");
                                    const d = String(day.getDate()).padStart(2, "0");
                                    setFecha(`${year}-${month}-${d}`);
                                }}
                                disabled={(date) => {
                                    const hoy = new Date();
                                    hoy.setHours(0, 0, 0, 0);

                                    const dia = new Date(date);
                                    dia.setHours(0, 0, 0, 0);

                                    return isWeekend(dia) || dia < hoy;
                                }}
                            />
                        </div>
                    </div>

                    {/* Horas */}
                    <div>
                        <label className="block text-sm font-extrabold mb-2">
                            Hora disponible
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
                                "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
                            ].map((hora) => {
                                const deshabilitada =
                                    !fecha ||
                                    horaEsPasada(hora, fechaDate) ||
                                    horasOcupadas.includes(hora);

                                return (
                                    <button
                                        key={hora}
                                        disabled={deshabilitada}
                                        onClick={() => {
                                            if (!fecha) {
                                                showSoftToast("Selecciona una fecha primero 📅");
                                                return;
                                            }
                                            setHoraSeleccionada(hora);
                                        }}
                                        className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition
                      ${deshabilitada
                                                ? "opacity-40 cursor-not-allowed"
                                                : horaSeleccionada === hora
                                                    ? "bg-impa-500 text-white shadow-impa-xs"
                                                    : "border-impa-line bg-white text-impa-700 hover:border-impa-300 hover:bg-impa-50"
                                            }`}
                                    >
                                        {hora}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Confirmar */}
                    <Button
                        disabled={
                            !fecha ||
                            !horaSeleccionada ||
                            confirmarCitaMutation.isPending
                        }
                        onClick={confirmarCita}
                        variant="primary"
                        className="w-full cursor-pointer"
                    >
                        <CalendarCheck className="h-5 w-5 mr-2" />
                        Confirmar cita
                    </Button>
                </div>
            </div>
        </section>
    );
}
