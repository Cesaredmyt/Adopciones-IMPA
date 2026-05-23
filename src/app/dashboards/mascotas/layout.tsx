import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";

/**
 * Layout de la galería pública de adopciones.
 * Inspirado en el screen "IMPA Pet Adoptions Gallery" de Stitch:
 * fondo cream cálido con mesh radial suave para destacar las cards de mascotas.
 */
export default function MascotasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Fondo cream cálido (público, identidad acogedora) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden impa-page-bg-warm" />

      {/* Grid sutil verde IMPA encima */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,131,15,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(15,131,15,0.55) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <Header />
      <PageShell width="wide">{children}</PageShell>
    </div>
  );
}
