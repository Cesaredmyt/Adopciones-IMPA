"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

function ConfirmadoInner() {
  const router = useRouter();
  const params = useSearchParams();
  const failed = params.get("error") === "invalid";

  return (
    <div className="min-h-screen impa-gradient-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/impa-isotipo.svg"
              alt="IMPA"
              width={44}
              height={44}
              className="rounded-xl shadow-impa-sm"
            />
            <span className="font-bold text-2xl text-impa-text">IMPA</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-impa-lg border border-impa-line p-7 sm:p-8 text-center">
          {failed ? (
            <>
              <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-red-50 text-red-600 mb-5">
                <XCircle size={28} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-impa-text mb-2">
                Enlace inválido
              </h1>
              <p className="text-impa-muted text-sm leading-relaxed mb-6">
                Este enlace ya fue usado, expiró o no es válido. Puedes solicitar uno
                nuevo desde la pantalla de inicio de sesión.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-impa-50 text-impa-600 mb-5">
                <CheckCircle2 size={28} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-impa-text mb-2">
                ¡Cuenta verificada!
              </h1>
              <p className="text-impa-muted text-sm leading-relaxed mb-6">
                Tu correo se ha confirmado correctamente. Ya puedes iniciar sesión y
                comenzar tu proceso de adopción.
              </p>
            </>
          )}
          <button
            onClick={() => router.push("/login")}
            className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-impa-500 text-white font-semibold text-sm shadow-impa-sm hover:bg-impa-600 transition"
          >
            Ir al inicio de sesión
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Confirmado() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen impa-gradient-bg flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-impa-600" />
        </div>
      }
    >
      <ConfirmadoInner />
    </Suspense>
  );
}
