"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

export default function ConfirmCancelModal({
    open,
    onClose,
    onConfirm,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modal = (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-impa-text/45 px-4 py-10 backdrop-blur-sm"
        >
            <div className="w-full max-w-md animate-fadeIn rounded-2xl border border-impa-line bg-white p-8 shadow-impa-xl">
                <h3 className="mb-3 text-center text-xl font-extrabold text-impa-text">
                    ¿Cancelar tu cita?
                </h3>

                <p className="text-center text-sm leading-relaxed text-impa-muted">
                    Si cancelas tu cita podrás volver a agendar otra, siempre y cuando tu
                    solicitud siga activa.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        No, regresar
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Sí, cancelar cita
                    </Button>
                </div>
            </div>
        </div>
    );

    // ⬅️ Aquí es donde lo sacamos “fuera” del componente
    return createPortal(modal, document.body);
}
