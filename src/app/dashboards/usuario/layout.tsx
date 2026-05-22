import { requireRole, ROLES } from "@/lib/auth/requireRole";
import UserHeader from "@/components/layout/HeaderUsr";

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
    <div className="min-h-screen bg-impa-bg relative">
      <UserHeader />

      {/* Decorative ambient mesh */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(236,253,236,0.66)_0%,rgba(246,248,246,0.98)_45%,rgba(255,255,255,0.74)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
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
  );
}
