"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  HeartIcon,
  Menu,
  X,
  User,
  LogOutIcon,
  ChevronDown,
  PawPrint,
  Dog,
  Stethoscope,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownItem = {
  href?: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
};

export default function UserHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState("Cargando…");

  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/dashboards/usuario"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const nombre = data.user?.user_metadata?.nombre;
      setUserName(nombre || "Usuario");
    };
    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-impa-line shadow-impa-xs">
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-impa-200/60 to-transparent" />

      <nav
        ref={menuRef}
        className="max-w-[1400px] mx-auto flex items-center justify-between px-5 sm:px-8 h-16"
      >
        {/* Logo */}
        <Link
          href="/dashboards/usuario"
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
            </span>
            <span className="text-[11px] text-impa-muted font-medium">
              Mi espacio
            </span>
          </div>
        </Link>

        {/* Mobile button */}
        <button
          className="lg:hidden text-impa-text p-2 rounded-lg hover:bg-impa-surface-3 transition-colors duration-150 impa-focus-ring cursor-pointer"
          onClick={() => setOpenMobile(!openMobile)}
          aria-label="Abrir menú"
        >
          {openMobile ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          <NavItem
            href="/dashboards/usuario"
            label="Inicio"
            icon={LayoutDashboard}
            active={isActive("/dashboards/usuario")}
          />
          <NavItem
            href="/dashboards/usuario/mascotas"
            label="Adoptables"
            icon={Dog}
            active={isActive("/dashboards/usuario/mascotas")}
          />

          <Dropdown
            label="Adopción"
            icon={HeartIcon}
            open={openDropdown === "adopcion"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "adopcion" ? null : "adopcion")
            }
            items={[
              {
                href: "/dashboards/usuario/adopcion",
                label: "Proceso de adopción",
                icon: HeartIcon,
              },
              {
                href: "/dashboards/usuario/citas",
                label: "Mis citas de adopción",
                icon: CalendarCheck,
              },
            ]}
          />

          <Dropdown
            label="Mis Mascotas"
            icon={PawPrint}
            open={openDropdown === "mascotas"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "mascotas" ? null : "mascotas")
            }
            items={[
              {
                href: "/dashboards/usuario/mis-mascotas",
                label: "Ver mis mascotas",
                icon: PawPrint,
              },
              {
                href: "/dashboards/usuario/citas-veterinarias",
                label: "Citas veterinarias",
                icon: Stethoscope,
              },
              {
                href: "/dashboards/usuario/esterilizaciones",
                label: "Esterilizaciones",
                icon: Stethoscope,
              },
            ]}
          />

          <li className="pl-2 ml-1 border-l border-impa-line">
            <Dropdown
              label={userName}
              icon={User}
              avatar
              open={openDropdown === "usuario"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "usuario" ? null : "usuario")
              }
              items={[
                { href: "/dashboards/perfil", label: "Mi perfil", icon: User },
                { onClick: handleLogout, label: "Cerrar sesión", icon: LogOutIcon },
              ]}
              align="right"
            />
          </li>
        </ul>
      </nav>

      {/* Mobile nav */}
      {openMobile && (
        <div className="lg:hidden bg-white border-t border-impa-line animate-fade-slide max-h-[calc(100vh-4rem)] overflow-y-auto custom-scroll">
          <ul className="flex flex-col p-3 gap-1">
            <MobileLink
              href="/dashboards/usuario"
              label="Inicio"
              icon={LayoutDashboard}
              onClick={() => setOpenMobile(false)}
              router={router}
              active={isActive("/dashboards/usuario")}
            />
            <MobileLink
              href="/dashboards/usuario/mascotas"
              label="Adoptables"
              icon={Dog}
              onClick={() => setOpenMobile(false)}
              router={router}
              active={isActive("/dashboards/usuario/mascotas")}
            />

            <MobileDropdown
              label="Adopción"
              icon={HeartIcon}
              items={[
                {
                  href: "/dashboards/usuario/adopcion",
                  label: "Proceso de adopción",
                  icon: HeartIcon,
                },
                {
                  href: "/dashboards/usuario/citas",
                  label: "Mis citas de adopción",
                  icon: CalendarCheck,
                },
              ]}
              router={router}
              setOpenMobile={setOpenMobile}
            />

            <MobileDropdown
              label="Mis Mascotas"
              icon={PawPrint}
              items={[
                {
                  href: "/dashboards/usuario/mis-mascotas",
                  label: "Ver mis mascotas",
                  icon: PawPrint,
                },
                {
                  href: "/dashboards/usuario/citas-veterinarias",
                  label: "Citas veterinarias",
                  icon: Stethoscope,
                },
                {
                  href: "/dashboards/usuario/esterilizaciones",
                  label: "Esterilizaciones",
                  icon: Stethoscope,
                },
              ]}
              router={router}
              setOpenMobile={setOpenMobile}
            />

            <li className="pt-2 mt-2 border-t border-impa-line flex flex-col gap-1">
              <button
                onClick={() => {
                  router.push("/dashboards/perfil");
                  setOpenMobile(false);
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
              >
                <User size={16} />
                Mi perfil
              </button>
              <button
                onClick={handleLogout}
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

/* ============================ Subcomponents ============================ */

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium impa-focus-ring transition-all duration-200 ease-impa-out cursor-pointer",
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
}

function Dropdown({
  label,
  icon: Icon,
  open,
  onToggle,
  items,
  align = "left",
  avatar = false,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  open: boolean;
  onToggle: () => void;
  items: DropdownItem[];
  align?: "left" | "right";
  avatar?: boolean;
}) {
  return (
    <li className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium impa-focus-ring transition-all duration-200 ease-impa-out cursor-pointer",
          open
            ? "text-impa-700 bg-impa-50 border border-impa-200/70 shadow-impa-xs"
            : "text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 border border-transparent"
        )}
      >
        {avatar ? (
          <span className="grid place-items-center w-8 h-8 rounded-full bg-impa-cta text-white text-xs font-bold shadow-impa-sm ring-2 ring-white">
            {(label?.[0] || "U").toUpperCase()}
          </span>
        ) : (
          <Icon size={16} className={open ? "text-impa-600" : ""} />
        )}
        <span className="max-w-[120px] truncate">{label}</span>
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200", open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute mt-2 w-64 rounded-2xl bg-white border border-impa-line shadow-impa-xl py-1.5 animate-fade-slide overflow-hidden",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                href={item.href}
                onClick={onToggle}
                className="flex items-center gap-2.5 px-3 py-2.5 mx-1.5 my-0.5 rounded-lg text-sm text-impa-text hover:bg-impa-surface-3 hover:text-impa-700 transition-colors duration-150 cursor-pointer"
              >
                <item.icon size={15} className="text-impa-600" />
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 mx-1.5 my-0.5 rounded-lg text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </li>
  );
}

function MobileLink({
  href,
  label,
  icon: Icon,
  onClick,
  router,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  router: ReturnType<typeof useRouter>;
  active?: boolean;
}) {
  return (
    <li>
      <button
        onClick={() => {
          router.push(href);
          onClick?.();
        }}
        className={cn(
          "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
          active
            ? "bg-impa-50 text-impa-700 border border-impa-200"
            : "text-impa-text hover:bg-impa-surface-3"
        )}
      >
        <Icon size={16} />
        {label}
      </button>
    </li>
  );
}

function MobileDropdown({
  label,
  icon: Icon,
  items,
  router,
  setOpenMobile,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: { href: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[];
  router: ReturnType<typeof useRouter>;
  setOpenMobile: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
      >
        <Icon size={16} />
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={cn("ml-auto transition-transform duration-200", open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div className="ml-7 mt-1 rounded-xl bg-impa-surface-2 border border-impa-line">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                router.push(item.href);
                setOpenMobile(false);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 w-full text-left text-sm text-impa-text hover:bg-white transition-colors duration-150 cursor-pointer"
            >
              <item.icon size={14} className="text-impa-600" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
