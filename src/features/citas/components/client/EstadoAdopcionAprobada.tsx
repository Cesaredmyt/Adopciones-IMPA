"use client";

import { CheckCircle2 } from "lucide-react";

export default function EstadoAdopcionAprobada() {
    return (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-green-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                ¡Adopción aprobada! 🎉
            </h3>

            <p className="mt-2 text-sm text-green-700">
                ¡Felicidades! El proceso de adopción ha sido aprobado. El IMPA se pondrá
                en contacto contigo para coordinar los pasos finales.
            </p>
        </div>
    );
}
