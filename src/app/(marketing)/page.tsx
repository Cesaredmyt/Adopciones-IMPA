"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Shield,
  Stethoscope,
  PawPrint,
  Sparkles,
  Users,
  CheckCircle2,
  MapPin,
  Calendar,
  ShieldCheck,
  Quote,
  Activity,
  Star,
} from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&q=70&w=1000",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&q=70&w=1000",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&q=70&w=1000",
];

function TypewriterWords() {
  const words = React.useMemo(
    () => ["amor", "alegría", "una vida", "lealtad", "ternura", "esperanza"],
    []
  );
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!deleting && subIndex < words[index].length) {
          setSubIndex(subIndex + 1);
        } else if (deleting && subIndex > 0) {
          setSubIndex(subIndex - 1);
        } else if (!deleting && subIndex === words[index].length) {
          setTimeout(() => setDeleting(true), 1200);
        } else if (deleting && subIndex === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      },
      deleting ? 50 : 90
    );
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words]);

  return (
    <span className="text-impa-600 inline-flex items-center">
      {words[index].substring(0, subIndex)}
      <span className="ml-0.5 w-[3px] h-[0.85em] bg-impa-500 animate-pulse rounded-sm" />
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="relative">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Ambient mesh */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(236,253,236,0.72)_0%,rgba(255,255,255,0.82)_44%,rgba(246,248,246,0.98)_100%)]" />
        </div>
        {/* Grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,131,15,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(15,131,15,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-24 pb-16 lg:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-impa-200 px-3 py-1.5 text-[11px] font-bold text-impa-700 uppercase tracking-[0.08em] shadow-impa-xs">
              <span className="impa-dot bg-impa-500 impa-pulse-ring" />
              Plataforma oficial IMPA · Morelia
            </span>

            <h1 className="mt-5 font-bold tracking-tight text-impa-text-strong leading-[1.02] text-[40px] sm:text-[52px] lg:text-[64px]">
              Adopta <TypewriterWords />
              <br />
              en su forma{" "}
              <span className="relative inline-block">
                más pura
                <svg
                  aria-hidden
                  viewBox="0 0 200 14"
                  className="absolute left-0 -bottom-2 w-full h-3 text-impa-400"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2,10 C50,2 150,2 198,10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-6 text-[17px] text-impa-muted leading-relaxed max-w-xl">
              El Instituto Michoacano de Protección Animal conecta a familias con
              animales rescatados, brindando esterilización gratuita y cuidado
              veterinario integral.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboards/mascotas"
                className="group inline-flex items-center gap-1.5 h-12 px-5 rounded-xl bg-impa-cta text-white font-semibold text-sm shadow-impa-md hover:shadow-impa-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-impa-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/25 cursor-pointer"
              >
                <PawPrint size={16} />
                Ver mascotas en adopción
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-1.5 h-12 px-5 rounded-xl bg-white text-impa-text font-semibold text-sm border border-impa-line shadow-impa-xs hover:border-impa-300 hover:bg-impa-50 hover:shadow-impa-sm transition-all duration-200 ease-impa-out cursor-pointer"
              >
                Conoce IMPA
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { value: "2,400+", label: "Adopciones" },
                { value: "5,800+", label: "Esterilizaciones" },
                { value: "98%", label: "Satisfacción" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="relative pl-3.5 border-l-2 border-impa-300"
                >
                  <div className="text-[22px] sm:text-[26px] font-bold text-impa-text-strong tracking-tight leading-none">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-impa-muted uppercase tracking-[0.08em] font-bold mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[460px] lg:h-[560px]"
          >
            {/* Halo glow */}

            {/* Card 1 — large */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[68%] h-[60%] rounded-3xl overflow-hidden shadow-impa-xl border-[5px] border-white"
            >
              <Image
                src={HERO_IMAGES[0]}
                alt="Perro adoptable"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 420px"
              />
              {/* Inner top highlight */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </motion.div>

            {/* Card 2 — small */}
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-3xl overflow-hidden shadow-impa-xl border-[5px] border-white"
            >
              <Image
                src={HERO_IMAGES[1]}
                alt="Gato adoptable"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 340px"
              />
            </motion.div>

            {/* Floating chip 1 */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-[40%] left-[8%] bg-white rounded-2xl border border-impa-line shadow-impa-xl p-3.5 flex items-center gap-3 max-w-[230px]"
            >
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-impa-50 to-impa-100 border border-impa-200 text-impa-700 shrink-0">
                <PawPrint size={20} />
              </div>
              <div>
                <p className="text-[11px] text-impa-muted font-bold uppercase tracking-wider">
                  Adopción
                </p>
                <p className="text-sm font-bold text-impa-text-strong">
                  +24 esta semana
                </p>
              </div>
            </motion.div>

            {/* Floating chip 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="absolute bottom-[20%] right-[5%] bg-white rounded-2xl border border-impa-line shadow-impa-xl p-3.5 flex items-center gap-3 max-w-[210px]"
            >
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-impa-50 to-impa-100 border border-impa-200 text-impa-700 shrink-0">
                <Heart size={18} className="fill-impa-500 text-impa-500" />
              </div>
              <div>
                <p className="text-[11px] text-impa-muted font-bold uppercase tracking-wider">
                  Disponibles
                </p>
                <p className="text-sm font-bold text-impa-text-strong">
                  158 mascotas
                </p>
              </div>
            </motion.div>

            {/* Pulse indicator */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-impa-200 text-[10px] font-bold uppercase tracking-wider text-impa-700 shadow-impa-sm"
            >
              <span className="impa-dot bg-impa-500 impa-pulse-ring" />
              En vivo
            </motion.div>
          </motion.div>
        </div>

        {/* Marquee / Trusted by */}
        <div className="border-y border-impa-line bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-impa-muted whitespace-nowrap">
              Con apoyo de
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-impa-muted">
              {[
                { icon: ShieldCheck, label: "Gob. de Michoacán" },
                { icon: Stethoscope, label: "Veterinarios voluntarios" },
                { icon: Users, label: "Familias adoptantes" },
                { icon: Heart, label: "Donantes locales" },
              ].map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold"
                >
                  <p.icon size={13} className="text-impa-600" />
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow="Servicios IMPA"
            title="Más que adopciones: bienestar integral."
            description="Un ecosistema completo para que tu compañero animal tenga la mejor vida posible."
          />

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            <FeatureCard
              icon={PawPrint}
              tone="impa"
              title="Adopción responsable"
              desc="Acompañamiento personalizado y proceso ágil para encontrar al compañero ideal para tu hogar."
              tag="Más popular"
            />
            <FeatureCard
              icon={Stethoscope}
              tone="impa"
              title="Esterilización gratuita"
              desc="Campañas mensuales en colonias prioritarias para controlar la sobrepoblación animal."
            />
            <FeatureCard
              icon={Shield}
              tone="impa"
              title="Seguimiento médico"
              desc="Citas veterinarias en línea y expedientes digitales accesibles 24/7 para tu mascota."
            />
          </div>
        </div>
      </section>

      {/* ============ IMPACT BAND (verde profundo) ============ */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-impa-700 via-impa-600 to-impa-500 text-white shadow-impa-xl">
            <div aria-hidden className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_50%,rgba(7,18,10,0.22)_100%)]" />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />

            <div className="relative p-8 sm:p-12 lg:p-14">
              <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-[10px] font-bold uppercase tracking-[0.1em]">
                    <Activity size={11} />
                    Nuestro impacto
                  </span>
                  <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.1]">
                    Cada cifra es{" "}
                    <span className="bg-gradient-to-r from-white to-impa-100 bg-clip-text text-transparent">
                      una vida transformada
                    </span>
                    .
                  </h2>
                  <p className="mt-4 text-white/85 text-base leading-relaxed max-w-md">
                    Detrás de cada número hay historias de rescate, segundas
                    oportunidades y familias completas.
                  </p>

                  <Link
                    href="/nosotros"
                    className="mt-6 inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-white text-impa-700 font-semibold text-sm shadow-impa-md hover:shadow-impa-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-impa-out cursor-pointer"
                  >
                    Conoce nuestra historia
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ImpactBox value="2,400+" label="Adopciones realizadas" icon={<Heart size={16} />} />
                  <ImpactBox value="5,800+" label="Esterilizaciones" icon={<Stethoscope size={16} />} />
                  <ImpactBox value="98%" label="Adopciones exitosas" icon={<Star size={16} />} />
                  <ImpactBox value="42" label="Colonias atendidas" icon={<MapPin size={16} />} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow="Cómo funciona"
            title="Adoptar es más simple de lo que crees."
            description="Tres pasos sencillos para encontrar a tu compañero ideal."
          />

          <div className="mt-14 grid md:grid-cols-3 gap-5 relative">
            {/* Connector line (desktop) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-impa-300 to-transparent"
            />

            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                desc: "Regístrate en menos de 2 minutos para acceder al catálogo completo de mascotas adoptables.",
                icon: Users,
              },
              {
                step: "02",
                title: "Conoce a tu compañero",
                desc: "Filtra por edad, tamaño y temperamento. Agenda una visita presencial para conocerlo.",
                icon: Heart,
              },
              {
                step: "03",
                title: "Llévalo a casa",
                desc: "Firma el compromiso de adopción y recibe asesoría continua de nuestro equipo.",
                icon: PawPrint,
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm hover:shadow-impa-md hover:-translate-y-0.5 transition-all duration-300 ease-impa-out cursor-default"
              >
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-impa-50 to-impa-100 border border-impa-200 text-impa-700 shadow-impa-xs">
                  <s.icon size={22} />
                  <span className="absolute -top-2 -right-2 text-[11px] font-bold tracking-tight text-white bg-impa-cta px-2 py-0.5 rounded-full shadow-impa-sm">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-impa-text-strong tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-impa-muted leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIOS ============ */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(243,247,243,0.82)_0%,rgba(255,255,255,0)_46%,rgba(236,253,236,0.58)_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow="Historias reales"
            title="Familias que ya cambiaron una vida."
            description="Estos son los testimonios de adoptantes IMPA."
          />

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Laura Mendoza",
                pet: "Toby · Mestizo",
                text: "Nunca pensé que adoptar sería tan transformador. Toby llegó a llenar nuestro hogar de energía y amor. El proceso fue muy claro.",
                initial: "L",
              },
              {
                name: "Jorge Hernández",
                pet: "Mish · Gato adulto",
                text: "El acompañamiento del IMPA fue excepcional. Mish ahora es parte esencial de nuestra familia. Recomiendo a todos adoptar con ellos.",
                initial: "J",
              },
              {
                name: "Sofía Rivera",
                pet: "Luna · Cachorra",
                text: "Encontrar a Luna fue lo mejor que nos pasó este año. El catálogo y los filtros nos ayudaron a elegir bien. ¡Gracias IMPA!",
                initial: "S",
              },
            ].map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm hover:shadow-impa-md transition-all duration-300 cursor-default"
              >
                <Quote
                  size={28}
                  className="absolute -top-3 -left-1 text-impa-200 fill-impa-50"
                />
                <div className="flex items-center gap-1 text-impa-500">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} size={14} className="fill-impa-500 text-impa-500" />
                  ))}
                </div>
                <blockquote className="mt-3 text-impa-text text-[15px] leading-relaxed">
                  "{t.text}"
                </blockquote>
                <figcaption className="mt-5 pt-5 border-t border-impa-line-faint flex items-center gap-3">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-impa-cta text-white text-sm font-bold shadow-impa-sm">
                    {t.initial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-impa-text leading-tight">
                      {t.name}
                    </p>
                    <p className="text-xs text-impa-muted leading-tight">
                      adoptó a {t.pet}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-impa-text-strong text-white p-8 sm:p-12 lg:p-14 shadow-impa-xl">
            {/* Mesh background */}
            <div aria-hidden className="absolute inset-0 opacity-60 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(23,207,23,0.20)_0%,rgba(255,255,255,0)_48%,rgba(17,166,17,0.24)_100%)]" />
            </div>
            {/* Grid pattern */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-bold uppercase tracking-[0.1em]">
                  <Sparkles size={11} />
                  Empieza hoy
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.1]">
                  ¿Listo para cambiar{" "}
                  <span className="text-impa-300">dos vidas</span>?
                </h2>
                <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed max-w-xl">
                  Cada adopción transforma la vida del animal y la tuya. Empieza
                  tu proceso hoy mismo.
                </p>

                <ul className="mt-6 space-y-2.5">
                  {[
                    "Sin costo de adopción",
                    "Mascota esterilizada y vacunada",
                    "Acompañamiento post-adopción ilimitado",
                    "Asesoría veterinaria 24/7",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-white/95"
                    >
                      <span className="grid place-items-center w-5 h-5 rounded-full bg-impa-500/30 border border-impa-300/40 shrink-0">
                        <CheckCircle2 size={13} className="text-impa-200" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-1.5 h-12 px-6 rounded-xl bg-impa-cta text-white font-bold text-sm shadow-impa-md hover:shadow-impa-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-impa-out cursor-pointer"
                >
                  <Users size={16} />
                  Crear una cuenta
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/dashboards/mascotas"
                  className="inline-flex items-center justify-center gap-1.5 h-12 px-6 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-sm border border-white/20 hover:bg-white/15 transition-colors duration-200 cursor-pointer"
                >
                  <PawPrint size={16} />
                  Ver mascotas disponibles
                </Link>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">
                      Ubicación
                    </p>
                    <p className="text-sm font-semibold mt-0.5 flex items-center gap-1.5">
                      <MapPin size={13} className="text-impa-300" />
                      Morelia, MX
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">
                      Atención
                    </p>
                    <p className="text-sm font-semibold mt-0.5 flex items-center gap-1.5">
                      <Calendar size={13} className="text-impa-300" />
                      Lun – Sáb
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===================== Sub-componentes ===================== */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-impa-50 border border-impa-200 text-[10px] font-bold uppercase tracking-[0.1em] text-impa-700">
        <Sparkles size={11} />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-impa-text-strong leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-impa-muted text-base sm:text-[17px] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  tag,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone: string;
  title: string;
  desc: string;
  tag?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm hover:shadow-impa-lg hover:-translate-y-1 hover:border-impa-line-strong transition-all duration-300 ease-impa-out cursor-default">
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0)_0%,rgba(237,248,237,0.80)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Top hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      <div className="relative flex items-start gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-impa-50 to-impa-100 border border-impa-200 text-impa-700 shadow-impa-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon size={22} />
        </div>
        {tag && (
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-impa-cta text-white text-[10px] font-bold uppercase tracking-wider shadow-impa-sm">
            {tag}
          </span>
        )}
      </div>

      <h3 className="relative mt-5 text-xl font-bold text-impa-text-strong tracking-tight">
        {title}
      </h3>
      <p className="relative mt-2 text-sm text-impa-muted leading-relaxed">
        {desc}
      </p>

      <div className="relative mt-5 inline-flex items-center gap-1 text-xs font-bold text-impa-700 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        Saber más
        <ArrowRight size={12} />
      </div>
    </div>
  );
}

function ImpactBox({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/15 transition-colors duration-200">
      <div className="flex items-center gap-2 text-white/80">
        <span className="grid place-items-center w-7 h-7 rounded-lg bg-white/15 text-white">
          {icon}
        </span>
        <p className="text-[10px] uppercase tracking-[0.08em] font-bold">
          {label}
        </p>
      </div>
      <p className="mt-2 text-3xl sm:text-[32px] font-bold tracking-tight leading-none">
        {value}
      </p>
    </div>
  );
}
