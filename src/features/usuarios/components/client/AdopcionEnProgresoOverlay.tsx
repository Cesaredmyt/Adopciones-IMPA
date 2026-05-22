"use client";

import React from "react";
import ReactDOM from "react-dom";

interface Props {
    visible: boolean;
    mensaje?: string | null;
}

export default function AdopcionEnProgresoOverlay({
    visible,
    mensaje,
}: Props) {
    if (!visible || typeof window === "undefined") return null;

    return ReactDOM.createPortal(
        <div
            className="
        fixed inset-0 z-[9999]
        bg-impa-text/50 backdrop-blur-sm
        flex items-center justify-center
      "
            style={{ pointerEvents: "auto" }}
        >
            <div
                className="
          bg-white rounded-2xl border border-impa-line shadow-impa-xl
          p-8 max-w-sm w-full mx-4
          text-center animate-fade-in
        "
            >
                <h2 className="mb-2 text-lg font-extrabold text-impa-text">
                    {mensaje ?? "Procesando adopción..."}
                </h2>

                <p className="text-sm text-impa-muted">
                    Por favor espera un momento, no cierres la página.
                </p>

                <div className="mt-5 flex justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-4 border-impa-500 border-t-transparent" />
                </div>
            </div>
        </div>,
        document.body
    );
}
