export function getEstadoChip(estado: string) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold border";

  switch (estado.toLowerCase()) {
    case "completado":
      return `${base} bg-impa-50 text-impa-700 border-impa-200`;
    case "activo":
      return `${base} bg-impa-50 text-impa-700 border-impa-200`;
    case "próximo":
      return `${base} bg-amber-50 text-amber-700 border-amber-200`;
    default:
      return `${base} bg-impa-bg-elevated text-impa-muted border-impa-line`;
  }
}
