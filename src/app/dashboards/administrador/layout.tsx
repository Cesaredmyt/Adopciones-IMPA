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
      <div className="min-h-screen bg-impa-bg relative">
        <AdminHeader />

        {/* Decorative ambient mesh */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute -top-40 -left-32 w-[44rem] h-[44rem] rounded-full bg-impa-200/25 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 w-[48rem] h-[48rem] rounded-full bg-impa-100/35 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,131,15,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(15,131,15,0.6) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <main className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-fade-in">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </Providers>
  );
}
