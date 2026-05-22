import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RegistroForm from "@/components/auth/registro-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta IMPA para iniciar tu proceso de adopción responsable.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen impa-page-bg flex flex-col">
      <header className="flex items-center justify-between p-5 sm:p-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-white border border-impa-line shadow-impa-xs transition-transform duration-200 ease-impa-out group-hover:scale-[1.04]">
            <Image
              src="/ISOTIPO IMPA.png"
              alt="IMPA"
              width={28}
              height={28}
              className="impa-logo-mark"
              priority
            />
          </span>
          <span className="font-bold text-lg text-impa-text tracking-tight">IMPA</span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-impa-muted hover:text-impa-text transition-colors duration-150 cursor-pointer"
        >
          ¿Ya tienes cuenta?{" "}
          <span className="text-impa-600 font-semibold hover:underline">
            Iniciar sesión
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-md animate-fade-up">
          <RegistroForm />
        </div>
      </main>
    </div>
  );
}
