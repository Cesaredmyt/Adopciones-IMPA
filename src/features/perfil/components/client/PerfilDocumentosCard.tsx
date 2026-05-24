"use client";

import { FileCheck, FileText, ExternalLink, FileX } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import type { Documento } from "@/features/perfil/types/perfil";

/**
 * Sección "Documentos" del Perfil — lista de documentos aprobados.
 * Cards horizontales con icono + tipo + acción "Ver documento".
 */
export default function PerfilDocumentosCard({
  documentos,
}: {
  documentos: Documento[];
}) {
  const total = documentos?.length ?? 0;

  return (
    <section
      id="documentos"
      className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm scroll-mt-24"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      <header className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-impa-line">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-600 shadow-impa-xs">
            <FileCheck size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-impa-text-strong leading-tight">
              Documentos aprobados
            </h2>
            <p className="text-xs text-impa-muted leading-tight">
              Archivos validados por el equipo IMPA.
            </p>
          </div>
        </div>
        {total > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-impa-50 border border-impa-200 text-xs font-bold text-impa-700">
            <FileText size={11} />
            {total}
          </span>
        )}
      </header>

      <div className="p-5 sm:p-6">
        {total === 0 ? (
          <EmptyState
            variant="minimal"
            icon={<FileX size={24} />}
            title="Sin documentos aprobados"
            description="Cuando subas y un administrador apruebe tus documentos, aparecerán aquí para descarga."
            action={
              <ButtonLink href="/dashboards/usuario/adopcion" variant="outline" size="sm">
                Subir documentos
              </ButtonLink>
            }
          />
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documentos.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 rounded-xl border border-impa-line bg-white p-3 shadow-impa-xs transition-all duration-200 hover:shadow-impa-sm hover:border-impa-line-strong"
              >
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-impa-success-soft border border-emerald-200 text-impa-success shrink-0">
                  <FileCheck size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-impa-text-strong capitalize truncate">
                    {d.tipo ?? "Documento"}
                  </p>
                  <p className="text-[11px] text-impa-muted truncate">
                    {d.created_at
                      ? new Date(d.created_at).toLocaleDateString()
                      : "Sin fecha"}
                  </p>
                </div>
                {d.url && (
                  <button
                    type="button"
                    onClick={() => window.open(d.url!, "_blank")}
                    aria-label="Ver documento"
                    title="Ver documento"
                    className="shrink-0 grid place-items-center w-8 h-8 rounded-lg text-impa-muted hover:text-impa-700 hover:bg-impa-50 transition-colors duration-150 cursor-pointer"
                  >
                    <ExternalLink size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
