"use client";

import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

type EstadoSolicitudEnProcesoProps = {
    solicitudId: string;
    loading: boolean;
    onIrFormulario: () => void;
};

export default function EstadoSolicitudEnProceso({
    solicitudId,
    loading,
    onIrFormulario,
}: EstadoSolicitudEnProcesoProps) {
    return (
        <div
            className="
        mt-8
        rounded-2xl 
        border border-[#dce5dc] 
        bg-gradient-to-br from-[#fff7f1] via-white to-[#fff2e3]
        p-8 
        shadow-[0_4px_18px_rgba(188,95,54,0.15)]
        animate-fade-in
      "
        >
            {/* Encabezado */}
            <div className="flex items-center gap-4">
                <div
                    className="
            h-14 w-14 
            rounded-full 
            bg-[#17cf17] 
            text-white 
            flex items-center justify-center 
            shadow-md
          "
                >
                    <CheckCircle2 className="h-7 w-7" />
                </div>

                <div>
                    <h3 className="text-xl font-extrabold text-[#0f830f]">
                        ¡Estás a un paso de adoptar! 🐾
                    </h3>
                    <p className="text-sm text-[#7a5c49] mt-1">
                        Ya realizaste tu cita y tu solicitud está en proceso.
                    </p>
                </div>
            </div>

            {/* Cuerpo */}
            <div className="mt-6 space-y-3">
                <p className="text-sm sm:text-base text-[#5d4636] leading-relaxed">
                    Solo falta completar el
                    <strong className="text-[#17cf17]">
                        {" "}
                        formulario final de adopción
                    </strong>
                    . Esto permitirá al equipo del IMPA continuar con la evaluación.
                </p>

                <p className="text-sm text-[#a4836b] italic">
                    “Un paso más para darle un hogar lleno de cariño.”
                </p>
            </div>

            {/* CTA */}
            <div className="mt-6 flex justify-end">
                <Button
                    onClick={onIrFormulario}
                    disabled={loading}
                    className="
            bg-[#17cf17] 
            text-white 
            px-6 py-3 
            rounded-xl 
            shadow-md 
            transition-all 
            cursor-pointer
            flex items-center gap-2
            hover:bg-[#a64d2e] hover:shadow-lg hover:shadow-[#17cf17]/40
            active:scale-95
            disabled:opacity-70 disabled:cursor-not-allowed
          "
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                            />
                        </svg>
                    ) : (
                        <>
                            <FileText className="h-5 w-5" />
                            Completar formulario
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
