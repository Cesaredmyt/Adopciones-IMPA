"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";

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
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error inesperado al conectar con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: "url('/fondo.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Capa de oscurecimiento (Overlay) */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* Tarjeta Blanca que contiene TODO */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          
          {/* Encabezado (Ahora dentro de la tarjeta) */}
          <div className="text-center mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo Instituto"
                width={900}
                height={900}
                className="mx-auto mb-4 h-24 w-auto drop-shadow-sm"
                priority
              />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Recuperar contraseña
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Ingresa tu correo y te enviaremos instrucciones.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium text-center"
            >
              {error}
            </div>
          )}

          {mensaje && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium text-center"
            >
              {mensaje}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">
                Correo electrónico
              </span>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all"
              />
            </label>

            <Button
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 mt-4 shadow-sm transition-colors"
              type="submit"
              full
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </Button>

            <div className="text-center pt-4 border-t border-slate-100 mt-6">
              <ButtonLink
                href="/login"
                variant="ghost"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-bold transition-colors"
              >
                ← Volver al inicio de sesión
              </ButtonLink>
            </div>
          </form>
        </div>

        {/* Texto final sobre la foto */}
        <p className="mt-6 text-center text-xs font-medium text-white/80 drop-shadow-md flex items-center justify-center gap-1">
          Hecho con <span className="text-emerald-400 text-sm">💚</span> por IMPA Morelia
        </p>
      </div>
    </div>
  );
}