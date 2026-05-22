"use client";

import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type EstadoSolicitudEnProcesoProps = {
  solicitudId: string;
  loading: boolean;
  onIrFormulario: () => void;
};

export default function EstadoSolicitudEnProceso({
  solicitudId,
  loading,
  onIrFormulario,
}: EstadoSolicitudEnProcesoProps) {
  void solicitudId;

  return (
    <div className="mt-8 animate-fade-in rounded-2xl border border-impa-line bg-impa-tinted p-8 shadow-impa-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-impa-500 text-white shadow-impa-sm">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-impa-text">
            Estas a un paso de adoptar
          </h3>
          <p className="mt-1 text-sm text-impa-muted">
            Ya realizaste tu cita y tu solicitud esta en proceso.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm leading-relaxed text-impa-muted sm:text-base">
          Solo falta completar el{" "}
          <strong className="text-impa-700">formulario final de adopcion</strong>.
          Esto permitira al equipo del IMPA continuar con la evaluacion.
        </p>

        <p className="text-sm italic text-impa-muted">
          Un paso mas para darle un hogar lleno de carino.
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={onIrFormulario}
          disabled={loading}
          variant="primary"
          className="flex items-center gap-2 px-6 py-3"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Cargando...
            </>
          ) : (
            <>
              <FileText className="h-5 w-5" />
              Completar formulario
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
