"use client";

import type { Mascota } from "@/features/mascotas/types/mascotas";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

type Props = {
    open: boolean;
    mascota: Mascota | null;
    onClose: () => void;
};

export default function ModalValidacionDocumentos({
    open,
    mascota,
    onClose,
}: Props) {
    const router = useRouter();

    return (
        <Modal open={open} onClose={onClose}>
            <div className="
  p-8 space-y-7 text-impa-text
  bg-impa-tinted
  rounded-2xl
">                {/* Header */}
                <div className="flex flex-col items-center text-center gap-3">
                    {/* Foto mascota */}
                    <div className="
  relative w-28 h-28 rounded-full overflow-hidden
  shadow-lg
  border border-impa-line
  bg-white
">

                        {mascota?.imagen_url ? (
                            <img
                                src={mascota.imagen_url}
                                alt={mascota.nombre}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-impa-50 text-sm font-semibold text-impa-700">
                                IMPA
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-extrabold tracking-tight">
                        Antes de adoptar
                    </h2>

                    <p className="text-sm text-impa-muted">
                        Para continuar con la adopción de
                    </p>

                    <p className="text-lg font-bold text-impa-700">
                        {mascota?.nombre}
                    </p>
                </div>

                {/* Card documentos */}
                <div className="
  rounded-2xl
  border border-impa-line
  bg-white/70
  backdrop-blur-sm
  p-5 space-y-4
  shadow-impa-xs
">                    <p className="text-sm font-semibold text-impa-text">
                        Necesitamos validar los siguientes documentos:
                    </p>

                    <ul className="space-y-3 text-sm text-impa-muted">
                        <li className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-impa-500" />
                            Identificación oficial (INE o Pasaporte)
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-impa-500" />
                            Comprobante de domicilio (máx. 3 meses)
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-impa-500" />
                            Carta compromiso firmada
                        </li>
                    </ul>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        variant="ghost"
                        className="
              w-full sm:w-auto
              cursor-pointer
              hover:bg-impa-50
              transition-colors
            "
                        onClick={onClose}
                    >
                        Lo haré después
                    </Button>

                    <Button
                        className="
              w-full sm:w-auto
              cursor-pointer
              bg-impa-500
              hover:bg-impa-600
              shadow-impa-sm
              hover:shadow-impa-md
              transition-all
            "
                        onClick={() => {
                            onClose();
                            router.push(
                                `/dashboards/usuario/adopcion?from=${mascota?.id ?? ""}`
                            );
                        }}
                    >
                        Subir documentos
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
