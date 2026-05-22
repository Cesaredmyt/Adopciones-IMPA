"use client";

import { useState } from "react";

export type ModoPlaticasUsuario = "lista" | "solicitar";

export function usePlaticasUsuarioPageState() {
  const [modo, setModo] = useState<ModoPlaticasUsuario>("lista");
  const [mensaje, setMensaje] = useState<string | null>(null);
  return { modo, setModo, mensaje, setMensaje };
}
