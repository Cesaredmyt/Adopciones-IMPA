"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ConfirmadoInner() {
  const router = useRouter();
  const params = useSearchParams();
  const failed = params.get("error") === "invalid";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(91,75,182,0.08), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(240,79,147,0.08), transparent 45%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-[var(--brand-purple)]/15 p-8 w-full max-w-md text-center">
        <Image
          src="/logo.png"
          alt="Logo IMPA"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />

        {failed ? (
          <>
            <h1 className="text-2xl font-bold text-rose-600 mb-2">
              Enlace inválido
            </h1>
            <p className="text-gray-700 mb-6">
              Este enlace ya fue usado, expiró o no es válido. Puedes solicitar
              uno nuevo desde la pantalla de inicio de sesión.
            </p>
            <Button
              className="cursor-pointer"
              variant="primary"
              full
              onClick={() => router.push("/login")}
            >
              Ir al inicio de sesión
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#9B2E45] mb-2">
              ¡Cuenta verificada!
            </h1>
            <p className="text-gray-700 mb-6">
              Tu correo ha sido confirmado correctamente. Ya puedes iniciar
              sesión y disfrutar del sistema.
            </p>
            <Button
              className="cursor-pointer"
              variant="primary"
              full
              onClick={() => router.push("/login")}
            >
              Ir al inicio de sesión
            </Button>
          </>
        )}
      </div>
      <p className="text-center text-xs text-[var(--brand-dark)]/60 mt-4">
        Hecho con <span className="text-[var(--brand-pink)]">❤</span> por IMPA
        Morelia
      </p>
    </div>
  );
}

export default function Confirmado() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <ConfirmadoInner />
    </Suspense>
  );
}
