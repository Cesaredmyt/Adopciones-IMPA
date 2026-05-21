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
    <div className="min-h-screen impa-gradient-bg flex flex-col">
      <header className="flex items-center justify-between p-5 sm:p-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/impa-isotipo.svg"
            alt="IMPA"
            width={36}
            height={36}
            className="rounded-lg shadow-impa-xs"
          />
          <span className="font-bold text-lg text-impa-text">IMPA</span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-impa-muted hover:text-impa-text transition"
        >
          ¿Ya tienes cuenta?{" "}
          <span className="text-impa-600 font-semibold hover:underline">
            Iniciar sesión
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-6 sm:py-12">
        <div className="w-full max-w-md">
          <RegistroForm />
        </div>
      </main>
    </div>
  );
}
