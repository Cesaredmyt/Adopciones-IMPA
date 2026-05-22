"use client";
import { Stethoscope } from "lucide-react";

export default function Topbar({ onNueva }: { onNueva: () => void }) {
  void onNueva;
  return (
    <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 pt-6 md:pt-8">
      <div className="flex items-start gap-3">
        <div className="hidden h-11 w-11 place-items-center rounded-2xl bg-impa-50 text-impa-600 sm:grid">
          <Stethoscope size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold leading-tight text-impa-text md:text-3xl">
            Agenda tus <span className="text-impa-700">citas veterinarias</span>
          </h1>
          <p className="mt-1 text-[13px] text-impa-muted md:text-sm">
            Revisa tus próximas visitas y crea nuevas citas en segundos.
          </p>
        </div>
      </div>
    </div>
  );
}
