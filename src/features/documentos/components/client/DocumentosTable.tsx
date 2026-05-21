"use client";

import { useState } from "react";
import { FileText, Eye, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Documento } from "../../types/types";

export default function DocumentosTable({
  documentos,
  filtro,
  onAprobar,
  onRechazar,
  onVerDocumento,
}: {
  documentos: Documento[];
  filtro: string;
  onAprobar: (id: string) => void;
  onRechazar: (doc: Documento) => void;
  onVerDocumento: (url: string) => void;
}) {
  const [openRows, setOpenRows] = useState<{ [email: string]: boolean }>({});

  const toggleRow = (email: string) => {
    setOpenRows((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  if (!documentos || documentos.length === 0)
    return (
      <div className="rounded-2xl border border-impa-line bg-white py-12 text-center shadow-impa-sm">
        <span className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-impa-50 border border-impa-200 text-impa-600 mb-3">
          <FileText size={20} />
        </span>
        <p className="text-sm font-semibold text-impa-text">
          No hay documentos con estado &quot;{filtro}&quot;.
        </p>
        <p className="text-xs text-impa-muted mt-1">Cambia el filtro para ver más resultados.</p>
      </div>
    );

  /** AGRUPAR POR USUARIO */
  const agrupado = documentos.reduce((acc: any, doc: Documento) => {
    const email = doc.perfiles?.email || "desconocido";
    if (!acc[email]) acc[email] = [];
    acc[email].push(doc);
    return acc;
  }, {});

  return (
    <section className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden">

      {Object.entries(agrupado).map(([email, docs]: any) => {
        const usuario = docs[0].perfiles;
        const aprobados = docs.filter((d: Documento) => d.status === "aprobado").length;
        const pendientes = docs.filter((d: Documento) => d.status === "pendiente").length;
        const rechazados = docs.filter((d: Documento) => d.status === "rechazado").length;
        const isOpen = openRows[email];

        return (
          <div key={email} className="border-b border-impa-line-faint last:border-none">

            {/* HEADER USUARIO */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 cursor-pointer transition-colors duration-150 ${
                isOpen ? "bg-impa-tinted/70" : "hover:bg-impa-tinted/40"
              }`}
              onClick={() => toggleRow(email)}
            >
              {/* IZQUIERDA */}
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-impa-50 to-white border border-impa-line text-impa-600 shadow-impa-xs shrink-0">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-impa-text text-sm sm:text-base leading-tight">
                    {usuario?.nombres}
                  </span>
                  <span className="text-xs text-impa-muted break-all leading-tight mt-0.5">
                    {email}
                  </span>
                </div>
              </div>

              {/* DERECHA */}
              <div className="flex flex-row items-center gap-2 mt-3 sm:mt-0 flex-wrap">

                {/* Cantidad */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-impa-surface-2 border border-impa-line text-xs font-semibold text-impa-text">
                  <FileText className="h-3 w-3 text-impa-600" />
                  {docs.length}
                  <span className="text-impa-muted font-normal">docs</span>
                </span>

                {/* Estado general */}
                {pendientes > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {pendientes} pendientes
                  </span>
                )}

                {rechazados > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {rechazados} rechazados
                  </span>
                )}

                {aprobados > 0 && pendientes === 0 && rechazados === 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold whitespace-nowrap">
                    <CheckCircle2 className="h-3 w-3" />
                    Completos
                  </span>
                )}

                <ChevronDown
                  className={`h-4 w-4 text-impa-muted transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* EXPANDIBLE */}
            {isOpen && (
              <div className="bg-impa-surface-2/60 px-3 sm:px-6 pb-5 pt-3 space-y-2.5 animate-fade-in">
                {docs.map((doc: Documento) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-impa-line rounded-xl p-4 bg-white shadow-impa-xs hover:shadow-impa-sm hover:border-impa-line-strong transition-all duration-200"
                  >
                    {/* IZQUIERDA */}
                    <div className="flex items-start gap-3">
                      <span className="grid place-items-center w-9 h-9 rounded-lg bg-impa-50 border border-impa-200 text-impa-700 shrink-0">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-semibold capitalize text-impa-text text-sm">
                          {doc.tipo}
                        </p>
                        <p className="text-xs text-impa-muted mt-0.5">
                          Subido el {new Date(doc.created_at).toLocaleDateString()}
                        </p>

                        {doc.status === "rechazado" && doc.observacion_admin && (
                          <p className="text-xs text-red-700 mt-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                            <strong className="font-semibold">Motivo:</strong> {doc.observacion_admin}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* DERECHA */}
                    <div className="flex items-center gap-2 justify-end flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border
                          ${
                            doc.status === "pendiente"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : doc.status === "aprobado"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        `}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doc.status === "pendiente"
                              ? "bg-amber-500"
                              : doc.status === "aprobado"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />
                        {doc.status}
                      </span>

                      <button
                        onClick={() => onVerDocumento(doc.url)}
                        className="inline-flex items-center gap-1 rounded-lg border border-impa-line bg-white px-2.5 py-1.5 text-xs font-semibold text-impa-text shadow-impa-xs hover:bg-impa-50 hover:border-impa-300 transition-colors duration-150 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Ver
                      </button>

                      {doc.status === "pendiente" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => onAprobar(doc.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onRechazar(doc)}
                          >
                            <XCircle className="h-3.5 w-3.5" /> Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
