"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import Link from "next/link";

export default function LoginCAAM() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setError("Completa correo y contraseña.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo, password: contrasena }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      const target =
        typeof data?.redirect === "string" ? data.redirect : "/dashboards/usuario";
      // refresh() para que el server lea las cookies recién seteadas antes
      // de renderizar el dashboard.
      router.replace(target);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
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
      {/* 1. Capa de oscurecimiento (Overlay) y desenfoque para que la foto no distraiga */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

      {/* Contenedor principal (sobre el fondo) */}
      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* 2. Tarjeta Blanca que ahora contiene TODO (Logo, títulos y formulario) */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          
          {/* Encabezado dentro de la tarjeta */}
          <div className="text-center mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo Instituto"
                width={900}
                height={900}
                className="mx-auto mb-4 h-20 w-auto drop-shadow-sm"
                priority
              />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              ¡Bienvenido!
            </h1>
            <h2 className="mb-2 text-base font-semibold text-emerald-700 mt-2">
              Instituto Michoacano de Protección Animal
            </h2>
            <p className="text-slate-500 text-sm">
              Para poder adoptar, es necesario iniciar sesión.
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

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">
                Correo electrónico
              </span>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="adopta@nocompres.mx"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">
                Contraseña
              </span>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all"
              />
            </label>

            <Button
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 mt-2 shadow-sm transition-colors"
              type="submit"
              full
              disabled={loading}
            >
              {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>

            <div className="text-center pt-2">
              <ButtonLink
                href="/recuperacion"
                variant="ghost"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                ¿Olvidaste tu contraseña?
              </ButtonLink>
            </div>
          </form>

          {/* Divider visual */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-100"></div>
          </div>

          <p className="text-center text-sm text-slate-600">
            ¿Aún no tienes cuenta?{" "}
            <ButtonLink
              href="/register"
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700 font-bold ml-1"
            >
              Regístrate
            </ButtonLink>
          </p>
        </div>

        {/* Texto final fuera de la tarjeta, en blanco para que resalte sobre la foto */}
        <p className="mt-6 text-center text-xs font-medium text-white/80 drop-shadow-md">
          Transformando adopciones en historias de amor
        </p>
      </div>
    </div>
  );
}