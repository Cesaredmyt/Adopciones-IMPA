"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import PageHead from "@/components/layout/PageHead";
import ModalInfoSeguimiento from "@/features/seguimiento/components/client/ModalInfoSeguimiento";
import ModalSeguimiento from "@/features/seguimiento/components/client/ModalSeguimiento";
import SeguimientoForm from "@/features/seguimiento/components/client/SeguimientoForm";

import { useSeguimientoMascotasQuery } from "@/features/seguimiento/hooks/useSeguimientoMacostasQuery";
import SeguimientoMascotaCard from "@/features/seguimiento/components/client/SeguimientoMascotaCard";
import dayjs from "dayjs";

export default function SeguimientoMascotasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: mascotas = [], isLoading } = useSeguimientoMascotasQuery();

  const [infoOpen, setInfoOpen] = useState(false);
  const [seguimientoOpen, setSeguimientoOpen] = useState(false);
  const [seguimientoActual, setSeguimientoActual] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-impa-600" />
        Cargando seguimientos...
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4">
      <button
        onClick={() => router.push("/dashboards/usuario/mis-mascotas")}
        className="mb-4 inline-flex items-center gap-2 rounded-xl px-2 py-1.5 font-semibold text-impa-700 transition hover:bg-impa-50 hover:text-impa-800"
      >
        <ArrowLeft size={18} /> Volver a Mis Mascotas
      </button>

      <PageHead
        title="Seguimiento de mis mascotas"
        subtitle="Revisa y registra los seguimientos de tus mascotas adoptadas 🐾"
      />

      {mascotas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-impa-line bg-impa-tinted px-5 py-10 text-center text-impa-muted">
          No tienes mascotas adoptadas aún.
        </p>
      ) : (
        <div className="grid gap-8">
          {mascotas.map((m: any) => (
            <SeguimientoMascotaCard
              key={m.id}
              mascota={m}
              onInfo={() => setInfoOpen(true)}
              onSubirSeguimiento={(s) => {
                setSeguimientoActual({
                  adopcionId: m.id,
                  fecha: s.fecha,
                  fechaFormateada: dayjs(s.fecha).format("DD/MM/YYYY"),
                });
                setSeguimientoOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ModalInfoSeguimiento open={infoOpen} onClose={() => setInfoOpen(false)} />

      {seguimientoActual && (
        <ModalSeguimiento
          open={seguimientoOpen}
          onClose={() => setSeguimientoOpen(false)}
          titulo="Registra el seguimiento de tu mascota"
        >
          <SeguimientoForm
            adopcionId={seguimientoActual.adopcionId}
            fechaProgramada={seguimientoActual.fecha}
            onSuccess={() => {
              setSeguimientoOpen(false);
              queryClient.invalidateQueries({
                queryKey: ["seguimiento-mascotas"],
              });
            }}
          />
        </ModalSeguimiento>
      )}
    </div>
  );
}
