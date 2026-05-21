export function getEstadoChip(estado: string) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";

  switch (estado.toLowerCase()) {
    case "completado":
      return `${base} bg-green-100 text-green-700`;
    case "activo":
      return `${base} bg-[#a8f1a8] text-[#0f830f]`;
    case "próximo":
      return `${base} bg-yellow-100 text-yellow-700`;
    default:
      return `${base} bg-gray-100 text-gray-500`;
  }
}
