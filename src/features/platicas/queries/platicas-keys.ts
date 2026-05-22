export const PlaticasKeys = {
  all: ["platicas"] as const,

  admin: {
    all: () => [...PlaticasKeys.all, "admin"] as const,
    infinite: (search?: string) =>
      [...PlaticasKeys.all, "admin", "infinite", search ?? ""] as const,
  },

  usuario: {
    all: (authId: string) =>
      [...PlaticasKeys.all, "usuario", authId] as const,
    infinite: (authId: string) =>
      [...PlaticasKeys.all, "usuario", authId, "infinite"] as const,
  },
};
