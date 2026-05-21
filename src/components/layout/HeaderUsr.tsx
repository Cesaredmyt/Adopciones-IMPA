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
    <header className="fixed top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-impa-line shadow-impa-sm">
      <nav
        ref={menuRef}
        className="max-w-[1400px] mx-auto flex items-center justify-between px-5 sm:px-8 h-16"
      >
        {/* Logo */}
        <Link
          href="/dashboards/usuario"
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
              IMPA
            </span>
            <span className="text-[11px] text-impa-muted font-medium">
              Mi espacio
            </span>
          </div>
        </Link>

        {/* Mobile button */}
        <button
          className="lg:hidden text-impa-text p-2 rounded-lg hover:bg-impa-50 transition impa-focus-ring"
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
        <div className="lg:hidden bg-white border-t border-impa-line animate-fade-slide">
          <ul className="flex flex-col p-3 gap-1">
            <MobileLink
              href="/dashboards/usuario"
              label="Inicio"
              icon={LayoutDashboard}
              onClick={() => setOpenMobile(false)}
              router={router}
            />
            <MobileLink
              href="/dashboards/usuario/mascotas"
              label="Adoptables"
              icon={Dog}
              onClick={() => setOpenMobile(false)}
              router={router}
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
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-impa-text hover:bg-impa-50 transition"
              >
                <User size={16} />
                Mi perfil
              </button>
              <button
                onClick={handleLogout}
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
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition impa-focus-ring ${
          open
            ? "bg-impa-50 text-impa-700"
            : "text-impa-muted hover:text-impa-text hover:bg-impa-50/60"
        }`}
      >
        {avatar ? (
          <span className="grid place-items-center w-7 h-7 rounded-full bg-impa-500 text-white text-xs font-bold">
            {(label?.[0] || "U").toUpperCase()}
          </span>
        ) : (
          <Icon size={16} />
        )}
        <span className="max-w-[120px] truncate">{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-60 rounded-xl bg-white border border-impa-line shadow-impa-lg py-1.5 animate-fade-slide overflow-hidden`}
        >
          {items.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                href={item.href}
                onClick={onToggle}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-impa-text hover:bg-impa-50 hover:text-impa-700 transition"
              >
                <item.icon size={15} className="text-impa-500" />
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm text-impa-text hover:bg-impa-50 transition"
              >
                <item.icon size={15} className="text-impa-muted" />
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
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <li>
      <button
        onClick={() => {
          router.push(href);
          onClick?.();
        }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-impa-text hover:bg-impa-50 transition"
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
        className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-impa-text hover:bg-impa-50 transition"
      >
        <Icon size={16} />
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="ml-7 mt-1 rounded-xl bg-impa-50 border border-impa-line">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                router.push(item.href);
                setOpenMobile(false);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 w-full text-left text-sm text-impa-text hover:bg-white transition"
            >
              <item.icon size={14} className="text-impa-500" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
