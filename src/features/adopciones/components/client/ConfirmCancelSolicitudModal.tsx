"use client";

import { Button } from "@/components/ui/Button";
import { createPortal } from "react-dom";

export default function ConfirmCancelSolicitudModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const modal = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-impa-text/45 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-impa-line bg-white p-8 shadow-impa-xl">
        <h3 className="mb-3 text-center text-xl font-extrabold text-impa-text">
          ¿Cancelar tu solicitud?
        </h3>

        <p className="text-center text-sm leading-relaxed text-impa-muted">
          Si cancelas tu solicitud, la mascota se liberará y quedará disponible
          nuevamente para adopción.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={onClose}
            variant="outline"
          >
            No, regresar
          </Button>

          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant="primary"
          >
            Sí, cancelar solicitud
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
