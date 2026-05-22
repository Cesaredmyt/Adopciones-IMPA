"use client";

import { useState } from "react";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { consultarReportePublico } from "@/features/reportes-maltrato/actions/reportes-actions";
import {
  ReporteEstadoBadge,
  ReporteGravedadBadge,
} from "./ReporteEstadoBadge";
import type {
  EstadoReporte,
  GravedadReporte,
} from "@/features/reportes-maltrato/types/reporte";

type ConsultaResultado =
  | {
      folio: string;
      estado: EstadoReporte;
      gravedad: GravedadReporte;
      created_at: string;
      resolucion: string | null;
      asunto: string;
    }
  | null
  | "no_encontrado";

type Props = {
  folioInicial?: string;
};

export function ReporteSeguimientoPublico({ folioInicial }: Props) {
  const [folio, setFolio] = useState(folioInicial ?? "");
  const [contacto, setContacto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<ConsultaResultado>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (!folio.toUpperCase().startsWith("REP-")) {
      setError("El folio debe empezar con REP-");
      return;
    }
    if (contacto.trim().length < 3) {
      setError("Indica tu correo o teléfono.");
      return;
    }

    setCargando(true);
    try {
      const r = await consultarReportePublico({ folio: folio.trim(), contacto: contacto.trim() });
      setResultado(r ?? "no_encontrado");
    } catch (err: any) {
      setError(err?.message ?? "Error al consultar el reporte.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-impa-line rounded-2xl shadow-impa-sm p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
              Folio *
            </span>
            <input
              type="text"
              value={folio}
              onChange={(e) => setFolio(e.target.value.toUpperCase())}
              placeholder="REP-01000"
              className={inputClass}
              required
            />
          </label>

          <label className="block text-sm">
            <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
              Correo o teléfono usado *
            </span>
            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              placeholder="tucorreo@ejemplo.com o 4431234567"
              className={inputClass}
              required
            />
          </label>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={cargando}>
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Consultar
              </>
            )}
          </Button>
        </div>
      </form>

      {resultado === "no_encontrado" && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 text-sm text-yellow-800">
          No encontramos un reporte con ese folio y datos de contacto. Verifica
          que el folio y el correo/teléfono coincidan con los que usaste al
          reportar.
        </div>
      )}

      {resultado && resultado !== "no_encontrado" && (
        <article className="bg-white border border-impa-line rounded-2xl shadow-impa-sm overflow-hidden">
          <header className="px-5 py-4 bg-impa-surface-2 border-b border-impa-line flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-impa-700">{resultado.folio}</span>
              <ReporteGravedadBadge gravedad={resultado.gravedad} />
            </div>
            <ReporteEstadoBadge estado={resultado.estado} />
          </header>

          <div className="p-5 space-y-3 text-sm">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-impa-quiet">
                Asunto
              </p>
              <p className="text-impa-text font-medium">{resultado.asunto}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-impa-quiet">
                Recibido
              </p>
              <p className="text-impa-muted">
                {format(
                  new Date(resultado.created_at),
                  "EEEE d 'de' MMMM yyyy, h:mm a",
                  { locale: es }
                )}
              </p>
            </div>
            {resultado.resolucion ? (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-impa-quiet">
                  Resolución del IMPA
                </p>
                <p className="bg-impa-50 border border-impa-100 rounded-lg p-3 text-impa-text whitespace-pre-wrap">
                  {resultado.resolucion}
                </p>
              </div>
            ) : (
              <p className="text-xs text-impa-muted italic">
                Tu reporte aún está en proceso. Te contactaremos en cuanto haya
                novedades.
              </p>
            )}
          </div>
        </article>
      )}
    </div>
  );
}

const inputClass =
  "w-full border border-impa-line rounded-md px-3 py-2 bg-white text-impa-text focus:outline-none focus:ring-2 focus:ring-impa-500/30 focus:border-impa-500";
