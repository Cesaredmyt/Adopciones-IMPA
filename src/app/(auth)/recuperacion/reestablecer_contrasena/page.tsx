"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span className={met ? "text-emerald-600" : "text-rose-500"}>
        {met ? "✔" : "✘"}
      </span>
      <span className={met ? "text-emerald-700" : "text-slate-500"}>{text}</span>
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

  // Validación visual de requisitos.
  useEffect(() => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  }, [password]);

  // Si no llega token en la URL, el flujo es inválido desde el principio.
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

      setMensaje(
        "Contraseña actualizada. Inicia sesión con tu nueva contraseña."
      );
      setPassword("");
      setLoading(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 mt-10">
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
            Restablecer contraseña
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Ingresa una nueva contraseña para recuperar el acceso a tu cuenta.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
          {!hasToken && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-medium text-center">
              Este enlace es inválido o ya expiró. Solicita uno nuevo en{" "}
              <Link href="/recuperacion" className="underline font-semibold">
                /recuperacion
              </Link>
              .
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-medium text-center">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium text-center">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nueva contraseña
              </span>
              <input
                type="password"
                value={password}
                onFocus={() => setShowRequirements(true)}
                onBlur={() => password === "" && setShowRequirements(false)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all"
                required
                disabled={!hasToken}
              />
            </label>

            {showRequirements && (
              <div className="mt-3 p-4 bg-slate-50/50 rounded-xl space-y-2.5 border border-slate-100 transition-all">
                <p className="text-xs font-bold text-slate-700 mb-1">
                  Requisitos de la contraseña:
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

            <Button
              type="submit"
              full
              disabled={loading || !hasToken}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 mt-4 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? "Actualizando..." : "Guardar nueva contraseña"}
            </Button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
          Hecho con <span className="text-emerald-500 text-sm">💚</span> por
          IMPA Morelia
        </p>
      </div>
    </div>
  );
}

// useSearchParams requiere Suspense boundary en Next 15.
export default function NuevaContrasenaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <NuevaContrasenaInner />
    </Suspense>
  );
}
