"use client";

import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import {
  Stethoscope,
  PawPrint,
  Shield,
  Target,
  Eye,
  MapPin,
  Phone,
  Heart,
} from "lucide-react";

const PILLARS = [
  {
    title: "Salud Pública",
    text: "Servicios médicos veterinarios, campañas de vacunación y esterilización gratuita.",
    icon: Stethoscope,
  },
  {
    title: "Bienestar Animal",
    text: "Promovemos el trato digno y responsable hacia los animales que nos rodean.",
    icon: PawPrint,
  },
  {
    title: "Seguridad Ciudadana",
    text: "Resguardamos animales en riesgo y atendemos reportes ciudadanos las 24 horas.",
    icon: Shield,
  },
];

const HISTORIA = [
  {
    year: "2015",
    title: "Inicio de operaciones",
    desc: "Comenzamos atendiendo animales en situación vulnerable en Morelia.",
    img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&q=70&w=1200",
  },
  {
    year: "2018",
    title: "Campañas masivas",
    desc: "Lanzamos programas de esterilización masiva y educación ciudadana.",
    img: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&q=70&w=1200",
  },
  {
    year: "2022",
    title: "Más de 1,000 adopciones",
    desc: "Miles de mascotas encontraron un nuevo hogar gracias a IMPA.",
    img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&q=70&w=1200",
  },
  {
    year: "2025",
    title: "Plataforma digital",
    desc: "Modernización completa con adopciones, citas y seguimiento en línea.",
    img: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&q=70&w=1200",
  },
];

export default function SobreNosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--impa-bg)] text-impa-text">
      <Header />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden pt-20 lg:pt-28 pb-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(236,253,236,0.72)_0%,rgba(246,248,246,0.94)_52%,rgba(255,255,255,0.82)_100%)]" />
          </div>

          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-impa-50 border border-impa-100 px-3 py-1 text-xs font-semibold text-impa-700"
            >
              <Heart size={12} className="fill-impa-500 text-impa-500" />
              Sobre IMPA
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-impa-text leading-[1.05]"
            >
              Trabajamos por una Michoacán <br className="hidden sm:block" />
              <span className="text-impa-600">más empática.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-5 text-lg text-impa-muted leading-relaxed max-w-3xl mx-auto"
            >
              En el Instituto Michoacano de Protección Animal trabajamos con
              pasión por la salud pública, el bienestar animal y la seguridad
              ciudadana. Cada perro y gato merece atención digna, cariño y la
              oportunidad de encontrar un hogar responsable.
            </motion.p>
          </div>
        </section>

        {/* ============ PILARES ============ */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-5">
            {PILLARS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group p-6 bg-white rounded-2xl border border-impa-line shadow-impa-sm hover:shadow-impa-md hover:border-impa-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-impa-50 text-impa-600 grid place-items-center group-hover:bg-impa-100 transition">
                  <item.icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-impa-text">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-impa-muted leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ MISIÓN Y VISIÓN ============ */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border border-impa-line shadow-impa-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-impa-50 text-impa-600 grid place-items-center">
                <Target size={22} />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-impa-text tracking-tight">
                Misión
              </h3>
              <p className="mt-3 text-impa-muted leading-relaxed">
                Promover la adopción responsable y contribuir a una ciudad
                consciente donde el amor por los animales sea parte fundamental
                del bienestar social.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-impa-500 text-white shadow-impa-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_50%,rgba(7,18,10,0.18)_100%)]" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur grid place-items-center text-white">
                  <Eye size={22} />
                </div>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">
                  Visión
                </h3>
                <p className="mt-3 text-white/90 leading-relaxed">
                  Convertir a Morelia en un referente nacional en bienestar
                  animal a través de educación, esterilización y participación
                  comunitaria.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============ HISTORIA ============ */}
        <section className="relative py-20 bg-white border-y border-impa-line overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(243,247,243,0.82)_0%,rgba(255,255,255,0)_54%,rgba(236,253,236,0.58)_100%)]" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-impa-600">
                Línea de tiempo
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-impa-text">
                Nuestra historia
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {HISTORIA.map((ev, i) => (
                <motion.div
                  key={ev.year}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-white rounded-2xl border border-impa-line shadow-impa-sm hover:shadow-impa-lg transition-all overflow-hidden"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={ev.img}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-impa-text/40 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white text-impa-700 text-xs font-bold shadow-impa-sm">
                      {ev.year}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-bold text-impa-text tracking-tight">
                      {ev.title}
                    </h4>
                    <p className="text-impa-muted text-sm mt-1.5 leading-relaxed">
                      {ev.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ UBICACIÓN ============ */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-impa-600">
              Contacto
            </span>
            <h3 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-impa-text">
              Estamos en Morelia, Michoacán
            </h3>
            <p className="mt-4 text-impa-muted max-w-xl mx-auto leading-relaxed">
              Nuestra ubicación nos permite responder rápidamente a animales en
              situación vulnerable y coordinar esfuerzos de bienestar animal.
            </p>

            <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-white border border-impa-line shadow-impa-sm">
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin size={16} className="text-impa-500" />
                <span className="text-impa-text">
                  Álamos No. 395, Col. Centenario, C.P. 58128
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-impa-line" />
              <div className="flex items-center gap-2.5 text-sm">
                <Phone size={16} className="text-impa-500" />
                <span className="text-impa-text font-semibold">
                  443 321 4731 · 443 321 1392
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
