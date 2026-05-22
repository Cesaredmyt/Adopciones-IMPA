"use client";

import { CalendarCheck, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

import type { CitaProgramada } from "@/features/citas/types/cita-programada";

type ConfirmacionCitaProps = {
  cita: CitaProgramada;
  onFinalizar: () => void;
};

export default function ConfirmacionCita({
  cita,
  onFinalizar,
}: ConfirmacionCitaProps) {
  const fechaTexto = new Date(cita.fecha_cita + "T00:00:00").toLocaleDateString(
    "es-MX",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <section className="rounded-2xl border border-impa-line bg-white p-10 text-impa-text shadow-impa-sm">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-impa-500 text-white shadow-impa-md">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-impa-text">
            Cita confirmada
          </h3>
          <p className="mt-1 text-base text-impa-muted">
            Tu visita ha sido agendada exitosamente. Te esperamos en el{" "}
            <span className="font-semibold text-impa-700">IMPA</span>; por favor
            llega <strong>10 minutos antes</strong>.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-2xl border border-impa-line bg-impa-tinted p-6 text-center shadow-impa-xs transition-all duration-300 hover:border-impa-200 hover:shadow-impa-sm">
          <img
            src={cita.mascota?.imagen_url || "/ISOTIPO IMPA.png"}
            alt={cita.mascota?.nombre || "Mascota"}
            className="mb-4 h-56 w-56 rounded-xl border border-impa-line object-cover shadow-impa-sm transition-transform hover:scale-[1.02]"
          />
          <h4 className="mb-1 text-xl font-bold text-impa-text">
            {cita.mascota?.nombre}
          </h4>
          <p className="mb-3 text-sm text-impa-muted">
            Estado actual:{" "}
            <span className="font-semibold text-impa-700">
              {cita.mascota?.estado === "en_proceso"
                ? "Esperando por ti"
                : cita.mascota?.estado}
            </span>
          </p>

          <div className="mt-3 text-sm">
            <p className="flex items-center justify-center gap-1 text-impa-text">
              <MapPin className="h-4 w-4 text-impa-600" />
              <strong>IMPA - Instituto Michoacano de Proteccion Animal</strong>
            </p>
            <p className="mt-1 text-xs text-impa-muted">
              Av. Acueducto 1234, Morelia, Michoacan
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl border border-impa-line bg-impa-tinted p-8 shadow-impa-xs transition-all duration-300 hover:border-impa-200 hover:shadow-impa-sm">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-impa-text">
            <CalendarCheck className="h-5 w-5 text-impa-600" />
            Detalles de tu cita
          </h4>

          <div className="space-y-3 text-base text-impa-muted">
            <p className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-impa-600" />
              <strong>Fecha:</strong>{" "}
              <span className="font-semibold text-impa-700">{fechaTexto}</span>
            </p>

            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-impa-600" />
              <strong>Hora:</strong>{" "}
              <span className="font-semibold text-impa-700">
                {cita.hora_cita.slice(0, 5)}
              </span>
            </p>
          </div>

          <div className="mt-6 border-t border-impa-line pt-4 text-sm leading-relaxed text-impa-muted">
            <p>
              Si necesitas reprogramar tu cita, comunicate con el equipo del{" "}
              <span className="font-medium text-impa-700">IMPA</span> o
              cancelala desde tu panel de usuario.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button onClick={onFinalizar} variant="primary" size="lg" className="px-12">
          Finalizar
        </Button>
      </div>
    </section>
  );
}
