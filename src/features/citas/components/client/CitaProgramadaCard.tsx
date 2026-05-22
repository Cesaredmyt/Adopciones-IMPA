"use client";

import { CalendarCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CitaProgramada } from "@/features/citas/types/cita-programada";

type CitaProgramadaCardProps = {
  cita: CitaProgramada;
  onCancelar: (citaId: string) => void;
  onAbrirModal: () => void;
};

export default function CitaProgramadaCard({
  cita,
  onCancelar,
  onAbrirModal,
}: CitaProgramadaCardProps) {
  const [y, m, d] = cita.fecha_cita.split("-").map(Number);
  const fechaOK = new Date(y, m - 1, d);
  const fechaTexto = fechaOK.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl border border-impa-line bg-impa-tinted p-8 text-impa-text shadow-impa-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <img
          src={cita.mascota?.imagen_url || "/ISOTIPO IMPA.png"}
          alt={cita.mascota?.nombre || "Mascota"}
          className="h-48 w-48 rounded-xl border border-impa-line object-cover shadow-impa-sm"
        />

        <div className="flex-1 text-center md:text-left">
          <h3 className="flex items-center justify-center gap-2 text-xl font-extrabold text-impa-text md:justify-start">
            <CalendarCheck className="h-5 w-5 text-impa-600" />
            Tienes una cita programada
          </h3>

          <p className="mt-2 text-sm text-impa-muted">
            Te esperamos en el <strong className="text-impa-700">IMPA</strong>{" "}
            para conocer a <span className="font-semibold">{cita.mascota?.nombre}</span>.
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
            <div className="rounded-xl border border-impa-line bg-white px-5 py-3 shadow-impa-xs">
              <p className="flex items-center gap-2 text-sm text-impa-muted">
                <CalendarCheck className="h-4 w-4 text-impa-600" />
                <strong className="text-impa-text">Fecha:</strong>{" "}
                <span className="font-semibold text-impa-700">{fechaTexto}</span>
              </p>

              <p className="mt-1 flex items-center gap-2 text-sm text-impa-muted">
                <Clock className="h-4 w-4 text-impa-600" />
                <strong className="text-impa-text">Hora:</strong>{" "}
                <span className="font-semibold text-impa-700">
                  {cita.hora_cita.slice(0, 5)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                onCancelar(cita.id);
                onAbrirModal();
              }}
            >
              Cancelar cita
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
