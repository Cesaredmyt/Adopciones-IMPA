import { NextResponse } from "next/server";
import { sendAccountConfirmation } from "@/lib/email/sendAccountConfirmation";
import {
  isAuthorizedInternalRequest,
  unauthorizedResponse,
} from "@/lib/email/internalAuth";

// Endpoint INTERNO — requiere cabecera x-internal-token.
// El registro normal ahora llama a sendAccountConfirmation() directamente desde
// /api/auth/register. Este endpoint queda como wrapper para callers legacy.
//
// Fase 5: eliminar este endpoint y exigir uso de la función importable.

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
    });

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Error enviando correo de registro");
    return NextResponse.json(
      { ok: false, error: "Error al enviar el correo." },
      { status: 500 }
    );
  }
}
