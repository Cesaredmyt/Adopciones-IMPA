"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

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
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-impa-line shadow-impa-sm"
          : "bg-white/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group impa-focus-ring rounded-lg"
        >
          <Image
            src="/impa-isotipo.svg"
            alt="IMPA"
            width={36}
            height={36}
            priority
            className="rounded-lg shadow-impa-xs"
          />
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
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all impa-focus-ring ${
                    active
                      ? "text-impa-700"
                      : "text-impa-muted hover:text-impa-text hover:bg-impa-50"
                  }`}
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
            className="px-4 py-2 text-sm font-medium text-impa-muted hover:text-impa-text rounded-lg transition impa-focus-ring"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-impa-500 text-white shadow-impa-sm hover:bg-impa-600 active:bg-impa-700 transition-all impa-focus-ring"
          >
            Crear cuenta
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-impa-text p-2 rounded-lg hover:bg-impa-50 transition impa-focus-ring"
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
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? "bg-impa-50 text-impa-700"
                        : "text-impa-text hover:bg-impa-50"
                    }`}
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
                className="px-4 py-2.5 text-sm font-medium text-impa-text rounded-lg hover:bg-impa-50 transition text-center"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-impa-500 hover:bg-impa-600 rounded-lg transition text-center"
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
