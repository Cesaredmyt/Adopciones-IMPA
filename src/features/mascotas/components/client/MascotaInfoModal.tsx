"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

import type { Mascota } from "@/features/mascotas/types/mascotas";
import MascotaCardUsuario from "@/features/mascotas/components/client/MascotaCardUsuario";

type Props = {
    open: boolean;
    mascota: Mascota | null;
    onClose: () => void;
    onAdopt: (m: Mascota) => void;
};

export default function MascotaInfoModal({
    open,
    mascota,
    onClose,
    onAdopt,
}: Props) {
    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (!open) return;

        const body = document.body;
        const html = document.documentElement;

        const scrollY = window.scrollY;
        body.dataset.scrollY = String(scrollY);

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overscrollBehavior = "none";

        return () => {
            const prevY = Number(body.dataset.scrollY || 0);

            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.overflow = "";
            delete body.dataset.scrollY;

            html.style.overscrollBehavior = "";

            if (!Number.isNaN(prevY)) window.scrollTo(0, prevY);
        };
    }, [open]);

    if (!open) return null;
    if (typeof window === "undefined") return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-impa-text/60 px-4 py-8 backdrop-blur-sm">
            <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-impa-line bg-white text-impa-muted shadow-impa-xs transition hover:bg-impa-50 hover:text-impa-700"
                    aria-label="Cerrar"
                >
                    <X size={18} />
                </button>

                <div className="flex-1 overflow-y-auto rounded-2xl">
                    <MascotaCardUsuario
                        m={mascota}
                        open={true}
                        onClose={onClose}
                        onAdopt={() => {
                            if (mascota) onAdopt(mascota);
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}
