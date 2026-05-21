"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarHeart,
  Users,
  FileText,
  Menu,
  X,
  User,
  LogOutIcon,
  ChevronDown,
  FolderKanban,
  Stethoscope,
  PawPrint,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [gestionOpen, setGestionOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("Cargando…");

  const gestionRef = useRef<HTMLLIElement>(null);
  const menuRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (mobileMenuRef.current && mobileMenuRef.current.contains(target)) return;
      if (gestionRef.current && !gestionRef.current.contains(target)) setGestionOpen(false);
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === "/dashboards/administrador"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const nombre = data.user.user_metadata?.nombre;
        setAdminName(nombre || "Administrador");
      } else setAdminName("Administrador");
    };
    fetchAdmin();
    const { data: listener } = supabase.auth.onAuthStateChange(() => fetchAdmin());
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const mainItems = [
    { href: "/dashboards/administrador", label: "Inicio", icon: LayoutDashboard },
    { href: "/dashboards/administrador/mascotas", label: "Mascotas", icon: PawPrint },
    { href: "/dashboards/administrador/usuarios", label: "Usuarios", icon: Users },
  ];

  const gestionItems = [
    { href: "/dashboards/administrador/gestion_adopciones", label: "Adopciones", icon: FileText, desc: "Solicitudes y aprobaciones" },
    { href: "/dashboards/administrador/documentos", label: "Documentos", icon: FileText, desc: "Verificación de archivos" },
    { href: "/dashboards/administrador/seguimiento", label: "Seguimiento", icon: FileText, desc: "Post-adopción" },
    { href: "/dashboards/administrador/gestion_citas", label: "Citas de adopción", icon: CalendarDays, desc: "Agenda y aprobación" },
    { href: "/dashboards/administrador/citas-veterinarias", label: "Citas veterinarias", icon: CalendarHeart, desc: "Salud y vacunación" },
    { href: "/dashboards/administrador/esterilizaciones", label: "Esterilizaciones", icon: Stethoscope, desc: "Campañas activas" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-impa-line shadow-impa-xs">
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-impa-200/60 to-transparent" />

      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        {/* Logo */}
        <Link
          href="/dashboards/administrador"
          className="flex items-center gap-2.5 impa-focus-ring rounded-lg group"
        >
          <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-white border border-impa-line shadow-impa-xs transition-transform duration-200 ease-impa-out group-hover:scale-[1.04]">
            <Image
              src="/impa-isotipo.svg"
              alt="IMPA"
              width={26}
              height={26}
              priority
            />
          </span>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="font-bold text-[15px] text-impa-text tracking-tight">
              IMPA
              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-impa-600 bg-impa-50 border border-impa-200 px-1.5 py-px rounded">
                Admin
              </span>
            </span>
            <span className="text-[11px] text-impa-muted font-medium">
              Panel administrativo
            </span>
          </div>
        </Link>

        {/* Mobile button */}
        <button
          className="lg:hidden text-impa-text p-2 rounded-lg hover:bg-impa-surface-3 transition-colors duration-150 impa-focus-ring cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {mainItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium impa-focus-ring transition-all duration-200 ease-impa-out cursor-pointer",
                    active
                      ? "text-impa-700 bg-impa-50 border border-impa-200/70 shadow-impa-xs"
                      : "text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 border border-transparent"
                  )}
                >
                  <Icon size={16} className={active ? "text-impa-600" : ""} />
                  {label}
                </Link>
              </li>
            );
          })}

          {/* Gestión */}
          <li className="relative" ref={gestionRef}>
            <button
              onClick={() => setGestionOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium impa-focus-ring transition-all duration-200 ease-impa-out cursor-pointer",
                gestionOpen
                  ? "text-impa-700 bg-impa-50 border border-impa-200/70 shadow-impa-xs"
                  : "text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 border border-transparent"
              )}
            >
              <FolderKanban size={16} className={gestionOpen ? "text-impa-600" : ""} />
              <span>Gestión</span>
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", gestionOpen ? "rotate-180" : "")}
              />
            </button>

            {gestionOpen && (
              <div className="absolute left-0 mt-2 w-[320px] rounded-2xl bg-white border border-impa-line shadow-impa-xl py-2 animate-fade-slide overflow-hidden">
                <div className="px-3 pt-1 pb-2">
                  <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-impa-quiet">
                    Procesos
                  </p>
                </div>
                {gestionItems.map(({ href, label, icon: Icon, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-start gap-3 px-3 py-2.5 mx-1 rounded-xl hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
                    onClick={() => setGestionOpen(false)}
                  >
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-impa-50 border border-impa-100 text-impa-600 shrink-0 transition-transform duration-200 group-hover:scale-105">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-impa-text leading-tight">
                        {label}
                      </p>
                      <p className="text-xs text-impa-muted mt-0.5 leading-tight">
                        {desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* Admin menu */}
          <li className="relative pl-2 ml-1 border-l border-impa-line" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 impa-focus-ring cursor-pointer"
            >
              <span className="grid place-items-center w-8 h-8 rounded-full bg-impa-cta text-white text-xs font-bold shadow-impa-sm ring-2 ring-white">
                {(adminName?.[0] || "A").toUpperCase()}
              </span>
              <span className="max-w-[120px] truncate hidden xl:inline">{adminName}</span>
              <ChevronDown
                size={14}
                className={cn("text-impa-muted transition-transform duration-200", menuOpen ? "rotate-180" : "")}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-impa-line shadow-impa-xl py-1.5 animate-fade-slide overflow-hidden">
                <div className="px-3 py-2.5 border-b border-impa-line">
                  <p className="text-xs text-impa-muted">Sesión activa</p>
                  <p className="text-sm font-semibold text-impa-text truncate">{adminName}</p>
                </div>
                <Link
                  href="/dashboards/perfil"
                  className="flex items-center gap-2.5 px-3 py-2.5 mx-1.5 mt-1 rounded-lg text-sm text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={15} className="text-impa-600" />
                  <span>Mi perfil</span>
                </Link>
                <div className="my-1 border-t border-impa-line" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 mx-1.5 mb-1 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                >
                  <LogOutIcon size={15} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile nav */}
      {open && (
        <div
          ref={mobileMenuRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="lg:hidden bg-white border-t border-impa-line animate-fade-slide max-h-[calc(100vh-4rem)] overflow-y-auto custom-scroll"
        >
          <ul className="flex flex-col p-3 gap-1">
            {mainItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <button
                  onClick={() => {
                    router.push(href);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
                    isActive(href)
                      ? "bg-impa-50 text-impa-700 border border-impa-200"
                      : "text-impa-text hover:bg-impa-surface-3"
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => setGestionOpen((v) => !v)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
              >
                <FolderKanban size={16} />
                <span>Gestión</span>
                <ChevronDown
                  size={14}
                  className={cn("ml-auto transition-transform duration-200", gestionOpen ? "rotate-180" : "")}
                />
              </button>

              {gestionOpen && (
                <div className="ml-7 mt-1 rounded-xl bg-impa-surface-2 border border-impa-line">
                  {gestionItems.map(({ href, label, icon: Icon }) => (
                    <button
                      key={href}
                      onClick={() => {
                        router.push(href);
                        setGestionOpen(false);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 w-full text-left text-sm text-impa-text hover:bg-white transition-colors duration-150 cursor-pointer"
                    >
                      <Icon size={14} className="text-impa-600" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>

            <li className="pt-2 mt-2 border-t border-impa-line flex flex-col gap-1">
              <button
                onClick={() => {
                  router.push("/dashboards/perfil");
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
              >
                <User size={16} />
                Mi perfil
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-impa-cta hover:shadow-impa-glow transition-shadow duration-150 cursor-pointer"
              >
                <LogOutIcon size={16} />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
