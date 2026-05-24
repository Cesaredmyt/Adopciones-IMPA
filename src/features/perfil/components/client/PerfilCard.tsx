"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

import { usePerfilQuery } from "@/features/perfil/hooks/usePerfilQuery";
import { usePerfilForm } from "@/features/perfil/hooks/usePerfilForm";
import { useDireccionForm } from "@/features/perfil/hooks/useDireccionForm";

import PerfilSkeleton from "./PerfilSkeleton";
import PerfilSidebar, { type PerfilSection } from "./PerfilSidebar";
import PerfilDatosCard from "./PerfilDatosCard";
import PerfilDireccionCard from "./PerfilDireccionCard";
import PerfilMascotasCard from "./PerfilMascotasCard";
import PerfilDocumentosCard from "./PerfilDocumentosCard";

import ModalEditarPerfil from "./ModalEditarPerfil";
import ModalEditarDireccion from "./ModalEditarDireccion";

import PanelEstado from "@/features/adopciones/components/client/PanelEstado";

export default function PerfilCard() {
  const { data, isLoading, isError } = usePerfilQuery();

  const [editPerfil, setEditPerfil] = useState(false);
  const [editDir, setEditDir] = useState(false);
  const [activeSection, setActiveSection] = useState<PerfilSection>("datos");

  // Sentinels para scrollspy
  const sectionsRef = useRef<HTMLDivElement>(null);

  // Scrollspy: detectar qué sección está visible
  useEffect(() => {
    if (!sectionsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as PerfilSection);
        }
      },
      {
        rootMargin: "-100px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const sections = sectionsRef.current.querySelectorAll<HTMLElement>("section[id]");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [data]);

  const perfilForm = usePerfilForm(data?.perfil, () => setEditPerfil(false));
  const direccionForm = useDireccionForm(
    data?.direccion,
    data?.perfil?.id,
    () => setEditDir(false)
  );

  if (isLoading) {
    return <PerfilSkeleton />;
  }

  if (isError || !data?.perfil) {
    return (
      <PanelEstado
        tone="danger"
        icon={<AlertCircle className="h-6 w-6" />}
        title="No pudimos cargar tu perfil"
        desc="Intenta recargar la página. Si el problema persiste, contacta al equipo IMPA."
      />
    );
  }

  const { perfil, direccion, solicitudes, documentos, mascotasAdoptadas } = data;

  const handleSectionClick = (id: PerfilSection) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <PerfilSidebar
        perfil={perfil}
        active={activeSection}
        onSectionClick={handleSectionClick}
      />

      <div ref={sectionsRef} className="space-y-6 min-w-0">
        <PerfilDatosCard perfil={perfil} onEdit={() => setEditPerfil(true)} />

        <PerfilDireccionCard
          direccion={direccion}
          onEdit={() => setEditDir(true)}
        />

        <PerfilMascotasCard
          mascotas={mascotasAdoptadas}
          solicitudes={solicitudes}
        />

        <PerfilDocumentosCard documentos={documentos} />
      </div>

      <ModalEditarPerfil
        open={editPerfil}
        onClose={() => setEditPerfil(false)}
        {...perfilForm}
      />

      <ModalEditarDireccion
        open={editDir}
        onClose={() => setEditDir(false)}
        {...direccionForm}
      />
    </div>
  );
}
