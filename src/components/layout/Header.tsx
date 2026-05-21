"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/dashboards/mascotas", label: "Adopciones" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-impa-out",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-impa-line shadow-impa-xs"
          : "bg-white/40 backdrop-blur-md border-b border-transparent"
      )}
    >
      {scrolled && (
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-impa-200/60 to-transparent" />
      )}

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group impa-focus-ring rounded-lg"
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
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-[15px] text-impa-text tracking-tight">
              IMPA
            </span>
            <span className="text-[11px] text-impa-muted font-medium">
              Protección Animal · Michoacán
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium rounded-lg impa-focus-ring transition-colors duration-200 ease-impa-out cursor-pointer",
                    active
                      ? "text-impa-700"
                      : "text-impa-muted hover:text-impa-text hover:bg-impa-surface-3"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-3.5 right-3.5 -bottom-px h-0.5 rounded-full bg-impa-500" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-impa-muted hover:text-impa-text rounded-lg transition-colors duration-200 impa-focus-ring cursor-pointer"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-impa-cta text-white shadow-impa-sm hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-impa-out impa-focus-ring cursor-pointer"
          >
            Crear cuenta
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-impa-text p-2 rounded-lg hover:bg-impa-surface-3 transition-colors duration-150 impa-focus-ring cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-impa-line animate-fade-slide">
          <ul className="flex flex-col p-3 gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
                      active
                        ? "bg-impa-50 text-impa-700 border border-impa-200"
                        : "text-impa-text hover:bg-impa-surface-3"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2 mt-2 border-t border-impa-line flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-impa-text rounded-lg hover:bg-impa-surface-3 transition-colors duration-150 text-center cursor-pointer"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-impa-cta hover:shadow-impa-glow rounded-lg transition-shadow duration-150 text-center cursor-pointer"
              >
                Crear cuenta
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
