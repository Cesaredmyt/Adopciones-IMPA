import { requireRole, ROLES } from "@/lib/auth/requireRole";
import UserHeader from "@/components/layout/HeaderUsr";
import DashboardFooter from "@/components/layout/DashboardFooter";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole({
    allow: [ROLES.usuario],
    fallback: "/dashboards/administrador",
  });

  return (
    <div className="min-h-screen bg-impa-bg relative flex flex-col">
      <UserHeader />

      {/* Decorative ambient mesh — más verde, menos blanco */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[720px] h-[720px] rounded-full bg-impa-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[640px] h-[640px] rounded-full bg-impa-100/40 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[760px] h-[420px] rounded-full bg-impa-100/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,131,15,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(15,131,15,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <main className="relative flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-fade-in">
        <div className="mx-auto max-w-[1400px]">{children}</div>
      </main>

      <DashboardFooter />
    </div>
  );
}
