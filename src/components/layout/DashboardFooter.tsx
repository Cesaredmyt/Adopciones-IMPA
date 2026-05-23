/**
 * Footer institucional compartido por dashboards admin y usuario.
 *
 * Se renderiza DENTRO del padded container del shell correspondiente
 * (AdminShell para admin, usuario/layout para usuario) — nunca a nivel raíz —
 * para que respete el ancho de la sidebar fija del admin.
 */
export default function DashboardFooter() {
  return (
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
  );
}
