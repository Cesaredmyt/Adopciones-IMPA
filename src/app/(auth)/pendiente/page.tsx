"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, RotateCw, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function Pendiente() {
  const router = useRouter();
  const supabase = createClient();

  const [reenviando, setReenviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const getRegistroData = () => {
    if (typeof window === "undefined") return { email: null, nombre: null };
    return {
      email:
        localStorage.getItem("registro_email") ||
        sessionStorage.getItem("registro_email"),
      nombre:
        localStorage.getItem("registro_nombre") ||
        sessionStorage.getItem("registro_nombre"),
    };
  };

  const { email } = getRegistroData();

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email_confirmed_at) {
        router.push("/dashboards/usuario/mascotas");
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [router, supabase]);

  const reenviarCorreo = async () => {
    if (!email) return;
    setReenviando(true);
    setReenviado(false);

    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setReenviando(false);
    if (res.ok) {
      setReenviado(true);
      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-impa-lg border border-impa-line p-7 sm:p-8 text-center"
        >
          <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-impa-50 text-impa-600 mb-5">
            <Mail size={28} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-impa-text mb-2">
            Verifica tu correo
          </h1>
          <p className="text-impa-muted text-sm leading-relaxed mb-6">
            Te enviamos un enlace a tu correo para confirmar tu cuenta. Revisa tu
            bandeja de entrada y también la carpeta de spam.
          </p>

          <div className="rounded-xl border border-impa-line bg-impa-50/50 p-4 text-left mb-6">
            <p className="text-xs font-semibold text-impa-text mb-1">
              ⏱ Tiempo estimado
            </p>
            <p className="text-xs text-impa-muted">
              El correo puede tardar hasta 2 minutos en llegar.
            </p>
          </div>

          {!email ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-left">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="font-medium">
                No se puede reenviar el correo porque faltan datos del registro.
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={reenviarCorreo}
                disabled={reenviando || cooldown > 0}
                className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-impa-line bg-white text-impa-text font-semibold text-sm hover:bg-impa-50 hover:border-impa-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw
                  size={15}
                  className={reenviando ? "animate-spin" : ""}
                />
                {reenviando
                  ? "Reenviando…"
                  : cooldown > 0
                  ? `Puedes reenviar en ${cooldown}s`
                  : "Reenviar correo"}
              </button>

              {reenviado && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-1.5 text-sm text-impa-700 font-medium"
                >
                  <CheckCircle2 size={15} />
                  Correo reenviado
                </motion.div>
              )}
            </div>
          )}

          <button
            onClick={() => router.push("/login")}
            className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-impa-500 text-white font-semibold text-sm shadow-impa-sm hover:bg-impa-600 transition mt-4"
          >
            Volver al inicio de sesión
            <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
