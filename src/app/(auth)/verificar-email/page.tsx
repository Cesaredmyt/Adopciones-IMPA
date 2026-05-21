import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Verificar correo",
  description: "Verifica tu correo electrónico para completar tu registro IMPA.",
};

export default function VerificarEmailPage() {
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

        <div className="relative bg-white rounded-2xl shadow-impa-xl border border-impa-line p-7 sm:p-8 overflow-hidden">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-300/70 to-transparent" />
          <div className="text-center mb-6">
            <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-impa-50 to-white border border-impa-200 text-impa-600 mb-4 shadow-impa-xs">
              <Mail size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-impa-text">
              Revisa tu correo
            </h1>
            <p className="text-impa-muted text-sm mt-2">
              Te enviamos un enlace de verificación. Haz clic para activar tu cuenta.
            </p>
          </div>

          <div className="rounded-xl border border-impa-200 bg-impa-50 p-4 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-impa-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-impa-800 font-semibold">¡Registro exitoso!</p>
              <p className="text-impa-700 mt-1 leading-relaxed">
                Tu cuenta se creó correctamente. Para completar el proceso, abre el
                enlace que llegará a tu correo en los próximos minutos.
              </p>
            </div>
          </div>

          <div className="mt-5 text-sm text-impa-muted">
            <p className="font-semibold text-impa-text mb-1.5">¿No ves el correo?</p>
            <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed">
              <li>Revisa tu carpeta de spam o promociones</li>
              <li>Verifica que el correo ingresado sea el correcto</li>
              <li>El mensaje puede tardar unos minutos en llegar</li>
            </ul>
          </div>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/login"
              className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-impa-cta text-white font-semibold text-sm shadow-impa-md hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-impa-out cursor-pointer"
            >
              Ir a iniciar sesión
            </Link>
            <Link
              href="/"
              className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-impa-line bg-white text-impa-text font-semibold text-sm shadow-impa-xs hover:bg-impa-50 hover:border-impa-300 hover:shadow-impa-sm transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
