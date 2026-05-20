import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildEsterilizacionProgramadaEmail } from "../templates/esterilizacionProgramada";

export async function POST(req: Request) {
  try {
    const { email, nombre, nombreMascota, folio, fechaTexto } =
      await req.json();

    if (!email || !nombre || !nombreMascota || !folio || !fechaTexto) {
      return NextResponse.json(
        { error: "Faltan datos para enviar el correo." },
        { status: 400 }
      );
    }

    const { subject, html } = buildEsterilizacionProgramadaEmail({
      nombre,
      nombreMascota,
      folio,
      fechaTexto,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("esterilizacion-programada:error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
