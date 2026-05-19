import { NextResponse } from "next/server";
import { sendAccountConfirmation } from "@/lib/email/sendAccountConfirmation";
import {
  isAuthorizedInternalRequest,
  unauthorizedResponse,
} from "@/lib/email/internalAuth";

// Endpoint INTERNO — requiere cabecera x-internal-token.
// El reenvío legítimo desde el navegador va por /api/auth/resend-verification
// (que regenera el link server-side). Este endpoint queda como wrapper legacy.
//
// Fase 5: eliminar este endpoint.

export async function POST(req: Request) {
  if (!isAuthorizedInternalRequest(req)) {
    return unauthorizedResponse();
  }

  try {
    const { email, nombre, confirmationUrl } = await req.json();

    if (!email || !confirmationUrl) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos para enviar el correo." },
        { status: 400 }
      );
    }

    await sendAccountConfirmation({
      to: email,
      nombre: nombre ?? "",
      confirmationUrl,
      subject: "Reenvío de confirmación – IMPA 🐾",
    });

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Error reenviando correo de confirmación");
    return NextResponse.json(
      { ok: false, error: "Error al reenviar el correo." },
      { status: 500 }
    );
  }
}
