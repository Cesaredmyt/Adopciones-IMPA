"use client";

import { CheckCircle2, PawPrint } from "lucide-react";
import dayjs from "dayjs";

export default function SeguimientoCard({
  seguimiento,
  index,
  onImageClick,
}: {
  seguimiento: any;
  index: number;
  onImageClick?: (url: string) => void;
}) {
  const s = seguimiento;

  const estadoLabels: Record<string, string> = {
    requiere_atencion: "Requiere Atención",
    regular: "Regular",
    bueno: "Bueno",
    excelente: "Excelente",
  };

  const estadoColors: Record<string, string> = {
    requiere_atencion: "bg-red-100 text-red-700 border-red-300",
    regular: "bg-yellow-100 text-yellow-700 border-yellow-300",
    bueno: "bg-blue-100 text-blue-700 border-blue-300",
    excelente: "bg-green-100 text-green-700 border-green-300",
  };

  const estadoTexto = estadoLabels[s.estado_mascota] ?? "No registrado";
  const estadoColor =
    estadoColors[s.estado_mascota] ??
    "bg-impa-bg-elevated text-impa-muted border-impa-line";

  return (
    <div className="rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-lg font-semibold text-impa-text">
            Seguimiento #{index + 1}
          </p>
          <p className="text-sm text-impa-muted">
            Programado para:{" "}
            <b>{dayjs(s.fecha_seguimiento).format("DD/MM/YYYY")}</b>
          </p>
        </div>

        {s.completado && (
          <CheckCircle2 className="text-green-600" size={26} />
        )}
      </div>

      {/* ESTADO */}
      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold text-impa-text">
          Estado de la mascota:
        </p>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${estadoColor}`}
        >
          {estadoTexto}
        </span>
      </div>

      {/* PROBLEMAS */}
      {Array.isArray(s.problemas_reportados) &&
        s.problemas_reportados.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-sm font-semibold text-impa-text">
              Problemas reportados:
            </p>
            <ul className="list-inside list-disc text-sm text-impa-muted">
              {s.problemas_reportados.map((p: string, idx: number) => (
                <li key={idx}>{p.replace(/^\w/, (c) => c.toUpperCase())}</li>
              ))}
            </ul>
          </div>
        )}

      {/* OBSERVACIONES */}
      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold text-impa-text">
          Observaciones del adoptante:
        </p>
        <p className="text-sm text-impa-muted">
          {s.observaciones?.replace(/^\w/, (c: string) => c.toUpperCase())}
        </p>
      </div>

      {/* RECOMENDACIONES */}
      {s.recomendaciones && (
        <div className="mb-4">
          <p className="mb-1 text-sm font-semibold text-impa-text">
            Recomendaciones:
          </p>
          <p className="text-sm text-impa-muted">
            {s.recomendaciones.replace(/^\w/, (c) => c.toUpperCase())}
          </p>
        </div>
      )}

      {/* SATISFACCION */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-semibold text-impa-text">
          Satisfacción del adoptante:
        </p>

        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <PawPrint
              key={idx}
              size={24}
              className={
                idx < (s.satisfaccion_adoptante ?? 0)
                  ? "text-impa-600"
                  : "text-impa-line"
              }
            />
          ))}
        </div>
      </div>

      {/* FOTOS */}
      {Array.isArray(s.fotos_actuales) && s.fotos_actuales.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-impa-text">
            Evidencias fotográficas:
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {s.fotos_actuales.map((url: string, j: number) => (
              <img
                key={j}
                src={url}
                className="h-28 w-full cursor-pointer rounded-lg border border-impa-line object-cover transition hover:opacity-90"
                onClick={() => onImageClick?.(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
