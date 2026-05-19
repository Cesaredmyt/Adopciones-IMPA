// Guard para endpoints de correo que NO deben ser llamables desde el browser
// público: sólo desde otros route handlers / server actions que incluyan la
// cabecera x-internal-token. En Fase 0 protege los endpoints del flujo auth.
//
// Reemplazar en Fase 5 por un sistema de eventos internos (queue) que ni
// siquiera exponga endpoints HTTP.

import { NextResponse } from "next/server";

const HEADER_NAME = "x-internal-token";

export function getInternalToken(): string | undefined {
  return process.env.INTERNAL_API_SECRET;
}

export function isAuthorizedInternalRequest(req: Request): boolean {
  const expected = getInternalToken();
  if (!expected) return false;
  const received = req.headers.get(HEADER_NAME);
  if (!received) return false;
  // Comparación de longitud constante para evitar timing attacks.
  if (received.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ received.charCodeAt(i);
  }
  return diff === 0;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

export const INTERNAL_HEADER_NAME = HEADER_NAME;
