import { NextResponse } from "next/server";
import { sendEmail } from "../sendEmail";
import resetPassword from "../templates/resetPassword";
import citaAdopcion from "../templates/citaAdopcion";
import citaConocerMascota from "../templates/citaConocerMascota";
import citaVeterinaria from "../templates/citaVeterinaria";
import documentacionAprobada from "../templates/documentacionAprobada";
import documentacionRechazada from "../templates/documentacionRechazada";
import recordatorioCita from "../templates/recordatorioCita";
import {
  isAuthorizedInternalRequest,
  unauthorizedResponse,
} from "@/lib/email/internalAuth";

const templates: any = {
  resetPassword,
  citaAdopcion,
  citaConocerMascota,
  citaVeterinaria,
  documentacionAprobada,
  documentacionRechazada,
  recordatorioCita,
};

// Endpoint INTERNO — requiere cabecera x-internal-token.
// Sólo es llamado server-to-server por /api/auth/reset-password.
export async function POST(req: Request) {
  if (!isAuthorizedInternalRequest(req)) {
    return unauthorizedResponse();
  }

  try {
    const { type, email, data } = await req.json();

    if (!templates[type]) {
      return NextResponse.json(
        { error: `El correo '${type}' no existe.` },
        { status: 400 }
      );
    }

    const html = templates[type](data);

    await sendEmail({
      to: email,
      subject: html.subject,
      html: html.body,
    });

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Error en /api/email/send");
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
