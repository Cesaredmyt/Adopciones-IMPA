"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { PhoneCall, Home } from "lucide-react";

export default function ModalSeguimiento({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ModalPremium open={open} onClose={onClose}>
      {/* HEADER */}
      <div className="mb-6 rounded-2xl border border-impa-line bg-impa-tinted p-6 shadow-impa-sm">
        <h2 className="font-display text-3xl font-bold text-impa-text">
          Seguimiento del IMPA
        </h2>
        <p className="mt-2 text-sm text-impa-muted">
          Información sobre las visitas y llamadas posteriores a la adopción.
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="space-y-5">

        <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs">
          <div className="flex items-center gap-3 mb-2">
            <PhoneCall className="h-5 w-5 text-impa-600" />
            <h3 className="font-display text-xl font-semibold text-impa-text">
              ¿Qué es el seguimiento?
            </h3>
          </div>
          <p className="leading-relaxed text-impa-muted">
            El seguimiento consiste en llamadas telefónicas o visitas programadas por personal del
            IMPA para verificar el estado y bienestar de la mascota adoptada.
          </p>
        </div>

        <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs">
          <div className="flex items-center gap-3 mb-2">
            <Home className="h-5 w-5 text-impa-600" />
            <h3 className="font-display text-xl font-semibold text-impa-text">
              ¿Por qué se realizan?
            </h3>
          </div>
          <p className="leading-relaxed text-impa-muted">
            Las visitas y llamadas permiten asegurar que la mascota se encuentra en un ambiente sano,
            seguro y adecuado. Este proceso forma parte del compromiso de protección animal.
          </p>
        </div>

        <p className="pt-2 text-[15px] font-medium text-impa-muted">
          Al aceptar, reconoces que el IMPA podrá contactarte para validar el bienestar de la mascota.
        </p>
      </div>

      {/* BOTÓN FINAL */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="cursor-pointer rounded-xl bg-impa-500 px-5 py-2 font-medium text-white shadow-impa-sm transition hover:bg-impa-600 hover:shadow-impa-md"
        >
          Cerrar
        </button>
      </div>
    </ModalPremium>
  );
}
