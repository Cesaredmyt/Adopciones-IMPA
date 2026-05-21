import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Header";
import { Heart, MapPin } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--impa-bg)]">
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      <footer className="border-t border-impa-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
              <Image
                src="/impa-isotipo.svg"
                alt="IMPA"
                width={36}
                height={36}
                className="rounded-lg shadow-impa-xs"
              />
              <span className="font-bold text-lg text-impa-text">IMPA</span>
            </Link>
            <p className="text-sm text-impa-muted leading-relaxed max-w-sm">
              Instituto Michoacano de Protección Animal — promovemos la adopción
              responsable, la esterilización gratuita y el bienestar animal en
              Michoacán.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-impa-muted">
              <MapPin size={13} />
              Morelia, Michoacán · México
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-impa-text mb-3">
              Explora
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboards/mascotas"
                  className="text-impa-muted hover:text-impa-700 transition"
                >
                  Mascotas en adopción
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-impa-muted hover:text-impa-700 transition"
                >
                  Sobre IMPA
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-impa-muted hover:text-impa-700 transition"
                >
                  Crear cuenta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-impa-text mb-3">
              Acceso
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/login"
                  className="text-impa-muted hover:text-impa-700 transition"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/recuperacion"
                  className="text-impa-muted hover:text-impa-700 transition"
                >
                  Recuperar contraseña
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-impa-line">
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
