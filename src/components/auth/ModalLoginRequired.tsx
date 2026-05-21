"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Lock, Heart } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ModalLoginRequired({ open, onClose }: Props) {
    const router = useRouter();

    return (
        <Modal open={open} onClose={onClose} size="sm">
            <div className="px-2 py-3 text-center">
                <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-impa-50 to-impa-100 border border-impa-200 text-impa-700 shadow-impa-sm">
                    <Lock size={26} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-impa-text-strong tracking-tight">
                    Inicia sesión para adoptar
                </h2>

                <p className="mt-2 text-sm text-impa-muted">
                    Necesitas una cuenta para comenzar el proceso de adopción y dar seguimiento responsable.
                </p>

                <div className="mt-7 flex flex-col gap-2.5">
                    <Button
                        variant="cta"
                        size="lg"
                        full
                        onClick={() => router.push("/login")}
                    >
                        <Heart size={16} />
                        Iniciar sesión
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        full
                        onClick={() => router.push("/register")}
                    >
                        Crear cuenta
                    </Button>
                </div>

                <p className="mt-5 text-xs text-impa-muted">
                    ¿Quieres seguir explorando?{" "}
                    <button
                        onClick={onClose}
                        className="text-impa-600 font-semibold hover:underline cursor-pointer"
                    >
                        Volver al catálogo
                    </button>
                </p>
            </div>
        </Modal>
    );
}
