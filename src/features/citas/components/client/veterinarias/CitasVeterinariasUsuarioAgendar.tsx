"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

type Mascota = {
  mascota_id: string;
  mascota_nombre: string;
  imagen_url: string | null;
  estado_mascota: string;
};

type CalendarioCell = {
  d: number;
  fechaStr: string;
  fecha: Date;
  deshabilitado: boolean;
};

type Props = {
  mascotas: Mascota[];
  mascotaSeleccionada: Mascota | null;
  setMascotaSeleccionada: (m: Mascota | null) => void;

  fechaSeleccionada: string | null;
  setFechaSeleccionada: (f: string | null) => void;

  horaSeleccionada: string | null;
  setHoraSeleccionada: (h: string | null) => void;

  motivo: string;
  setMotivo: (m: string) => void;

  horasDisponibles: string[];
  celdas: (CalendarioCell | null)[];
  cambiarMes: (dir: "prev" | "next") => void;

  hoy: Date;
  mesActual: number;
  anioActual: number;
  nombreMes: string;

  onConfirmar: () => void;
};

export function CitasVeterinariasUsuarioAgendar({
  mascotas,
  mascotaSeleccionada,
  setMascotaSeleccionada,
  fechaSeleccionada,
  setFechaSeleccionada,
  horaSeleccionada,
  setHoraSeleccionada,
  motivo,
  setMotivo,
  horasDisponibles,
  celdas,
  cambiarMes,
  hoy,
  mesActual,
  anioActual,
  nombreMes,
  onConfirmar,
}: Props) {
  return (
    <motion.div
      key="agendar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mt-8 space-y-8"
    >
      {/* === MASCOTAS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mascotas.map((m) => (
          <div
            key={m.mascota_id}
            onClick={() => {
              setMascotaSeleccionada(m);
              setFechaSeleccionada(null);
              setHoraSeleccionada(null);
              setMotivo("");
            }}
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 shadow-impa-xs transition ${
              mascotaSeleccionada?.mascota_id === m.mascota_id
                ? "border-impa-500 bg-impa-50 shadow-impa-sm"
                : "border-impa-line bg-white hover:border-impa-300 hover:bg-impa-tinted hover:shadow-impa-sm"
            }`}
          >
            <img
              src={m.imagen_url || "/ISOTIPO IMPA.png"}
              alt={m.mascota_nombre}
              className="h-24 w-24 rounded-xl border border-impa-line object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-impa-text">
                {m.mascota_nombre}
              </h2>
              <p className="text-sm text-impa-muted">
                Estado: {m.estado_mascota}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-impa-muted">
                <MapPin size={12} className="text-impa-600" />
                IMPA - Instituto Michoacano de Proteccion Animal
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* === CONTENIDO SI HAY MASCOTA === */}
      {mascotaSeleccionada && (
        <div className="space-y-6 border-t border-impa-line pt-6">
          {/* === Fecha === */}
          <div>
            <h3 className="mb-3 font-semibold text-impa-text">
              Selecciona la fecha de tu cita
            </h3>

            {/* Navegación */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarMes("prev")}
                disabled={
                  new Date(anioActual, mesActual, 1) <=
                  new Date(hoy.getFullYear(), hoy.getMonth(), 1)
                }
              >
                <ChevronLeft size={16} />
              </Button>

              <span className="font-semibold capitalize text-impa-text">
                {nombreMes}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarMes("next")}
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Cabecera */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {["D", "L", "M", "M", "J", "V", "S"].map((d) => (
                <span
                  key={d}
                  className="text-xs font-semibold uppercase text-impa-muted"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Días */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {celdas.map((cell, idx) =>
                cell === null ? (
                  <div key={`pad-${idx}`} />
                ) : (
                  <button
                    key={cell.fechaStr}
                    disabled={cell.deshabilitado}
                    onClick={() => {
                      if (!cell.deshabilitado) {
                        setFechaSeleccionada(cell.fechaStr);
                        setHoraSeleccionada(null);
                        setMotivo("");
                      }
                    }}
                    className={`rounded-lg py-2 text-sm font-medium transition ${
                      cell.deshabilitado
                        ? "cursor-not-allowed bg-impa-bg-elevated text-impa-subtle"
                        : fechaSeleccionada === cell.fechaStr
                        ? "bg-impa-600 text-white shadow-impa-sm"
                        : "text-impa-700 hover:bg-impa-50"
                    }`}
                  >
                    {cell.d}
                  </button>
                )
              )}
            </div>

            <p className="mt-3 text-xs text-impa-muted">
              * No disponible fines de semana. Puedes agendar a partir de mañana.
            </p>
            <p className="mt-1 text-xs text-impa-muted">
              * Solo puedes agendar citas dentro de los próximos 30 días.
            </p>
          </div>

          {/* === Horarios === */}
          {fechaSeleccionada && (
            <div>
              <h3 className="mb-2 font-semibold text-impa-text">
                Selecciona un horario
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {horasDisponibles.map((hora) => (
                  <button
                    key={hora}
                    onClick={() => setHoraSeleccionada(hora)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      horaSeleccionada === hora
                        ? "border-impa-600 bg-impa-600 text-white shadow-impa-sm"
                        : "border-impa-line bg-white text-impa-700 hover:border-impa-300 hover:bg-impa-50"
                    }`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* === Motivo === */}
          {horaSeleccionada && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-impa-text">
                Motivo de la cita
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe brevemente el motivo..."
                className="h-24 w-full resize-none rounded-xl border border-impa-line bg-white p-3 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
              />
            </div>
          )}

          {/* === Confirmar === */}
          {motivo && (
            <div className="text-center">
              <Button variant="primary" size="lg" onClick={onConfirmar}>
                Confirmar cita
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
