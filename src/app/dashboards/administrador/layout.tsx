import { requireRole, ROLES } from "@/lib/auth/requireRole";
import AdminShell from "@/components/layout/AdminShell";
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
      <AdminShell>{children}</AdminShell>
    </Providers>
  );
}
