"use client";

import React, { useState } from "react";
import { PawPrint, Sparkles, Heart } from "lucide-react";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotasFeed from "@/features/mascotas/components/client/MascotasFeed";
import MascotaInfoModal from "@/features/mascotas/components/client/MascotaInfoModal";
import ModalLoginRequired from "@/components/auth/ModalLoginRequired";

import { ESPECIES } from "@/features/mascotas/data/constants";
import type { Mascota } from "@/features/mascotas/types/mascotas";

export default function MascotasPublicPage() {
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");

  const [openCard, setOpenCard] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);

  const [loginModal, setLoginModal] = useState(false);

  return (
    <>
      {/* ============ HERO público (warm) ============ */}
      <section className="relative overflow-hidden rounded-3xl border border-impa-cream-3 bg-white shadow-impa-sm mb-6 sm:mb-8">
        {/* Mesh warm interno */}
        <div aria-hidden className="absolute inset-0 opacity-90 pointer-events-none impa-hero-mesh-warm" />

        {/* Decorative paw print */}
        <div aria-hidden className="pointer-events-none absolute -top-8 -right-10 opacity-[0.07]">
          <PawPrint size={200} className="text-impa-700" />
        </div>

        <div className="relative px-6 sm:px-10 py-8 sm:py-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-impa-cream-3 text-[11px] font-bold uppercase tracking-[0.08em] text-impa-700 shadow-impa-xs">
            <Sparkles size={11} />
            Adopción responsable
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl md:text-[42px] font-bold text-impa-text-strong tracking-tight leading-[1.1]">
            Encuentra a tu{" "}
            <span className="relative inline-block">
              próximo mejor amigo
              <svg
                aria-hidden
                viewBox="0 0 200 14"
                className="absolute left-0 -bottom-1.5 w-full h-3 text-impa-400"
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
          </h1>

          <p className="mt-4 text-sm sm:text-base text-impa-muted max-w-2xl leading-relaxed">
            Explora nuestras mascotas rescatadas y conoce su historia. Cada una
            espera por su hogar para siempre — y el IMPA te acompaña en cada
            paso del proceso.
          </p>

          {/* Trust signals warm */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-impa-accent-soft border border-impa-accent text-impa-accent-ink font-bold">
              <Heart size={12} className="fill-impa-accent-ink" />
              +24 esta semana
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-impa-cream-3 text-impa-700 font-semibold shadow-impa-xs">
              <PawPrint size={12} />
              158 mascotas disponibles
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-impa-cream-3 text-impa-muted font-semibold shadow-impa-xs">
              <span className="impa-dot bg-impa-success" />
              Vacunadas y esterilizadas
            </span>
          </div>
        </div>
      </section>

      <Filters
        q={q}
        onQ={setQ}
        especie={especie}
        onEspecie={setEspecie}
        sexo={sexo}
        onSexo={setSexo}
        ESPECIES={ESPECIES}
      />

      <MascotasFeed
        search={q}
        especie={especie}
        sexo={sexo}
        onView={(m) => {
          setSelectedMascota(m);
          setOpenCard(true);
        }}
        onAdopt={() => {
          setLoginModal(true);
        }}
      />

      <MascotaInfoModal
        open={openCard}
        mascota={selectedMascota}
        onClose={() => setOpenCard(false)}
        onAdopt={() => setLoginModal(true)}
      />

      <ModalLoginRequired
        open={loginModal}
        onClose={() => setLoginModal(false)}
      />
    </>
  );
}
