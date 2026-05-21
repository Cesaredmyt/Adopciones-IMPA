"use client";
import { Stethoscope } from "lucide-react";

export default function Topbar({ onNueva }: { onNueva: () => void }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 pt-6 md:pt-8">
      <div className="flex items-start gap-3">
        <div className="hidden sm:grid h-11 w-11 place-items-center rounded-2xl bg-[#ecfdec] text-[#17cf17]">
          <Stethoscope size={20} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#111811]">
            Agenda tus <span className="text-[#17cf17]">citas veterinarias</span>
          </h1>
          <p className="mt-1 text-[13px] md:text-sm text-[#6b4d3e]">
            Revisa tus próximas visitas y crea nuevas citas en segundos.
          </p>
        </div>
      </div>
    </div>
  );
}
