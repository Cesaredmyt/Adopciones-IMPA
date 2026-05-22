"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VisorDocumentoProps {
  open: boolean;
  url: string | null;
  onClose: () => void;
}

export default function VisorDocumento({ open, url, onClose }: VisorDocumentoProps) { 
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !url) return null;

  const safeUrl = String(url);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-impa-text/45 p-4 backdrop-blur-sm">
      <div className="relative flex h-[85vh] w-full max-w-5xl animate-[fadeInScale_0.25s_ease-out] flex-col overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-xl">

        <div className="flex h-12 items-center justify-between border-b border-impa-line bg-white px-4">
          <div>
            <h2 className="text-sm font-semibold text-impa-text">Vista del documento</h2>
            <p className="-mt-1 text-xs text-impa-muted">Revisa el archivo completo</p>
          </div>

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              onClick={() => window.open(safeUrl, "_blank")}
              className="flex items-center gap-1 text-impa-700 hover:bg-impa-50"
            >
              <FileText className="h-4 w-4" /> Abrir pestaña
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                const link = document.createElement("a");
                link.href = safeUrl;
                link.download = safeUrl.split("/").pop() || "documento.pdf";
                link.click();
              }}
              className="flex items-center gap-1 text-impa-700 hover:bg-impa-50"
            >
              Descargar
            </Button>

            <button
              onClick={onClose}
              className="cursor-pointer text-impa-muted transition hover:text-impa-text"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-impa-bg-elevated p-4">
          <iframe
            src={safeUrl}
            className="h-full w-full rounded-xl border border-impa-line bg-white shadow-inner"
          />
        </div>

        <div className="flex h-12 items-center justify-end border-t border-impa-line bg-white px-4">
          <Button variant="ghost" onClick={onClose}>
            Cerrar visor
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
