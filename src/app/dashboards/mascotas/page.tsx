"use client";

import React, { useState } from "react";
import { PawPrint, Sparkles } from "lucide-react";
import PageHead from "@/components/layout/PageHead";
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
      <PageHead
        icon={<PawPrint size={22} />}
        eyebrow={
          <>
            <Sparkles size={12} />
            Adopción responsable
          </>
        }
        title="Encuentra a tu próximo mejor amigo"
        subtitle="Explora nuestras mascotas rescatadas y conoce su historia. Cada una espera por su hogar para siempre."
      />

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
