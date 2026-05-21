"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, Mail } from "lucide-react";

export default function RecuperarContrasena() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    setError(null);
    setMensaje(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Ocurrió un error.");
        return;
      }

      setMensaje(
        "Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña."
      );
    } catch {
      setError("Ocurrió un error inesperado al conectar con el servidor.");
      setLoading(false);
    }
  };

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
            <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-impa-50 to-white border border-impa-200 text-impa-600 mb-4 shadow-impa-xs">
              <Mail size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-impa-text">
              Recuperar contraseña
            </h1>
            <p className="text-impa-muted text-sm mt-2">
              Ingresa tu correo y te enviaremos las instrucciones para restablecerla.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5 text-sm text-red-700"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {mensaje && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-impa-200 bg-impa-50 px-4 py-3 flex items-start gap-2.5 text-sm text-impa-800"
            >
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-impa-600" />
              <span className="font-medium">{mensaje}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-impa-text mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
                className="w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-tinted focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:bg-white transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 inline-flex items-center justify-center gap-1.5 rounded-xl bg-impa-cta text-white font-semibold text-sm shadow-impa-md hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-impa-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-impa-md cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enviando…
                </>
              ) : (
                "Enviar instrucciones"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-impa-line text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-impa-600 hover:text-impa-700 hover:underline underline-offset-4 transition-colors duration-150"
            >
              <ArrowLeft size={14} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
