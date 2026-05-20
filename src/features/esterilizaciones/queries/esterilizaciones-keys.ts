export const EsterilizacionesKeys = {
  all: ["esterilizaciones"] as const,

  admin: {
    all: () => [...EsterilizacionesKeys.all, "admin"] as const,
    infinite: (search?: string) =>
      [
        ...EsterilizacionesKeys.all,
        "admin",
        "infinite",
        search ?? "",
      ] as const,
  },

  usuario: {
    all: (authId: string) =>
      [...EsterilizacionesKeys.all, "usuario", authId] as const,
    infinite: (authId: string) =>
      [...EsterilizacionesKeys.all, "usuario", authId, "infinite"] as const,
    mascotas: (authId: string) =>
      [
        ...EsterilizacionesKeys.all,
        "usuario",
        authId,
        "mascotas-elegibles",
      ] as const,
  },
};
