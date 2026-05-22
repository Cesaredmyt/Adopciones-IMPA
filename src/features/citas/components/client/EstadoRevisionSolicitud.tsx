"use client";

import { FileText } from "lucide-react";

export default function EstadoRevisionSolicitud() {
  return (
    <div className="mt-8 animate-fade-in rounded-2xl border border-impa-line bg-impa-tinted p-8 shadow-impa-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-impa-500 text-white shadow-impa-sm">
          <FileText className="h-7 w-7" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-impa-text">
            Tu formulario esta en revision
          </h3>
          <p className="mt-1 text-sm text-impa-muted">
            Ya completaste el formulario de adopcion. El equipo del IMPA esta
            revisando tu informacion. Por favor espera la confirmacion final.
          </p>
        </div>
      </div>

      <div className="mt-5 text-sm leading-relaxed text-impa-muted">
        Te avisaremos cuando tu proceso avance al siguiente paso.
      </div>
    </div>
  );
}
