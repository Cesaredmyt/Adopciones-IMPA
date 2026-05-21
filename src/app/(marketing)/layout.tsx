import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Header";
import FooterNewsletter from "@/components/layout/FooterNewsletter";
import { Heart, MapPin, Phone, Mail, Facebook, Instagram, ArrowUpRight } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient mesh global (verde IMPA) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full bg-impa-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-impa-100/55 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[700px] h-[400px] rounded-full bg-impa-100/40 blur-3xl" />
      </div>

      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* ============ FOOTER PREMIUM ============ */}
      <footer className="relative overflow-hidden border-t border-impa-line bg-white">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-300/60 to-transparent" />

        {/* Ambient mesh */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-impa-100/60 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-[380px] h-[380px] rounded-full bg-impa-50 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-12 gap-10">
          {/* Brand block */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white border border-impa-line shadow-impa-xs transition-transform duration-200 ease-impa-out group-hover:scale-[1.04]">
                <Image
                  src="/impa-isotipo.svg"
                  alt="IMPA"
                  width={28}
                  height={28}
                />
              </span>
              <span className="font-bold text-xl text-impa-text-strong tracking-tight">
                IMPA
              </span>
            </Link>
            <p className="mt-4 text-sm text-impa-muted leading-relaxed max-w-md">
              Instituto Michoacano de Protección Animal — promovemos la adopción
              responsable, la esterilización gratuita y el bienestar animal en
              Michoacán.
            </p>

            <div className="mt-5 space-y-2.5 text-sm">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-impa-muted hover:text-impa-700 transition-colors duration-150 cursor-pointer group"
              >
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-impa-50 border border-impa-100 text-impa-600 group-hover:bg-impa-100 transition-colors duration-150">
                  <MapPin size={14} />
                </span>
                Morelia, Michoacán · México
              </a>
              <a
                href="tel:+524434000000"
                className="inline-flex items-center gap-2 text-impa-muted hover:text-impa-700 transition-colors duration-150 cursor-pointer group"
              >
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-impa-50 border border-impa-100 text-impa-600 group-hover:bg-impa-100 transition-colors duration-150">
                  <Phone size={14} />
                </span>
                +52 (443) 400 0000
              </a>
              <a
                href="mailto:contacto@impa.org.mx"
                className="inline-flex items-center gap-2 text-impa-muted hover:text-impa-700 transition-colors duration-150 cursor-pointer group"
              >
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-impa-50 border border-impa-100 text-impa-600 group-hover:bg-impa-100 transition-colors duration-150">
                  <Mail size={14} />
                </span>
                contacto@impa.org.mx
              </a>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid place-items-center w-9 h-9 rounded-lg bg-white border border-impa-line text-impa-muted hover:text-impa-700 hover:border-impa-300 hover:bg-impa-50 transition-colors duration-150 cursor-pointer shadow-impa-xs"
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-impa-quiet mb-4">
              Explora
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/dashboards/mascotas", label: "Mascotas en adopción" },
                { href: "/nosotros", label: "Sobre IMPA" },
                { href: "/register", label: "Crear cuenta" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1 text-impa-muted hover:text-impa-700 transition-colors duration-150 cursor-pointer group"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-impa-quiet mb-4">
              Acceso
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/login", label: "Iniciar sesión" },
                { href: "/recuperacion", label: "Recuperar contraseña" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1 text-impa-muted hover:text-impa-700 transition-colors duration-150 cursor-pointer group"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-impa-quiet mb-4">
              Mantente al día
            </h4>
            <p className="text-sm text-impa-muted mb-3 leading-relaxed">
              Recibe noticias sobre adopciones, campañas y eventos.
            </p>
            <FooterNewsletter />
          </div>
        </div>

        {/* Bottom strip */}
        <div className="relative border-t border-impa-line bg-impa-surface-2/60">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-impa-muted">
            <p>© {new Date().getFullYear()} IMPA. Todos los derechos reservados.</p>
            <p className="inline-flex items-center gap-1">
              Hecho con
              <Heart size={12} className="text-impa-500 fill-impa-500" />
              en Morelia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
