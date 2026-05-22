"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { HeartHandshake, Utensils, ShieldCheck } from "lucide-react";

export default function ModalBienestar({
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
          Compromiso de Bienestar
        </h2>
        <p className="mt-2 text-sm text-impa-muted">
          Lo que significa mantener el bienestar integral de la mascota adoptada.
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="space-y-5">

        <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs">
          <div className="flex items-center gap-3 mb-2">
            <Utensils className="h-5 w-5 text-impa-600" />
            <h3 className="font-display text-xl font-semibold text-impa-text">
              Alimentación adecuada
            </h3>
          </div>
          <p className="leading-relaxed text-impa-muted">
            Te comprometes a proporcionar alimentos de calidad y en cantidades adecuadas según la especie,
            peso y necesidades de la mascota.
          </p>
        </div>

        <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-5 w-5 text-impa-600" />
            <h3 className="font-display text-xl font-semibold text-impa-text">
              Atención veterinaria
            </h3>
          </div>
          <p className="leading-relaxed text-impa-muted">
            Asegurar revisiones veterinarias, vacunación, desparasitación y atención inmediata en caso
            de enfermedad o accidente.
          </p>
        </div>

        <div className="rounded-2xl border border-impa-line bg-white p-5 shadow-impa-xs">
          <div className="flex items-center gap-3 mb-2">
            <HeartHandshake className="h-5 w-5 text-impa-600" />
            <h3 className="font-display text-xl font-semibold text-impa-text">
              Protección y no abandono
            </h3>
          </div>
          <p className="leading-relaxed text-impa-muted">
            Te comprometes a brindar un hogar seguro, evitar el abandono y garantizar que la mascota
            esté protegida contra maltrato o negligencia.
          </p>
        </div>

        <p className="pt-2 text-[15px] font-medium text-impa-muted">
          Al aceptar, confirmas tu compromiso con el bienestar físico y emocional de la mascota.
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
