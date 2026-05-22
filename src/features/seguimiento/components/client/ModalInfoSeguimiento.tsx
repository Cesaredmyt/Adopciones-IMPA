"use client";

import { PawPrint, Heart } from "lucide-react";
import ModalPremium from "@/components/ui/ModalPremium";

export default function ModalInfoSeguimiento({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ModalPremium
      open={open}
      onClose={onClose}
      title="Como funciona el seguimiento"
      maxWidth="max-w-lg"
      bg="bg-impa-bg"
      border="border-impa-line"
      padding="p-6"
    >
      <div className="space-y-5 text-[15px] leading-relaxed text-impa-muted">

        {/* Intro */}
        <div className="flex gap-3 items-start">
          <PawPrint size={20} className="mt-1 flex-shrink-0 text-impa-600" />
          <p className="font-medium">
            El seguimiento nos permite asegurar la{" "}
            <span className="font-semibold text-impa-700">
              adaptación y bienestar
            </span>{" "}
            de tu mascota durante los primeros meses después de la adopción.
          </p>
        </div>

        {/* Título de sección */}
        <p className="text-base font-bold text-impa-text">
          Estas son las revisiones programadas:
        </p>

        {/* Lista con bullets personalizados */}
        <ul className="space-y-2 pl-1">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-2 w-2 rounded-full bg-impa-500"></span>
            <p>
              <b>1 semana:</b> revisión inicial del estado general.
            </p>
          </li>

          <li className="flex items-start gap-2">
            <span className="mt-2 h-2 w-2 rounded-full bg-impa-500"></span>
            <p>
              <b>1 mes:</b> adaptación al hogar y familia.
            </p>
          </li>

          <li className="flex items-start gap-2">
            <span className="mt-2 h-2 w-2 rounded-full bg-impa-500"></span>
            <p>
              <b>2 meses:</b> evaluación intermedia del desarrollo.
            </p>
          </li>

          <li className="flex items-start gap-2">
            <span className="mt-2 h-2 w-2 rounded-full bg-impa-500"></span>
            <p>
              <b>6 meses:</b> seguimiento final y cierre del proceso.
            </p>
          </li>
        </ul>

        {/* Mensaje final */}
        <div className="flex gap-3 items-start">
          <Heart size={20} className="mt-1 flex-shrink-0 text-impa-600" />
          <p className="font-medium">
            Nuestro objetivo es asegurarnos de que tu mascota esté{" "}
            <span className="font-semibold text-impa-700">
              sana, estable y feliz
            </span>{" "}
            en su nuevo hogar. 🏡💗
          </p>
        </div>
      </div>
    </ModalPremium>
  );
}
