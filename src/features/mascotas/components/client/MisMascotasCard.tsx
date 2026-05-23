"use client";

import dayjs from "dayjs";
import {
  PawPrint,
  Heart,
  CalendarHeart,
  Award,
  Scissors,
  Ruler,
  Weight,
  Palette,
  Sparkles,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { generarFechasSeguimiento } from "@/features/mascotas/utils/generarFechasSeguimiento";

/**
 * Card grande de "Mis Mascotas Adoptadas".
 * Identidad IMPA: foto destacada con halo verde, badges semánticos por atributo,
 * timeline visual de seguimientos programados, CTAs claros para certificado + seguimiento.
 */
export default function MisMascotasCard({
  mascota,
  onVerCertificado,
}: {
  mascota: any;
  onVerCertificado: (mascota: any) => void;
}) {
  const fechaAdopcion = dayjs(mascota.fecha_adopcion);
  const seguimientos = generarFechasSeguimiento(fechaAdopcion);

  const coloresTexto = Array.isArray(mascota.colores)
    ? mascota.colores.join(", ")
    : mascota.colores || "";

  return (
    <article className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm transition-all duration-200 ease-impa-out hover:shadow-impa-md hover:border-impa-line-strong">
      {/* Top hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent z-10" />

      <div className="flex flex-col md:flex-row">
        {/* Imagen */}
        <div className="relative w-full md:w-[42%] h-64 md:h-auto md:min-h-[360px] shrink-0">
          <img
            src={
              mascota.imagen_url?.startsWith("http")
                ? mascota.imagen_url
                : "/ISOTIPO IMPA.png"
            }
            alt={mascota.mascota_nombre || "Mascota adoptada"}
            className="w-full h-full object-cover"
          />
          {/* Overlay con marca */}
          <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-impa-text-strong/40 to-transparent pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-impa-700 shadow-impa-sm">
              <Heart size={11} className="fill-impa-500" />
              Mi mascota
            </span>
          </div>
          {/* Bottom gradient con nombre */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-impa-text-strong/85 via-impa-text-strong/30 to-transparent md:hidden">
            <p className="text-white text-lg font-bold">
              {mascota.mascota_nombre || "Sin nombre"}
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge variant="brand" size="sm" className="inline-flex">
                  <PawPrint size={11} />
                  Adoptada
                </Badge>
                <h2 className="mt-2 text-2xl font-bold text-impa-text-strong tracking-tight">
                  {mascota.mascota_nombre || "Sin nombre"}
                </h2>
                <p className="text-sm text-impa-muted mt-0.5 inline-flex items-center gap-1.5">
                  <CalendarHeart size={12} className="text-impa-600" />
                  Adoptada el{" "}
                  <strong className="text-impa-text">
                    {fechaAdopcion.isValid()
                      ? fechaAdopcion.format("DD [de] MMMM, YYYY")
                      : "fecha no registrada"}
                  </strong>
                </p>
              </div>
            </div>

            {/* Chips de atributos */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {mascota.raza_nombre && (
                <Badge variant="default" size="xs">{mascota.raza_nombre}</Badge>
              )}
              {mascota.sexo && (
                <Badge
                  variant={mascota.sexo?.toLowerCase() === "hembra" ? "female" : "male"}
                  size="xs"
                >
                  {mascota.sexo}
                </Badge>
              )}
              {mascota.tamano && (
                <Badge variant="outline" size="xs">{mascota.tamano}</Badge>
              )}
              {mascota.esterilizado && (
                <Badge variant="success" size="xs" dot>
                  Esterilizada
                </Badge>
              )}
              {mascota.edad && (
                <Badge variant="info" size="xs">{mascota.edad}</Badge>
              )}
            </div>

            {/* Personalidad destacada */}
            {mascota.personalidad && (
              <p className="mt-3 text-sm text-impa-muted italic leading-relaxed">
                <Sparkles size={11} className="inline text-impa-600 mr-1" />
                {mascota.personalidad}
              </p>
            )}

            {/* Datos físicos */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {mascota.peso_kg && (
                <DataRow icon={<Weight size={12} />} label="Peso" value={`${mascota.peso_kg} kg`} />
              )}
              {mascota.altura_cm && (
                <DataRow icon={<Ruler size={12} />} label="Altura" value={`${mascota.altura_cm} cm`} />
              )}
              {coloresTexto && (
                <DataRow
                  icon={<Palette size={12} />}
                  label="Colores"
                  value={coloresTexto}
                  full
                />
              )}
            </div>

            {/* Seguimientos */}
            <div className="mt-5 rounded-xl border border-impa-line bg-impa-surface-2/50 p-3.5">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-impa-700">
                <Scissors size={11} />
                Seguimientos programados
              </p>
              <ul className="mt-2 space-y-1 text-xs text-impa-muted">
                {seguimientos.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="impa-dot bg-impa-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-4 border-t border-impa-line-faint">
            <ButtonLink
              href={`/dashboards/usuario/seguimiento/${mascota.adopcion_id}`}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Heart size={14} className="fill-impa-500" />
              Gestionar seguimiento
            </ButtonLink>

            <Button
              variant="cta"
              className="w-full sm:w-auto sm:ml-auto cursor-pointer"
              onClick={() => onVerCertificado(mascota)}
            >
              <Award size={14} />
              Ver certificado
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function DataRow({
  icon,
  label,
  value,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-impa-quiet inline-flex items-center gap-1">
        <span className="text-impa-600">{icon}</span>
        {label}
      </p>
      <p className="text-impa-text font-medium mt-0.5 truncate">{value}</p>
    </div>
  );
}
