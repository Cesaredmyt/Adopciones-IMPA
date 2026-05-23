"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Stethoscope,
  PawPrint,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  Megaphone,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardFooter from "@/components/layout/DashboardFooter";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    label: "Principal",
    items: [
      { href: "/dashboards/administrador", label: "Inicio", icon: LayoutDashboard },
      { href: "/dashboards/administrador/mascotas", label: "Mascotas", icon: PawPrint },
      { href: "/dashboards/administrador/usuarios", label: "Usuarios", icon: Users },
    ],
  },
  {
    label: "Gestión",
    items: [
      { href: "/dashboards/administrador/gestion_adopciones", label: "Adopciones", icon: FileText },
      { href: "/dashboards/administrador/documentos", label: "Documentos", icon: FileText },
      { href: "/dashboards/administrador/seguimiento", label: "Seguimiento", icon: FileText },
      { href: "/dashboards/administrador/gestion_citas", label: "Citas de adopción", icon: CalendarDays },
      { href: "/dashboards/administrador/citas-veterinarias", label: "Citas veterinarias", icon: CalendarHeart },
      { href: "/dashboards/administrador/esterilizaciones", label: "Esterilizaciones", icon: Stethoscope },
      { href: "/dashboards/administrador/platicas", label: "Pláticas", icon: Megaphone },
      { href: "/dashboards/administrador/reportes-maltrato", label: "Reportes de maltrato", icon: ShieldAlert },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("Cargando…");
  const [adminEmail, setAdminEmail] = useState<string>("");

  const profileRef = useRef<HTMLDivElement>(null);

  // Persist collapsed state
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("impa-admin-collapsed") : null;
    if (saved === "1") setCollapsed(true);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("impa-admin-collapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
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
        setAdminEmail(data.user.email || "");
      } else {
        setAdminName("Administrador");
        setAdminEmail("");
      }
    };
    fetchAdmin();
    const { data: listener } = supabase.auth.onAuthStateChange(() => fetchAdmin());
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Breadcrumb computation
  const breadcrumb = useMemo(() => {
    const all = sections.flatMap((s) => s.items);
    const match = all.find((i) =>
      i.href === "/dashboards/administrador"
        ? pathname === i.href
        : pathname === i.href || pathname.startsWith(i.href + "/")
    );
    if (!match) return { section: "Admin", page: "" };
    const section = sections.find((s) => s.items.includes(match))?.label ?? "Admin";
    return { section, page: match.label };
  }, [pathname]);

  const sidebarWidth = collapsed ? "lg:w-[78px]" : "lg:w-[260px]";

  return (
    <div className="min-h-screen bg-impa-bg relative">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(236,253,236,0.70)_0%,rgba(246,248,246,0.96)_42%,rgba(255,255,255,0.74)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,131,15,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(15,131,15,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* ========= SIDEBAR (desktop) ========= */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-impa-line bg-white/95 backdrop-blur-xl transition-[width] duration-300 ease-impa-out shadow-impa-sm",
          sidebarWidth
        )}
      >
        {/* Brand */}
        <div className="relative flex items-center h-16 px-4 border-b border-impa-line">
          <Link
            href="/dashboards/administrador"
            className="flex items-center gap-2.5 group rounded-lg impa-focus-ring"
          >
            <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-impa-50 to-white border border-impa-line shadow-impa-xs transition-transform duration-200 ease-impa-out group-hover:scale-[1.05]">
              <Image src="/ISOTIPO IMPA.png" alt="IMPA" width={26} height={26} className="impa-logo-mark" priority />
            </span>
            {!collapsed && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="font-bold text-[15px] text-impa-text tracking-tight whitespace-nowrap">
                  IMPA
                  <span className="ml-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-impa-600 bg-impa-50 border border-impa-200 px-1.5 py-px rounded">
                    Admin
                  </span>
                </span>
                <span className="text-[10px] text-impa-muted font-medium whitespace-nowrap">
                  Panel administrativo
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto grid place-items-center w-8 h-8 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto custom-scroll px-3 py-3 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-impa-quiet">
                  {section.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        title={collapsed ? label : undefined}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-lg cursor-pointer impa-focus-ring",
                          "transition-[background-color,color,box-shadow] duration-200 ease-impa-out",
                          collapsed ? "h-10 justify-center px-0" : "h-9 px-2.5",
                          active
                            ? "bg-gradient-to-r from-impa-50 to-impa-50/40 text-impa-700 shadow-impa-xs"
                            : "text-impa-muted hover:text-impa-text hover:bg-impa-surface-3"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-impa-500 to-impa-600" />
                        )}
                        <Icon
                          size={16}
                          className={cn(
                            "shrink-0 transition-colors duration-150",
                            active ? "text-impa-600" : "text-impa-muted group-hover:text-impa-text"
                          )}
                        />
                        {!collapsed && (
                          <span className="text-[13px] font-medium truncate">{label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Profile */}
        <div className="relative border-t border-impa-line p-2" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-lg p-1.5 cursor-pointer transition-colors duration-150",
              profileOpen ? "bg-impa-surface-3" : "hover:bg-impa-surface-3"
            )}
            title={collapsed ? adminName : undefined}
          >
            <span className="grid place-items-center w-9 h-9 rounded-full bg-impa-cta text-white text-xs font-bold shadow-impa-sm ring-2 ring-white shrink-0">
              {(adminName?.[0] || "A").toUpperCase()}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[12px] font-semibold text-impa-text truncate leading-tight">
                  {adminName}
                </p>
                <p className="text-[11px] text-impa-muted truncate leading-tight">
                  {adminEmail || "Administrador"}
                </p>
              </div>
            )}
            {!collapsed && (
              <ChevronDown
                size={14}
                className={cn(
                  "text-impa-muted transition-transform duration-200 shrink-0",
                  profileOpen && "rotate-180"
                )}
              />
            )}
          </button>

          {profileOpen && (
            <div className="absolute bottom-[calc(100%+6px)] left-2 right-2 rounded-xl bg-white border border-impa-line shadow-impa-xl py-1.5 animate-fade-slide z-50 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-impa-line">
                <p className="text-[11px] text-impa-muted">Sesión activa</p>
                <p className="text-sm font-semibold text-impa-text truncate">
                  {adminName}
                </p>
                {adminEmail && (
                  <p className="text-[11px] text-impa-muted truncate">{adminEmail}</p>
                )}
              </div>
              <Link
                href="/dashboards/perfil"
                className="flex items-center gap-2.5 px-3 py-2.5 mx-1.5 mt-1 rounded-lg text-sm text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
                onClick={() => setProfileOpen(false)}
              >
                <User size={14} className="text-impa-600" />
                <span>Mi perfil</span>
              </Link>
              <div className="my-1 border-t border-impa-line" />
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 mx-1.5 mb-1 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
              >
                <LogOutIcon size={14} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========= MOBILE TOPBAR + DRAWER ========= */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-impa-line">
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-impa-200/60 to-transparent" />
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/dashboards/administrador" className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-white border border-impa-line shadow-impa-xs">
              <Image src="/ISOTIPO IMPA.png" alt="IMPA" width={24} height={24} className="impa-logo-mark" priority />
            </span>
            <span className="font-bold text-[14px] text-impa-text tracking-tight">
              IMPA Admin
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="grid place-items-center w-9 h-9 rounded-lg text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-impa-text-strong/55 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-impa-line shadow-impa-xl animate-fade-slide flex flex-col">
            <div className="flex items-center justify-between h-14 px-4 border-b border-impa-line">
              <Link
                href="/dashboards/administrador"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-impa-50 to-white border border-impa-line shadow-impa-xs">
                  <Image src="/ISOTIPO IMPA.png" alt="IMPA" width={24} height={24} className="impa-logo-mark" priority />
                </span>
                <span className="font-bold text-[14px] text-impa-text tracking-tight">
                  IMPA Admin
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid place-items-center w-8 h-8 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto custom-scroll px-3 py-3 space-y-5">
              {sections.map((section) => (
                <div key={section.label}>
                  <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-impa-quiet">
                    {section.label}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map(({ href, label, icon: Icon }) => {
                      const active = isActive(href);
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "relative flex items-center gap-2.5 h-10 px-3 rounded-lg cursor-pointer",
                              "transition-colors duration-200 ease-impa-out",
                              active
                                ? "bg-impa-50 text-impa-700 border border-impa-200"
                                : "text-impa-text hover:bg-impa-surface-3 border border-transparent"
                            )}
                          >
                            <Icon size={16} className={active ? "text-impa-600" : "text-impa-muted"} />
                            <span className="text-sm font-medium">{label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="border-t border-impa-line p-3 space-y-1">
              <Link
                href="/dashboards/perfil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
              >
                <User size={15} className="text-impa-600" />
                Mi perfil
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-impa-cta hover:shadow-impa-glow transition-shadow duration-150 cursor-pointer"
              >
                <LogOutIcon size={15} />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ========= MAIN CONTENT ========= */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-[padding-left] duration-300 ease-impa-out",
          collapsed ? "lg:pl-[78px]" : "lg:pl-[260px]"
        )}
      >
        {/* Desktop topbar */}
        <header className="hidden lg:flex sticky top-0 z-30 h-14 items-center gap-3 px-6 bg-white/70 backdrop-blur-xl border-b border-impa-line">
          <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-impa-200/60 to-transparent" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] font-medium">
            <span className="text-impa-muted">{breadcrumb.section}</span>
            {breadcrumb.page && (
              <>
                <span className="text-impa-quiet">/</span>
                <span className="text-impa-text">{breadcrumb.page}</span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-impa-50 border border-impa-200 text-[10px] font-bold uppercase tracking-wider text-impa-700">
              <Sparkles size={11} />
              Realtime
              <span className="impa-dot bg-impa-500 impa-pulse-ring" />
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-fade-in">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
}
