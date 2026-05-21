import { requireRole, ROLES } from "@/lib/auth/requireRole";
import AdminHeader from "@/components/layout/HeaderAd";
import Providers from "@/app/providers";
import "react-datepicker/dist/react-datepicker.css";

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
      <div className="min-h-screen bg-[var(--impa-bg)] relative">
        <AdminHeader />

        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute -top-32 -left-24 w-[40rem] h-[40rem] rounded-full bg-impa-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[45rem] h-[45rem] rounded-full bg-impa-100/30 blur-3xl" />
        </div>

        <main className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </Providers>
  );
}
