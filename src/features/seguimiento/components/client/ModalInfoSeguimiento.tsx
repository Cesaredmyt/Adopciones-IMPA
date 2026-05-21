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
      title="¿Cómo funciona el seguimiento? 🐾"
      maxWidth="max-w-lg"
      bg="bg-[#f6f8f6]"
      border="border-[#E5D1B8]"
      padding="p-6"
    >
      <div className="text-[#5C3D2E] text-[15px] leading-relaxed space-y-5">

        {/* Intro */}
        <div className="flex gap-3 items-start">
          <PawPrint size={20} className="text-[#17cf17] mt-1 flex-shrink-0" />
          <p className="font-medium">
            El seguimiento nos permite asegurar la{" "}
            <span className="text-[#0f830f] font-semibold">
              adaptación y bienestar
            </span>{" "}
            de tu mascota durante los primeros meses después de la adopción.
          </p>
        </div>

        {/* Título de sección */}
        <p className="font-bold text-[#0f830f] text-base">
          Estas son las revisiones programadas:
        </p>

        {/* Lista con bullets personalizados */}
        <ul className="space-y-2 pl-1">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#17cf17] mt-2"></span>
            <p>
              <b>1 semana:</b> revisión inicial del estado general.
            </p>
          </li>

          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#17cf17] mt-2"></span>
            <p>
              <b>1 mes:</b> adaptación al hogar y familia.
            </p>
          </li>

          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#17cf17] mt-2"></span>
            <p>
              <b>2 meses:</b> evaluación intermedia del desarrollo.
            </p>
          </li>

          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#17cf17] mt-2"></span>
            <p>
              <b>6 meses:</b> seguimiento final y cierre del proceso.
            </p>
          </li>
        </ul>

        {/* Mensaje final */}
        <div className="flex gap-3 items-start">
          <Heart size={20} className="text-[#17cf17] mt-1 flex-shrink-0" />
          <p className="font-medium">
            Nuestro objetivo es asegurarnos de que tu mascota esté{" "}
            <span className="text-[#0f830f] font-semibold">
              sana, estable y feliz
            </span>{" "}
            en su nuevo hogar. 🏡💗
          </p>
        </div>
      </div>
    </ModalPremium>
  );
}
