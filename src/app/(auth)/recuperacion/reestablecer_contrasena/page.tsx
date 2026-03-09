"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

export default function NuevaContrasenaPage() {
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

  const router = useRouter();

  // 🟢 1. Capturar el token del hash y crear sesión
  useEffect(() => {
    const supabase = createClient();
    const hash = window.location.hash;

    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      }
    }
  }, []);

  // 🟢 2. Validar requisitos al escribir contraseña
  useEffect(() => {
    const reqs = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };

    setPasswordRequirements(reqs);
  }, [password]);

  // 🟢 3. Enviar y cambiar contraseña
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMensaje("");

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

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError("Error al cambiar la contraseña: " + error.message);
    } else {
      setMensaje(
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión."
      );
      setPassword("");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Encabezado */}
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

        {/* Tarjeta */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
          
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
              />
            </label>

            {/* Caja de requisitos */}
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
              disabled={loading}
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

          {/* Enlace de regreso */}
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
          Hecho con <span className="text-emerald-500 text-sm">💚</span> por IMPA Morelia
        </p>
      </div>
    </div>
  );
}