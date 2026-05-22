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
              src="/ISOTIPO IMPA.png"
              alt="IMPA"
              width={44}
              height={44}
              className="rounded-xl shadow-impa-sm impa-logo-mark"
            />
            <span className="font-bold text-2xl text-impa-text">IMPA</span>
          </Link>
        </div>

        <div className="relative bg-white rounded-2xl shadow-impa-xl border border-impa-line p-7 sm:p-8 text-center overflow-hidden">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-300/70 to-transparent" />
          {failed ? (
            <>
              <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-200 text-red-600 mb-5 shadow-impa-xs">
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
              <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-impa-50 to-white border border-impa-200 text-impa-600 mb-5 shadow-impa-xs">
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
            className="w-full h-12 inline-flex items-center justify-center gap-1.5 rounded-xl bg-impa-cta text-white font-semibold text-sm shadow-impa-md hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-impa-out cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/25"
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
