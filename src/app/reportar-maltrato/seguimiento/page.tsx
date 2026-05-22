"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

import { ReporteSeguimientoPublico } from "@/features/reportes-maltrato/components/client/ReporteSeguimientoPublico";

function SeguimientoContent() {
  const params = useSearchParams();
  const folio = params.get("folio") ?? undefined;

  return (
    <ReporteSeguimientoPublico folioInicial={folio} />
  );
}

export default function SeguimientoPage() {
  return (
    <div className="space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-impa-200 text-[11px] font-bold uppercase tracking-[0.08em] text-impa-700 shadow-impa-xs">
          <Search size={12} />
          Consulta de reporte
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-impa-text-strong tracking-tight">
          Seguimiento de tu reporte
        </h1>
        <p className="mt-3 text-impa-muted">
          Ingresa el folio que recibiste y el correo o teléfono que usaste al
          reportar para ver el estado actual de tu caso.
        </p>

        <Link
          href="/reportar-maltrato"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-impa-700 hover:text-impa-800 hover:underline"
        >
          <ArrowLeft size={14} />
          Volver al formulario de reporte
        </Link>
      </header>

      <Suspense
        fallback={
          <p className="text-sm text-impa-muted text-center">Cargando...</p>
        }
      >
        <SeguimientoContent />
      </Suspense>
    </div>
  );
}
