"use client";

import Link from "next/link";
import { CheckCircle2, Copy, Search } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  folio: string;
  onNuevo: () => void;
};

export function ReporteConfirmacion({ folio, onNuevo }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(folio);
      setCopiado(true);
      toast.success("Folio copiado al portapapeles");
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      toast.error("No se pudo copiar el folio");
    }
  };

  return (
    <div className="bg-white border border-impa-line rounded-2xl shadow-impa-md p-8 text-center space-y-5">
      <div className="grid place-items-center w-16 h-16 mx-auto rounded-full bg-impa-50 border border-impa-200 text-impa-600">
        <CheckCircle2 size={32} />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-impa-text-strong">
          Reporte enviado
        </h2>
        <p className="text-impa-muted mt-1 max-w-xl mx-auto">
          Gracias por reportar. El equipo del IMPA revisará tu caso y, si
          dejaste datos de contacto, te avisaremos del avance.
        </p>
      </div>

      <div className="bg-impa-surface-2 border border-impa-line rounded-xl p-4 max-w-md mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-wider text-impa-700">
          Tu folio de seguimiento
        </p>
        <p className="text-3xl font-black text-impa-text-strong tracking-wider mt-1">
          {folio}
        </p>
        <button
          onClick={copiar}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-impa-line bg-white text-impa-text text-xs font-semibold hover:bg-impa-50 hover:border-impa-300 transition-colors cursor-pointer"
        >
          <Copy size={12} />
          {copiado ? "Copiado" : "Copiar folio"}
        </button>
      </div>

      <p className="text-xs text-impa-muted max-w-xl mx-auto">
        Guarda este folio. Lo necesitarás para consultar el estado del reporte.
      </p>

      <div className="flex flex-col sm:flex-row sm:justify-center gap-2 pt-2">
        <Button variant="outline" onClick={onNuevo}>
          Reportar otro caso
        </Button>
        <ButtonLink
          variant="primary"
          href={`/reportar-maltrato/seguimiento?folio=${encodeURIComponent(folio)}`}
        >
          <Search size={14} className="mr-1" />
          Consultar mi reporte
        </ButtonLink>
      </div>
    </div>
  );
}
