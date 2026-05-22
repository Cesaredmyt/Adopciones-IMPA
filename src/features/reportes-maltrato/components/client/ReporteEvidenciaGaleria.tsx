"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { ImageIcon, X } from "lucide-react";

type Props = {
  urls: string[];
};

export function ReporteEvidenciaGaleria({ urls }: Props) {
  const [active, setActive] = useState<string | null>(null);

  if (!urls.length) {
    return (
      <div className="bg-impa-surface-2 border border-impa-line rounded-lg p-4 text-sm text-impa-quiet italic flex items-center gap-2">
        <ImageIcon size={16} />
        Sin evidencias fotográficas.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {urls.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setActive(url)}
            className="relative aspect-square rounded-lg overflow-hidden border border-impa-line shadow-impa-xs hover:shadow-impa-md transition-shadow group cursor-pointer"
            aria-label={`Ver evidencia ${i + 1}`}
          >
            <img
              src={url}
              alt={`Evidencia ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-impa-out"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        size="xl"
      >
        {active && (
          <div className="flex items-center justify-center">
            <img
              src={active}
              alt="Evidencia"
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
          </div>
        )}
      </Modal>
    </>
  );
}
