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
      <span className="ml-0.5 w-[3px] h-[1em] bg-impa-500 animate-pulse" />
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-[var(--impa-bg)] relative">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-20 w-[600px] h-[600px] rounded-full bg-impa-100 blur-3xl opacity-50" />
          <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-impa-200/40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 lg:pt-28 pb-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-impa-50 border border-impa-100 px-3 py-1 text-xs font-semibold text-impa-700">
              <Sparkles size={12} />
              Plataforma oficial IMPA · Morelia
            </span>

            <h1 className="mt-5 font-bold tracking-tight text-impa-text leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
              Adopta <TypewriterWords />
              <br />
              en su forma más pura.
            </h1>

            <p className="mt-5 text-lg text-impa-muted leading-relaxed max-w-xl">
              El Instituto Michoacano de Protección Animal conecta a familias con
              animales rescatados, brindando esterilización gratuita y cuidado
              veterinario.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboards/mascotas"
                className="group inline-flex items-center gap-1.5 h-12 px-5 rounded-xl bg-impa-500 text-white font-semibold text-sm shadow-impa-md hover:bg-impa-600 active:bg-impa-700 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20"
              >
                Ver mascotas en adopción
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-1.5 h-12 px-5 rounded-xl bg-white text-impa-text font-semibold text-sm border border-impa-line hover:border-impa-300 hover:bg-impa-50 transition shadow-impa-xs"
              >
                Conoce IMPA
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                { value: "2,400+", label: "Adopciones" },
                { value: "5,800+", label: "Esterilizaciones" },
                { value: "98%", label: "Satisfacción" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-impa-200 pl-3">
                  <div className="text-2xl font-bold text-impa-text tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-xs text-impa-muted uppercase tracking-wider font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative h-[420px] lg:h-[520px]"
          >
            {/* Card 1 — large */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[68%] h-[60%] rounded-3xl overflow-hidden shadow-impa-xl border-4 border-white"
            >
              <Image
                src={HERO_IMAGES[0]}
                alt="Perro adoptable"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 400px"
              />
            </motion.div>

            {/* Card 2 — small */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-3xl overflow-hidden shadow-impa-xl border-4 border-white"
            >
              <Image
                src={HERO_IMAGES[1]}
                alt="Gato adoptable"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 320px"
              />
            </motion.div>

            {/* Card 3 — accent badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[40%] left-[8%] bg-white rounded-2xl border border-impa-line shadow-impa-lg p-3.5 flex items-center gap-3 max-w-[220px]"
            >
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-impa-50 text-impa-600 shrink-0">
                <PawPrint size={20} />
              </div>
              <div>
                <p className="text-xs text-impa-muted font-medium">Adopción</p>
                <p className="text-sm font-bold text-impa-text">+24 esta semana</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute bottom-[20%] right-[5%] bg-white rounded-2xl border border-impa-line shadow-impa-lg p-3.5 flex items-center gap-3 max-w-[200px]"
            >
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-impa-50 text-impa-600 shrink-0">
                <Heart size={18} className="fill-impa-500 text-impa-500" />
              </div>
              <div>
                <p className="text-xs text-impa-muted font-medium">Disponibles</p>
                <p className="text-sm font-bold text-impa-text">158 mascotas</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-impa-600">
              Servicios IMPA
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-impa-text">
              Más que adopciones: bienestar integral.
            </h2>
            <p className="mt-4 text-impa-muted">
              Un ecosistema completo para que tu compañero animal tenga la mejor
              vida posible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: PawPrint,
                title: "Adopción responsable",
                desc: "Acompañamiento personalizado y proceso ágil para encontrar al compañero ideal.",
              },
              {
                icon: Stethoscope,
                title: "Esterilización gratuita",
                desc: "Campañas mensuales en colonias prioritarias para controlar la sobrepoblación.",
              },
              {
                icon: Shield,
                title: "Seguimiento médico",
                desc: "Citas veterinarias en línea y expedientes digitales accesibles 24/7.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl bg-white border border-impa-line shadow-impa-sm hover:shadow-impa-md hover:border-impa-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-impa-50 text-impa-600 grid place-items-center group-hover:bg-impa-100 transition">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-impa-text tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-impa-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-16 lg:py-20 bg-white border-y border-impa-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-impa-600">
              Cómo funciona
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-impa-text">
              Adoptar es más simple de lo que crees.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                desc: "Regístrate en menos de 2 minutos para acceder al catálogo completo.",
              },
              {
                step: "02",
                title: "Conoce a tu compañero",
                desc: "Filtra por edad, tamaño y temperamento. Agenda una visita.",
              },
              {
                step: "03",
                title: "Llévalo a casa",
                desc: "Firma el compromiso de adopción y recibe asesoría continua.",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-impa-500 font-bold text-5xl tracking-tight">
                  {s.step}
                </div>
                <h3 className="mt-2 text-xl font-bold text-impa-text">{s.title}</h3>
                <p className="mt-1.5 text-sm text-impa-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-impa-500 text-white p-10 lg:p-14 shadow-impa-xl">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-impa-300 blur-3xl" />
              <div className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full bg-impa-700 blur-3xl" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                  ¿Listo para cambiar dos vidas?
                </h2>
                <p className="mt-4 text-white/85 text-lg leading-relaxed">
                  Cada adopción transforma la vida del animal y la tuya. Empieza tu
                  proceso hoy.
                </p>

                <ul className="mt-6 space-y-2">
                  {[
                    "Sin costo de adopción",
                    "Mascota esterilizada y vacunada",
                    "Acompañamiento post-adopción",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/90"
                    >
                      <CheckCircle2 size={16} className="text-impa-100 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-1.5 h-12 px-6 rounded-xl bg-white text-impa-700 font-bold text-sm hover:bg-impa-50 shadow-lg transition"
                >
                  <Users size={16} />
                  Crear una cuenta
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/dashboards/mascotas"
                  className="inline-flex items-center justify-center gap-1.5 h-12 px-6 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-sm hover:bg-white/15 border border-white/20 transition"
                >
                  Ver mascotas disponibles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
