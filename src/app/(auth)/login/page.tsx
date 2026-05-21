"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
      {/* Side panel — desktop only */}
      <aside className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-impa-700 via-impa-600 to-impa-500 text-white">
        {/* Decorative mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 -left-10 w-80 h-80 rounded-full bg-impa-300 blur-3xl animate-floating" />
          <div className="absolute bottom-10 right-0 w-[28rem] h-[28rem] rounded-full bg-impa-800 blur-3xl" />
          <div
            className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-impa-200 blur-3xl"
            style={{ transform: "translate(-50%, -50%)" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <Link href="/" className="relative z-10 inline-flex items-center gap-2.5 w-fit group">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white/95 shadow-impa-md transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/impa-isotipo.svg"
              alt="IMPA"
              width={28}
              height={28}
              priority
            />
          </span>
          <span className="font-bold text-xl tracking-tight">IMPA</span>
        </Link>

        <div className="relative z-10 max-w-md space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} />
            Plataforma oficial
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
            Cada adopción transforma{" "}
            <em className="not-italic bg-gradient-to-r from-white to-impa-100 bg-clip-text text-transparent">
              dos vidas.
            </em>
          </h2>
          <p className="text-white/85 text-lg leading-relaxed">
            Plataforma del Instituto Michoacano de Protección Animal para adopción responsable, esterilización y bienestar animal.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              { icon: Heart, text: "Acompañamiento personalizado en tu proceso" },
              { icon: ShieldCheck, text: "Procesos verificados y transparentes" },
              { icon: Sparkles, text: "Comunidad comprometida con los animales" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/95">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                  <item.icon size={16} />
                </span>
                <span className="text-sm font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/70 text-xs">
          © {new Date().getFullYear()} IMPA · Morelia, Michoacán
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6 sm:p-12 impa-page-bg">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white border border-impa-line shadow-impa-sm">
                <Image
                  src="/impa-isotipo.svg"
                  alt="IMPA"
                  width={30}
                  height={30}
                />
              </span>
              <span className="font-bold text-2xl text-impa-text tracking-tight">IMPA</span>
            </Link>
          </div>

          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-impa-50 border border-impa-200 text-[11px] font-bold uppercase tracking-wider text-impa-700 mb-3">
              <Sparkles size={11} />
              Bienvenido
            </span>
            <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight text-impa-text leading-tight">
              Inicia sesión en tu cuenta
            </h1>
            <p className="mt-2 text-impa-muted">
              Continúa con tu proceso de adopción responsable.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5 text-sm text-red-700 animate-fade-slide"
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
                className={cn(
                  "w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs",
                  "transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out",
                  "placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-tinted",
                  "focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:bg-white"
                )}
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
                  className="text-xs font-medium text-impa-600 hover:text-impa-700 hover:underline cursor-pointer"
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
                  className={cn(
                    "w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 pr-11 text-sm text-impa-text shadow-impa-xs",
                    "transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out",
                    "placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-tinted",
                    "focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:bg-white"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-impa-cta text-white font-semibold text-sm shadow-impa-md",
                "transition-[transform,box-shadow,background] duration-200 ease-impa-out",
                "hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/25",
                "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-impa-md",
                "mt-2 cursor-pointer"
              )}
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
              className="font-semibold text-impa-600 hover:text-impa-700 hover:underline cursor-pointer"
            >
              Crea una cuenta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
