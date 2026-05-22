import type { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Reportar maltrato animal",
  description:
    "Reporta de forma anónima o identificada cualquier caso de maltrato animal en Michoacán. El IMPA revisará tu reporte.",
};

export default function ReportarMaltratoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient mesh verde IMPA */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full bg-impa-200/30 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-impa-100/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[700px] h-[400px] rounded-full bg-impa-100/30 blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {children}
        </div>
      </main>

      <footer className="border-t border-impa-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-impa-muted">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-impa-text">
              Instituto Michoacano de Protección Animal
            </span>
          </p>
          <p>Plataforma oficial IMPA · Morelia</p>
        </div>
      </footer>
    </div>
  );
}
