"use client";

import { CalendarCheck, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

type MascotaMin = {
  nombre?: string;
};

type EstadoSolicitudPendienteProps = {
  mascota?: MascotaMin | null;
  onAgendar: () => void;
  onCancelar: () => void;
  diasRestantes?: number | null;
};

export default function EstadoSolicitudPendiente({
  mascota,
  onAgendar,
  onCancelar,
  diasRestantes,
}: EstadoSolicitudPendienteProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-impa-line bg-white p-8 shadow-impa-sm">
      <div className="text-center">
        <h3 className="text-xl font-extrabold text-impa-text">
          Agenda tu visita
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-impa-muted">
          Estas a un paso de convivir con{" "}
          <span className="font-semibold text-impa-700">{mascota?.nombre}</span>.
          Elige un dia y horario para tu visita al IMPA.
        </p>

        <p className="mt-3 text-xs italic text-impa-muted">
          La conexion empieza con un primer encuentro.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 rounded-2xl border border-impa-line bg-impa-tinted p-4 shadow-impa-xs sm:p-5 lg:flex-row">
        <div className="flex-1 space-y-3 text-center lg:text-left">
          <h4 className="flex items-center justify-center gap-2 text-base font-extrabold text-impa-text sm:text-lg lg:justify-start">
            <MapPin className="h-4 w-4 text-impa-600" />
            Instituto Michoacano de Proteccion Animal (IMPA)
          </h4>

          <p className="mx-auto max-w-[360px] text-xs leading-relaxed text-impa-muted sm:text-sm lg:mx-0">
            Elige una fecha y horario para tu visita.
          </p>

          <div className="space-y-1.5 text-xs text-impa-muted sm:text-sm">
            <p className="flex items-center justify-center gap-2 font-semibold lg:justify-start">
              <MapPin size={14} className="text-impa-600" />
              Alamos No. 395, Col. Centenario, Morelia
            </p>
            <p className="flex items-center justify-center gap-2 font-semibold lg:justify-start">
              <Phone size={14} className="text-impa-600" />
              443 321 4731 / 443 321 1392
            </p>
            <p className="flex items-center justify-center gap-2 lg:justify-start">
              <Clock size={14} className="text-impa-600" />
              <strong>Horario:</strong> 8:30 AM a 2:00 PM
            </p>
            <p className="flex items-center justify-center gap-2 lg:justify-start">
              <CalendarCheck size={14} className="text-impa-600" />
              <strong>Dias:</strong> Lunes a Viernes
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-impa-line bg-white shadow-impa-xs lg:w-56">
          <div className="relative h-32 w-full sm:h-36">
            <iframe
              title="IMPA Mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.2406524803994!2d-101.1734343!3d19.7266529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86a28e98ea321735%3A0x191bd93c0bd16085!2sCentro%20de%20Atenci%C3%B3n%20Animal!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            <a
              href="https://www.google.com/maps/place/Centro+de+Atenci%C3%B3n+Animal/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 cursor-pointer bg-transparent"
              title="Abrir en Google Maps"
            />
          </div>

          <div className="p-3 text-center">
            <h5 className="text-xs font-bold text-impa-text">
              Ubicacion del IMPA
            </h5>
            <p className="mt-1 text-[11px] leading-relaxed text-impa-muted">
              Haz clic en el mapa para abrir la ubicacion en Google Maps.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          onClick={onAgendar}
          variant="primary"
          className="w-full gap-2 px-8 py-4 sm:w-auto"
        >
          <CalendarCheck className="h-5 w-5" />
          Agendar cita
        </Button>

        <Button
          onClick={onCancelar}
          variant="outline"
          className="w-full px-8 py-4 sm:w-auto"
        >
          Cancelar solicitud
        </Button>
      </div>

      {diasRestantes !== null && diasRestantes !== undefined && (
        <p className="text-center text-xs font-semibold text-impa-700">
          Tu solicitud expira en{" "}
          {diasRestantes > 0
            ? `${diasRestantes} dias`
            : "0 dias (expirada)"}
        </p>
      )}
    </div>
  );
}
