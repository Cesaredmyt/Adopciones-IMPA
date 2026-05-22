export const ReportesKeys = {
  all: ["reportes-maltrato"] as const,

  admin: {
    all: () => [...ReportesKeys.all, "admin"] as const,
    infinite: (search?: string) =>
      [...ReportesKeys.all, "admin", "infinite", search ?? ""] as const,
    detalle: (id: string) =>
      [...ReportesKeys.all, "admin", "detalle", id] as const,
    bitacora: (id: string) =>
      [...ReportesKeys.all, "admin", "bitacora", id] as const,
  },
};
