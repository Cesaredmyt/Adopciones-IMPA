"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import CertificadoModal from "@/components/certificados/CertificadoModal";

import { useMisMascotasQuery } from "@/features/mascotas/hooks/useMisMascotasQuery";
import MisMascotasCard from "@/features/mascotas/components/client/MisMascotasCard";

export default function MisMascotasPage() {
  const { data: mascotas, isLoading, error } = useMisMascotasQuery();

  const [certificadoAbierto, setCertificadoAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-impa-muted">
        <Loader2 className="mb-2 h-8 w-8 animate-spin text-impa-600" />
        <p>Cargando tus mascotas...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error al cargar mascotas:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p>Error al cargar tus mascotas</p>
      </div>
    );
  }

  if (!mascotas || mascotas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <p className="mb-4 text-lg text-impa-muted">Aún no has adoptado ninguna mascota.</p>
        <Link href="/dashboards/usuario/adopcion">
          <Button>Ir a adoptar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <PageHead
        title="Mis Mascotas Adoptadas"
        subtitle="Consulta el seguimiento y la información de las mascotas que has adoptado."
      />

      <div className="grid gap-6">
        {mascotas.map((mascota: any) => (
          <MisMascotasCard
            key={mascota.id ?? mascota.adopcion_id}
            mascota={mascota}
            onVerCertificado={(m) => {
              setMascotaSeleccionada(m);
              setCertificadoAbierto(true);
            }}
          />
        ))}
      </div>

      <CertificadoModal
        open={certificadoAbierto}
        onClose={() => setCertificadoAbierto(false)}
        mascota={mascotaSeleccionada}
      />
    </div>
  );
}
