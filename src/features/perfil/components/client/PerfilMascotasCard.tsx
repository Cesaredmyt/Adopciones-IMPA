"use client";

import { PawPrint, Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { MascotaCardAdoptada } from "./MascotaCardAdoptada";
import PerfilSolicitudesCard from "./PerfilSolicitudesCard";
import type { SolicitudAdopcionMin } from "@/features/perfil/types/perfil";

/**
 * Sección "Mis mascotas" del Perfil — combina mascotas adoptadas
 * + solicitudes en proceso en una sola sección semántica.
 */
export default function PerfilMascotasCard({
  mascotas,
  solicitudes,
}: {
  mascotas: any[];
  solicitudes: SolicitudAdopcionMin[];
}) {
  const totalAdoptadas = mascotas?.length ?? 0;
  const totalSolicitudes = solicitudes?.length ?? 0;
  const sinNada = totalAdoptadas === 0 && totalSolicitudes === 0;

  return (
    <section
      id="mascotas"
      className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm scroll-mt-24"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      <header className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-impa-line">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-600 shadow-impa-xs">
            <PawPrint size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-impa-text-strong leading-tight">
              Mis mascotas
            </h2>
            <p className="text-xs text-impa-muted leading-tight">
              {totalAdoptadas} adoptada{totalAdoptadas !== 1 ? "s" : ""}
              {totalSolicitudes > 0 && (
                <>
                  {" · "}
                  {totalSolicitudes} en proceso
                </>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Solicitudes en proceso */}
        <PerfilSolicitudesCard solicitudes={solicitudes} />

        {/* Mascotas adoptadas */}
        {totalAdoptadas > 0 ? (
          <div>
            <h3 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-impa-700 mb-3">
              <Heart size={11} className="fill-impa-500" />
              Adoptadas
              <span className="px-1.5 py-0.5 rounded-full bg-impa-50 border border-impa-200 text-[10px] text-impa-700 normal-case tracking-normal">
                {totalAdoptadas}
              </span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mascotas.map((m) => (
                <MascotaCardAdoptada key={m.id} mascota={m} />
              ))}
            </div>
          </div>
        ) : sinNada ? (
          <EmptyState
            icon={<PawPrint size={28} />}
            title="Aún no tienes mascotas"
            description="Cuando inicies un proceso de adopción o adoptes a tu primer compañero, aparecerá aquí."
            action={
              <ButtonLink href="/dashboards/usuario/adopcion" variant="cta">
                <Heart size={14} className="fill-white" />
                Iniciar mi adopción
              </ButtonLink>
            }
          />
        ) : null}
      </div>
    </section>
  );
}
