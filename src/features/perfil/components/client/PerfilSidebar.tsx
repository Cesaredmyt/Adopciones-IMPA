"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  PawPrint,
  FileCheck,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Perfil } from "@/features/perfil/types/perfil";

export type PerfilSection =
  | "datos"
  | "direccion"
  | "mascotas"
  | "documentos";

const NAV_ITEMS: {
  id: PerfilSection;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "datos",      label: "Personal Info",   icon: User },
  { id: "direccion",  label: "Dirección",       icon: MapPin },
  { id: "mascotas",   label: "Mis mascotas",    icon: PawPrint },
  { id: "documentos", label: "Documentos",      icon: FileCheck },
];

/**
 * Sidebar de la página de Perfil — basada en la referencia de Stitch.
 * Bloque de avatar arriba + navegación tipo TOC con scrollspy + footer
 * con Help + Logout.
 */
export default function PerfilSidebar({
  perfil,
  active,
  onSectionClick,
}: {
  perfil: Perfil;
  active: PerfilSection;
  onSectionClick: (id: PerfilSection) => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  // Year of registration (rol member since)
  const memberYear = perfil.created_at
    ? new Date(perfil.created_at).getFullYear()
    : null;

  const initials = `${perfil.nombres?.[0] ?? ""}${
    perfil.apellido_paterno?.[0] ?? ""
  }`.toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <div className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden">
        {/* Top hairline */}
        <span className="pointer-events-none block h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

        {/* Avatar block */}
        <div className="p-5 border-b border-impa-line bg-gradient-to-b from-impa-50/60 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full bg-impa-cta blur-xl opacity-25 scale-110"
                aria-hidden
              />
              {perfil.avatar_url ? (
                <img
                  src={perfil.avatar_url}
                  alt={perfil.nombres}
                  className="relative h-14 w-14 rounded-full border-[3px] border-white object-cover shadow-impa-md ring-1 ring-impa-200"
                />
              ) : (
                <div className="relative h-14 w-14 rounded-full border-[3px] border-white bg-impa-cta text-white grid place-items-center font-bold text-base shadow-impa-md ring-1 ring-impa-200">
                  {initials || "U"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-impa-text-strong leading-tight truncate">
                {perfil.nombres} {perfil.apellido_paterno}
              </p>
              <p className="text-xs text-impa-muted leading-tight mt-0.5">
                {perfil.rol_id === 1 ? "Administrador" : "Adoptante"}
                {memberYear && (
                  <span className="text-impa-quiet">
                    {" · desde "}
                    {memberYear}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionClick(item.id)}
                className={cn(
                  "w-full inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors duration-200 ease-impa-out",
                  isActive
                    ? "bg-impa-cta text-white shadow-impa-sm"
                    : "text-impa-text hover:bg-impa-surface-3 hover:text-impa-text-strong"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={16}
                  className={
                    isActive ? "text-white" : "text-impa-muted"
                  }
                />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-impa-line p-2 space-y-0.5">
          <a
            href="mailto:contacto@impa.org.mx?subject=Ayuda con mi cuenta IMPA"
            className="w-full inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-impa-muted hover:bg-impa-surface-3 hover:text-impa-text transition-colors duration-150 cursor-pointer"
          >
            <HelpCircle size={16} />
            <span className="flex-1 text-left">Ayuda</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-impa-danger-ink hover:bg-impa-danger-soft transition-colors duration-150 cursor-pointer disabled:opacity-60"
          >
            <LogOut size={16} className="text-impa-danger" />
            <span className="flex-1 text-left">
              {loggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
            </span>
          </button>
        </div>
      </div>

      {/* Mini stat opcional debajo del sidebar */}
      <div className="hidden lg:block mt-4">
        <div className="rounded-xl border border-impa-line bg-impa-tinted/40 px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-impa-muted">
            <Badge variant="brand" size="xs">
              IMPA
            </Badge>
            Tu cuenta
          </p>
          <p className="text-xs text-impa-muted mt-1.5 leading-relaxed">
            Mantén tu información al día para agilizar tu proceso de adopción y
            seguimiento.
          </p>
        </div>
      </div>
    </aside>
  );
}
