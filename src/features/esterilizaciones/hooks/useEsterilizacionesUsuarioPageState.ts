"use client";

import { useState } from "react";

export type ModoEsterilizacionesUsuario = "lista" | "solicitar";

export function useEsterilizacionesUsuarioPageState() {
  const [modo, setModo] = useState<ModoEsterilizacionesUsuario>("lista");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mascotaId, setMascotaId] = useState<string | null>(null);
  const [peso, setPeso] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");

  const resetForm = () => {
    setMascotaId(null);
    setPeso("");
    setObservaciones("");
  };

  return {
    modo,
    setModo,
    mensaje,
    setMensaje,
    mascotaId,
    setMascotaId,
    peso,
    setPeso,
    observaciones,
    setObservaciones,
    resetForm,
  };
}
