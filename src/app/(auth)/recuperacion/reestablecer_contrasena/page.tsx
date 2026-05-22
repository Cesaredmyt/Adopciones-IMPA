"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Lock,
  Check,
  X,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check size={14} className="text-impa-600" />
      ) : (
        <X size={14} className="text-impa-line" />
      )}
      <span className={met ? "text-impa-700 font-medium" : "text-impa-muted"}>
        {text}
      </span>
    </div>
  );
}

function NuevaContrasenaInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showRequirements, setShowRequirements] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  useEffect(() => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  }, [password]);

  const hasToken = token.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!hasToken) {
      setError("Enlace inválido. Solicita uno nuevo.");
      return;
    }

    if (
      !passwordRequirements.minLength ||
      !passwordRequirements.hasUpperCase ||
      !passwordRequirements.hasLowerCase ||
      !passwordRequirements.hasNumber
    ) {
      setError("La contraseña no cumple con los requisitos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data?.error ||
            "No se pudo cambiar la contraseña. Solicita un nuevo enlace."
        );
        setLoading(false);
        return;
      }

      setMensaje("Contraseña actualizada. Redirigiendo al inicio de sesión…");
      setPassword("");
      setLoading(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

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

        <div className="bg-white rounded-2xl shadow-impa-lg border border-impa-line p-7 sm:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-impa-50 text-impa-600 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-impa-text">
              Nueva contraseña
            </h1>
            <p className="text-impa-muted text-sm mt-2">
              Crea una nueva contraseña segura para tu cuenta.
            </p>
          </div>

          {!hasToken && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Este enlace es inválido o ya expiró. Solicita uno nuevo desde{" "}
              <Link href="/recuperacion" className="underline font-semibold">
                recuperación
              </Link>
              .
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="mb-5 rounded-xl border border-impa-200 bg-impa-50 px-4 py-3 text-sm text-impa-800 font-medium">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="pwd"
                className="block text-sm font-semibold text-impa-text mb-1.5"
              >
                Nueva contraseña
              </label>
              <input
                id="pwd"
                type="password"
                value={password}
                onFocus={() => setShowRequirements(true)}
                onBlur={() => password === "" && setShowRequirements(false)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 transition-all"
                required
                disabled={!hasToken}
              />
            </div>

            {showRequirements && (
              <div className="rounded-xl bg-impa-50/60 border border-impa-line p-3.5 space-y-2 animate-fade-slide">
                <p className="text-xs font-semibold text-impa-text mb-1">
                  Requisitos de la contraseña
                </p>
                <RequirementItem
                  met={passwordRequirements.minLength}
                  text="Mínimo 8 caracteres"
                />
                <RequirementItem
                  met={passwordRequirements.hasUpperCase}
                  text="Al menos una letra mayúscula"
                />
                <RequirementItem
                  met={passwordRequirements.hasLowerCase}
                  text="Al menos una letra minúscula"
                />
                <RequirementItem
                  met={passwordRequirements.hasNumber}
                  text="Al menos un número"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !hasToken}
              className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-impa-500 text-white font-semibold text-sm shadow-impa-sm hover:bg-impa-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={15} />
              )}
              {loading ? "Actualizando…" : "Guardar nueva contraseña"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-impa-line text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-impa-600 hover:text-impa-700 hover:underline"
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

export default function NuevaContrasenaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen impa-gradient-bg flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-impa-600" />
        </div>
      }
    >
      <NuevaContrasenaInner />
    </Suspense>
  );
}
