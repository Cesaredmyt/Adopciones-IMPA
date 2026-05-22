"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  ArrowRight,
  PawPrint,
  CalendarCheck,
  Stethoscope,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function DashboardUsuarioPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserName(data?.user?.user_metadata?.nombre || "Usuario");
    });
  }, []);

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden rounded-3xl border border-impa-line bg-impa-mesh shadow-impa-md p-8 md:p-14">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0)_46%,rgba(237,248,237,0.84)_100%)] pointer-events-none" />

        {/* Grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,131,15,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(15,131,15,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative z-10 grid md:grid-cols-[1.15fr_1fr] gap-10 items-center">
          {/* Texto */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-impa-200 text-[11px] font-bold uppercase tracking-wider text-impa-700 shadow-impa-xs">
              <Sparkles size={12} className="text-impa-600" />
              Bienvenido a tu espacio
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl md:text-[56px] font-bold text-impa-text-strong leading-[1.05] tracking-tight">
              Hola{userName ? "," : ""}{" "}
              <span className="bg-gradient-to-r from-impa-600 to-impa-500 bg-clip-text text-transparent">
                {userName || "Usuario"}
              </span>
              .
            </h1>
            <p className="mt-5 text-base sm:text-lg text-impa-muted max-w-xl leading-relaxed">
              Tu próxima historia de adopción puede comenzar hoy. Conoce mascotas rescatadas, revisa su compatibilidad y completa tu proceso con acompañamiento del equipo IMPA.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink
                href="/dashboards/usuario/mascotas"
                variant="cta"
                size="lg"
                className="group"
              >
                Explorar mascotas
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </ButtonLink>
              <ButtonLink
                href="/dashboards/usuario/adopcion"
                variant="outline"
                size="lg"
              >
                <Heart size={15} />
                Mi proceso
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-impa-muted">
              <div className="inline-flex items-center gap-1.5">
                <span className="impa-dot bg-impa-500 impa-pulse-ring" />
                Adopciones activas
              </div>
              <span>·</span>
              <div className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-impa-600" />
                Proceso verificado
              </div>
            </div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            <div className="relative w-[280px] sm:w-[340px] aspect-square">
              {/* Card frame */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white border border-impa-line shadow-impa-xl"
              >
                <Image
                  src="/Dog.png"
                  alt="Mascota rescatada"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 340px, 280px"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-impa-text-strong/80 via-impa-text-strong/20 to-transparent p-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-impa-700">
                    <PawPrint size={11} />
                    Adoptable
                  </div>
                  <p className="mt-2 text-white text-sm font-semibold">
                    Más de 500 mascotas esperando un hogar
                  </p>
                </div>
              </motion.div>
              {/* Floating chip */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -left-6 sm:-left-10 top-12 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-impa-line shadow-impa-lg"
              >
                <span className="grid place-items-center w-8 h-8 rounded-xl bg-impa-50 text-impa-600 border border-impa-100">
                  <Heart size={14} />
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-impa-text leading-tight">
                    Adopción responsable
                  </p>
                  <p className="text-impa-muted leading-tight">Con seguimiento</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ QUICK ACTIONS ============ */}
      <section>
        <h2 className="text-2xl font-bold text-impa-text-strong mb-6 tracking-tight">
          Acciones rápidas
        </h2>
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          <QuickAction
            href="/dashboards/usuario/mascotas"
            icon={<PawPrint size={20} />}
            title="Explorar adoptables"
            desc="Descubre mascotas disponibles y conoce su historia."
            color="from-impa-50 to-impa-100/40"
          />
          <QuickAction
            href="/dashboards/usuario/citas"
            icon={<CalendarCheck size={20} />}
            title="Mis citas"
            desc="Agenda visitas presenciales y revisa tu calendario."
            color="from-emerald-50 to-emerald-100/40"
          />
          <QuickAction
            href="/dashboards/usuario/mis-mascotas"
            icon={<Stethoscope size={20} />}
            title="Mis mascotas"
            desc="Cuidados, esterilización y seguimiento veterinario."
            color="from-sky-50 to-sky-100/40"
          />
        </div>
      </section>

      {/* ============ BENEFICIOS ============ */}
      <section className="space-y-10">
        <header className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-impa-50 border border-impa-200 text-[11px] font-bold uppercase tracking-wider text-impa-700">
            <Sparkles size={12} />
            Por qué adoptar con IMPA
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-impa-text-strong tracking-tight">
            Beneficios reales para ti y tu nueva mascota
          </h2>
          <p className="mt-3 text-impa-muted">
            Acompañamiento, transparencia y bienestar animal — todo en una sola plataforma.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <Feature
            icon={<ShieldCheck size={18} />}
            title="Acompañamiento real"
            desc="Te guiamos desde tu primera elección hasta el seguimiento final de tu mascota."
          />
          <Feature
            icon={<Sparkles size={18} />}
            title="Perfiles completos"
            desc="Energía, cuidados, compatibilidad y recomendaciones personalizadas."
          />
          <Feature
            icon={<Heart size={18} />}
            title="Adopción responsable"
            desc="Prioridad total al bienestar y adaptación saludable de tu nueva mascota."
          />
        </div>
      </section>

      {/* ============ STEPS ============ */}
      <section className="space-y-10">
        <header className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-impa-text-strong tracking-tight">
            ¿Cómo funciona tu adopción?
          </h2>
          <p className="mt-3 text-impa-muted">
            Cinco pasos sencillos para encontrar a tu compañero ideal.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            "Explora mascotas disponibles",
            "Agenda tu cita presencial",
            "Llena tu formulario final",
            "Adopta y realiza seguimiento",
            "Disfruta tu nueva compañía",
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="impa-lift relative rounded-2xl p-5 bg-white border border-impa-line shadow-impa-sm cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-impa-50 border border-impa-100 text-impa-700 text-xs font-bold">
                  {i + 1}
                </span>
                <CheckCircle2 className="h-5 w-5 text-impa-500" />
              </div>
              <p className="mt-3 text-sm font-semibold text-impa-text leading-snug">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="relative rounded-3xl p-8 md:p-12 bg-white border border-impa-line shadow-impa-sm overflow-hidden">
        <div className="absolute inset-0 bg-impa-mesh opacity-50 pointer-events-none" />
        <div className="relative">
          <header className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-impa-text-strong tracking-tight">
                Historias reales de adopción
              </h3>
              <p className="mt-2 text-impa-muted text-sm">
                Familias que ya cambiaron una vida.
              </p>
            </div>
          </header>

          <div className="grid md:grid-cols-2 gap-5">
            <Testimonial
              name="Laura & Toby"
              text="Nunca pensé que adoptar sería tan transformador. Toby llegó a llenar nuestro hogar de energía y amor."
              initial="L"
            />
            <Testimonial
              name="Jorge & Mish"
              text="El proceso fue claro de inicio a fin. Mish ahora es parte esencial de nuestra familia."
              initial="J"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ====================== COMPONENTES ====================== */

function QuickAction({
  href,
  icon,
  title,
  desc,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm transition-[transform,box-shadow,border-color] duration-300 ease-impa-out hover:-translate-y-1 hover:shadow-impa-lg hover:border-impa-line-strong cursor-pointer p-5"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />
      <div className="relative">
        <span className="grid place-items-center w-12 h-12 rounded-xl bg-impa-50 border border-impa-100 text-impa-600 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <h3 className="mt-4 text-lg font-bold text-impa-text tracking-tight">
          {title}
        </h3>
        <p className="mt-1 text-sm text-impa-muted">{desc}</p>
        <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-impa-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Continuar
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="impa-lift rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm cursor-default"
    >
      <span className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-impa-50 to-impa-100/60 border border-impa-100 text-impa-700">
        {icon}
      </span>
      <p className="mt-4 text-lg font-bold text-impa-text-strong tracking-tight">
        {title}
      </p>
      <p className="text-sm text-impa-muted mt-1.5 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Testimonial({
  name,
  text,
  initial,
}: {
  name: string;
  text: string;
  initial: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-impa-line bg-impa-surface-2/60 p-6 backdrop-blur-sm"
    >
      <p className="text-impa-text text-base leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-impa-line">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-impa-cta text-white text-xs font-bold shadow-impa-sm">
          {initial}
        </span>
        <p className="text-sm font-semibold text-impa-text">{name}</p>
      </div>
    </motion.div>
  );
}
