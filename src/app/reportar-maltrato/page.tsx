"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Search, ArrowRight, EyeOff, Clock, ShieldCheck } from "lucide-react";

import { ReporteFormularioPublico } from "@/features/reportes-maltrato/components/client/ReporteFormularioPublico";
import { ReporteConfirmacion } from "@/features/reportes-maltrato/components/client/ReporteConfirmacion";
import { useCrearReporte } from "@/features/reportes-maltrato/hooks/useCrearReporte";

export default function ReportarMaltratoPage() {
  const [folio, setFolio] = useState<string | null>(null);

  const crear = useCrearReporte({
    onSuccess: (folio) => setFolio(folio),
  });

  return (
    <div className="space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-impa-200 text-[11px] font-bold uppercase tracking-[0.08em] text-impa-700 shadow-impa-xs">
          <ShieldAlert size={12} />
          Plataforma IMPA · Reporte ciudadano
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-impa-text-strong tracking-tight">
          Reportar maltrato animal
        </h1>
        <p className="mt-3 text-impa-muted">
          Tu reporte es importante. Puedes hacerlo de forma anónima o
          identificada. El IMPA revisará cada caso y te dará seguimiento si nos
          dejas un medio de contacto.
        </p>

        <Link
          href="/reportar-maltrato/seguimiento"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-impa-700 hover:text-impa-800 hover:underline"
        >
          <Search size={14} />
          ¿Ya reportaste? Consulta el estado por folio
          <ArrowRight size={14} />
        </Link>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-impa-line text-impa-muted font-semibold shadow-impa-xs">
            <EyeOff size={11} className="text-impa-600" />
            100% anónimo si lo prefieres
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-impa-line text-impa-muted font-semibold shadow-impa-xs">
            <Clock size={11} className="text-impa-600" />
            Respuesta en 24-48 hrs
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-impa-line text-impa-muted font-semibold shadow-impa-xs">
            <ShieldCheck size={11} className="text-impa-600" />
            Datos protegidos
          </span>
        </div>
      </header>

      {folio ? (
        <ReporteConfirmacion folio={folio} onNuevo={() => setFolio(null)} />
      ) : (
        <ReporteFormularioPublico
          enviando={crear.isPending}
          onSubmit={(input) => crear.mutate(input)}
        />
      )}
    </div>
  );
}
