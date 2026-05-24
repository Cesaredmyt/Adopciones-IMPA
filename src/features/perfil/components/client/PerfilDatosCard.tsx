"use client";

import { Pencil, User, Mail, Phone, IdCard, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Perfil } from "@/features/perfil/types/perfil";

/**
 * Card de "Datos personales" del Perfil.
 * Layout estilo Stitch: header con título + botón "Editar", grid 2-col
 * de campos label+value. Cero color saturado innecesario.
 */
export default function PerfilDatosCard({
  perfil,
  onEdit,
}: {
  perfil: Perfil;
  onEdit: () => void;
}) {
  return (
    <section
      id="datos"
      className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm scroll-mt-24"
    >
      {/* Top hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      {/* Header */}
      <header className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-impa-line">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-600 shadow-impa-xs">
            <User size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-impa-text-strong leading-tight">
              Datos personales
            </h2>
            <p className="text-xs text-impa-muted leading-tight">
              Información básica de tu cuenta IMPA.
            </p>
          </div>
        </div>
        <Button variant="cta" size="sm" onClick={onEdit} className="cursor-pointer shrink-0">
          <Pencil size={13} />
          Editar
        </Button>
      </header>

      {/* Grid de campos */}
      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field
          icon={<User size={13} />}
          label="Nombre"
          value={perfil.nombres}
        />
        <Field
          icon={<User size={13} />}
          label="Apellido paterno"
          value={perfil.apellido_paterno}
        />
        <Field
          icon={<User size={13} />}
          label="Apellido materno"
          value={perfil.apellido_materno ?? "—"}
        />
        <Field
          icon={<Mail size={13} />}
          label="Correo electrónico"
          value={perfil.email}
          breakAll
        />
        <Field
          icon={<Phone size={13} />}
          label="Teléfono"
          value={perfil.telefono ?? "—"}
        />
        <Field
          icon={<IdCard size={13} />}
          label="CURP"
          value={perfil.curp ?? "—"}
        />
        <Field
          icon={<Briefcase size={13} />}
          label="Ocupación"
          value={perfil.ocupacion ?? "—"}
          fullWidth
        />
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  value,
  fullWidth,
  breakAll,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
  breakAll?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
        <span className="text-impa-600">{icon}</span>
        {label}
      </p>
      <p
        className={
          "mt-1 text-sm font-semibold text-impa-text-strong " +
          (breakAll ? "break-all" : "truncate")
        }
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </p>
    </div>
  );
}
