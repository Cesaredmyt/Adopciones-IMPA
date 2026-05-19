import { requireRole, ROLES } from "@/lib/auth/requireRole";
import AdminHeader from "@/components/layout/HeaderAd";
import { Toaster } from "sonner";
import Providers from "@/app/providers";
import "react-datepicker/dist/react-datepicker.css";

// Server Component: el chequeo de rol corre en el servidor ANTES de enviar
// HTML al cliente. Si la sesión no es válida o el rol no es admin, el guard
// redirige sin que ningún render llegue al browser.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole({
    allow: [ROLES.admin],
    fallback: "/dashboards/usuario",
  });

  return (
    <Providers>
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{
          style: { borderRadius: "12px", fontSize: "0.95rem" },
        }}
      />

      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        <AdminHeader />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-orange-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[45rem] h-[45rem] rounded-full bg-amber-100/40 blur-3xl" />
        </div>

        <main className="relative px-6 md:px-8 py-6 mt-[6.5rem] md:mt-[5.5rem]">
          <div
            className="mx-auto max-w-auto bg-white/85 backdrop-blur-sm rounded-3xl border border-slate-100 p-6 md:p-8"
            style={{ boxShadow: "0 20px 60px rgba(2,6,23,.06)" }}
          >
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}
