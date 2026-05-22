"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Lightbulb,
  PawPrint,
} from "lucide-react";
import MascotaSeleccionadaCard from "./MascotaSeleccionadaCard";
import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type { CitaAdopcion } from "@/features/adopciones/types/proceso-adopcion";
import type { SolicitudAdopcionUI } from "@/features/adopciones/types/solicitud";

interface SolicitudPendienteSectionProps {
  solicitudActiva: SolicitudAdopcionUI;
  citaActiva: CitaAdopcion | null;
  estado: EstadoDocumentos;
  onCancelar: () => void;
}

export default function SolicitudPendienteSection({
  solicitudActiva,
  citaActiva,
  estado,
  onCancelar,
}: SolicitudPendienteSectionProps) {
  const router = useRouter();
  const [mostrarAgendar, setMostrarAgendar] = useState(false);

  return (
    <div className="mb-4 mt-5 rounded-2xl border border-impa-line bg-impa-tinted p-5 shadow-impa-sm">
      <h3 className="flex items-center gap-2 text-sm font-extrabold text-impa-700">
        <PawPrint className="h-4 w-4" /> Solicitud pendiente
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-impa-muted">
        Ya tienes una solicitud activa. Ahora puedes continuar con el proceso y
        agendar tu cita para conocer a <strong>tu mascota seleccionada</strong>.
      </p>

      {solicitudActiva?.mascota_id && (
        <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-[500px_1fr] lg:gap-10">
          <div className="hidden lg:col-span-2 lg:block">
            <button
              onClick={() => router.push("/dashboards/usuario/citas")}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-impa-500 py-3.5 text-base font-semibold text-white shadow-impa-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-impa-600 hover:shadow-impa-md active:scale-[0.99]"
            >
              <CalendarDays size={18} />
              Agendar visita
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full rounded-2xl border border-impa-line bg-white/90 p-5 shadow-impa-sm backdrop-blur-md">
              <MascotaSeleccionadaCard
                mascota={solicitudActiva.mascota}
                onCancelar={onCancelar}
              />
            </div>

            <div className="mt-4 lg:hidden">
              <button
                onClick={() => setMostrarAgendar(!mostrarAgendar)}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-impa-500 py-3 text-sm font-semibold text-white shadow-impa-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-impa-600 active:scale-[0.99]"
              >
                {mostrarAgendar ? "Ocultar detalles" : "Ver informacion de la visita"}
              </button>
            </div>
          </div>

          <div className="relative space-y-6">
            <div className="absolute bottom-0 left-2 top-0 hidden w-px bg-gradient-to-b from-impa-line to-transparent lg:block" />

            <div className="space-y-6 pl-0 lg:pl-8">
              {(mostrarAgendar ||
                typeof window === "undefined" ||
                window.innerWidth >= 1024) && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-impa-line bg-white/90 p-5 shadow-impa-sm backdrop-blur-md">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-impa-text">
                      <CalendarDays size={17} className="text-impa-600" />
                      Que sigue ahora?
                    </h3>

                    <ul className="space-y-2 text-xs leading-relaxed text-impa-muted">
                      <li>- Agenda tu visita para convivir con tu mascota.</li>
                      <li>- El IMPA evaluara como interactuan.</li>
                      <li>- Si es aprobada, llenaras el formulario final.</li>
                      <li>- Luego un administrador revisara tu informacion.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-impa-line bg-white/90 p-5 shadow-impa-sm backdrop-blur-md">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-impa-text">
                      <BookOpenCheck size={17} className="text-sky-600" />
                      Estado de tu proceso
                    </h4>

                    <div className="grid gap-2 text-xs text-impa-muted">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-impa-600" />
                        Mascota seleccionada
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight size={15} className="text-impa-600" />
                        Pendiente agendar visita
                      </div>
                      <div className="flex items-center gap-2 opacity-70">
                        <Clock3 size={15} />
                        Formulario despues de la visita
                      </div>
                      <div className="flex items-center gap-2 opacity-70">
                        <Clock3 size={15} />
                        Aprobacion final
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/85 p-6 shadow-impa-sm">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-impa-text">
                      <Lightbulb size={18} className="text-amber-600" />
                      Consejos para tu visita
                    </h4>

                    <ul className="space-y-3 text-xs leading-relaxed text-impa-muted">
                      <li>- Llega 10 a 15 minutos antes.</li>
                      <li>- Puedes traer fotos del hogar.</li>
                      <li>- Manten vacunas al dia si tienes mascotas.</li>
                      <li>- Se tu mismo, la convivencia es lo mas importante.</li>
                    </ul>
                  </div>

                  {estado === "aprobado" && !citaActiva && (
                    <button
                      onClick={() => router.push("/dashboards/usuario/citas")}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-impa-500 py-3 text-sm font-semibold text-white shadow-impa-sm transition-all duration-200 hover:bg-impa-600 active:scale-[0.99] lg:hidden"
                    >
                      <CalendarDays size={16} />
                      Agendar visita
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
