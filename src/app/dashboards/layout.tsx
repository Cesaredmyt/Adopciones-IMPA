/**
 * Layout compartido por dashboards admin y usuario.
 *
 * El footer NO se renderiza aquí — cada layout hijo (admin/usuario) lo coloca
 * dentro de su propio padded container para evitar empalmar con la sidebar
 * fija del admin.
 */
export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
