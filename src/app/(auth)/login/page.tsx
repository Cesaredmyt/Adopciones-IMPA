"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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
      router.replace(target);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen impa-gradient-bg grid lg:grid-cols-2">
      {/* Side panel — visible only desktop */}
      <aside className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-impa-500 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 -left-10 w-72 h-72 rounded-full bg-impa-300 blur-3xl" />
          <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-impa-700 blur-3xl" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2">
          <Image
            src="/impa-isotipo.svg"
            alt="IMPA"
            width={40}
            height={40}
            className="rounded-lg bg-white/95 p-0.5"
          />
          <span className="font-bold text-xl">IMPA</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Cada adopción transforma <em className="not-italic text-impa-100">dos vidas</em>.
          </h2>
          <p className="mt-4 text-white/85 text-lg leading-relaxed">
            Plataforma oficial del Instituto Michoacano de Protección Animal para
            adopción responsable, esterilización y bienestar animal.
          </p>
        </div>

        <p className="relative z-10 text-white/70 text-xs">
          © {new Date().getFullYear()} IMPA · Morelia, Michoacán
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-impa-text">
              Bienvenido de vuelta
            </h1>
            <p className="mt-2 text-impa-muted">
              Inicia sesión para continuar con tu proceso de adopción.
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
                className="w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs placeholder:text-[#638863] hover:border-impa-300 focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 transition-all"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label
                  htmlFor="pwd"
                  className="block text-sm font-semibold text-impa-text"
                >
                  Contraseña
                </label>
                <Link
                  href="/recuperacion"
                  className="text-xs font-medium text-impa-600 hover:text-impa-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="pwd"
                  type={showPwd ? "text" : "password"}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 pr-11 text-sm text-impa-text shadow-impa-xs placeholder:text-[#638863] hover:border-impa-300 focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-50 transition"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-impa-500 text-white font-semibold text-sm shadow-impa-sm hover:bg-impa-600 active:bg-impa-700 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Iniciando sesión…
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-impa-line" />
            <span className="text-xs text-impa-muted uppercase tracking-wider">o</span>
            <div className="flex-1 h-px bg-impa-line" />
          </div>

          <p className="text-center text-sm text-impa-muted">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-semibold text-impa-600 hover:text-impa-700 hover:underline"
            >
              Crea una cuenta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
