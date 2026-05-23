"use client";
import * as React from "react";
import { Badge, type BadgeProps } from "./Badge";

/**
 * Estados de dominio normalizados → variantes de Badge.
 *
 * Centraliza el mapeo `string estado` → variante visual para que
 * todas las tablas admin (adopciones, citas, esterilizaciones, documentos,
 * reportes-maltrato, plásticas) usen el mismo lenguaje cromático.
 *
 * Si tu módulo tiene un estado nuevo no listado aquí, agrégalo al map
 * en vez de reinventar el badge con clases raw.
 */

type Variant = NonNullable<BadgeProps["variant"]>;

const estadoToVariant: Record<string, { variant: Variant; label?: string }> = {
  // Adopciones / solicitudes
  pendiente:           { variant: "warning",  label: "Pendiente" },
  en_revision:         { variant: "info",     label: "En revisión" },
  en_proceso:          { variant: "accent",   label: "En proceso" },
  aprobada:            { variant: "success",  label: "Aprobada" },
  aprobado:            { variant: "success",  label: "Aprobado" },
  rechazada:           { variant: "danger",   label: "Rechazada" },
  rechazado:           { variant: "danger",   label: "Rechazado" },
  cancelada:           { variant: "neutral",  label: "Cancelada" },
  cancelado:           { variant: "neutral",  label: "Cancelado" },

  // Citas
  programada:          { variant: "info",     label: "Programada" },
  confirmada:          { variant: "success",  label: "Confirmada" },
  reprogramada:        { variant: "warning",  label: "Reprogramada" },
  no_asistio:          { variant: "danger",   label: "No asistió" },
  finalizada:          { variant: "success",  label: "Finalizada" },
  completada:          { variant: "success",  label: "Completada" },
  completado:          { variant: "success",  label: "Completado" },

  // Documentos
  faltante:            { variant: "warning",  label: "Faltante" },

  // Reportes de maltrato
  recibido:            { variant: "info",     label: "Recibido" },
  en_investigacion:    { variant: "accent",   label: "En investigación" },
  falso_positivo:      { variant: "neutral",  label: "Falso positivo" },
  resuelto:            { variant: "success",  label: "Resuelto" },

  // Esterilizaciones
  solicitada:          { variant: "warning",  label: "Solicitada" },
  realizada:           { variant: "success",  label: "Realizada" },
  en_quirofano:        { variant: "info",     label: "En quirófano" },
  complicacion:        { variant: "danger",   label: "Complicación" },
};

type StatusBadgeProps = Omit<BadgeProps, "variant" | "children"> & {
  /** Estado de dominio (case-insensitive, espacios/guiones-bajos equivalentes). */
  estado: string;
  /** Texto a mostrar. Si se omite, usa el label estándar del map (o capitalize del estado). */
  label?: string;
  /** Renderiza un dot indicador (true por defecto). */
  dot?: boolean;
};

export function StatusBadge({
  estado,
  label,
  dot = true,
  size,
  className,
  ...rest
}: StatusBadgeProps) {
  const key = estado?.toLowerCase().trim().replace(/[\s-]+/g, "_");
  const mapped = estadoToVariant[key];

  const variant: Variant = mapped?.variant ?? "default";
  const text =
    label ?? mapped?.label ?? (estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "—");

  return (
    <Badge variant={variant} size={size} dot={dot} className={className} {...rest}>
      {text}
    </Badge>
  );
}
