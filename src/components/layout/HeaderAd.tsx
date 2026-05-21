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
    { href: "/dashboards/administrador/gestion_adopciones", label: "Adopciones", icon: FileText },
    { href: "/dashboards/administrador/documentos", label: "Documentos", icon: FileText },
    { href: "/dashboards/administrador/seguimiento", label: "Seguimiento", icon: FileText },
    { href: "/dashboards/administrador/gestion_citas", label: "Citas de adopción", icon: CalendarDays },
    { href: "/dashboards/administrador/citas-veterinarias", label: "Citas veterinarias", icon: CalendarHeart },
    { href: "/dashboards/administrador/esterilizaciones", label: "Esterilizaciones", icon: Stethoscope },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-impa-line shadow-impa-sm">
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        {/* Logo */}
        <Link
          href="/dashboards/administrador"
          className="flex items-center gap-2.5 impa-focus-ring rounded-lg"
        >
          <Image
            src="/impa-isotipo.svg"
            alt="IMPA"
            width={34}
            height={34}
            priority
            className="rounded-lg shadow-impa-xs"
          />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="font-bold text-[15px] text-impa-text tracking-tight">
              IMPA · Admin
            </span>
            <span className="text-[11px] text-impa-muted font-medium">
              Panel administrativo
            </span>
          </div>
        </Link>

        {/* Mobile button */}
        <button
          className="lg:hidden text-impa-text p-2 rounded-lg hover:bg-impa-50 transition impa-focus-ring"
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition impa-focus-ring ${
                    active
                      ? "bg-impa-50 text-impa-700"
                      : "text-impa-muted hover:text-impa-text hover:bg-impa-50/60"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          })}

          {/* Gestión */}
          <li className="relative" ref={gestionRef}>
            <button
              onClick={() => setGestionOpen((v) => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition impa-focus-ring ${
                gestionOpen
                  ? "bg-impa-50 text-impa-700"
                  : "text-impa-muted hover:text-impa-text hover:bg-impa-50/60"
              }`}
            >
              <FolderKanban size={16} />
              <span>Gestión</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${gestionOpen ? "rotate-180" : ""}`}
              />
            </button>

            {gestionOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-impa-line shadow-impa-lg py-1.5 animate-fade-slide overflow-hidden">
                {gestionItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-impa-text hover:bg-impa-50 hover:text-impa-700 transition"
                    onClick={() => setGestionOpen(false)}
                  >
                    <Icon size={15} className="text-impa-500" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* Admin menu */}
          <li className="relative pl-2 ml-1 border-l border-impa-line" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-impa-text hover:bg-impa-50 transition impa-focus-ring"
            >
              <span className="grid place-items-center w-7 h-7 rounded-full bg-impa-500 text-white text-xs font-bold">
                {(adminName?.[0] || "A").toUpperCase()}
              </span>
              <span className="max-w-[120px] truncate">{adminName}</span>
              <ChevronDown
                size={14}
                className={`text-impa-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-impa-line shadow-impa-lg py-1.5 animate-fade-slide overflow-hidden">
                <Link
                  href="/dashboards/perfil"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-impa-text hover:bg-impa-50 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={15} className="text-impa-500" />
                  <span>Mi perfil</span>
                </Link>
                <div className="my-1 border-t border-impa-line" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-sm text-impa-text hover:bg-impa-50 transition"
                >
                  <LogOutIcon size={15} className="text-impa-muted" />
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
          className="lg:hidden bg-white border-t border-impa-line animate-fade-slide"
        >
          <ul className="flex flex-col p-3 gap-1">
            {mainItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <button
                  onClick={() => {
                    router.push(href);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive(href)
                      ? "bg-impa-50 text-impa-700"
                      : "text-impa-text hover:bg-impa-50"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => setGestionOpen((v) => !v)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-impa-text hover:bg-impa-50 transition"
              >
                <FolderKanban size={16} />
                <span>Gestión</span>
                <ChevronDown
                  size={14}
                  className={`ml-auto transition-transform ${gestionOpen ? "rotate-180" : ""}`}
                />
              </button>

              {gestionOpen && (
                <div className="ml-7 mt-1 rounded-xl bg-impa-50 border border-impa-line">
                  {gestionItems.map(({ href, label, icon: Icon }) => (
                    <button
                      key={href}
                      onClick={() => {
                        router.push(href);
                        setGestionOpen(false);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3.5 py-2 w-full text-left text-sm text-impa-text hover:bg-white transition"
                    >
                      <Icon size={14} className="text-impa-500" />
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
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-impa-text hover:bg-impa-50 transition"
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
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-impa-500 hover:bg-impa-600 transition"
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
