import { renderImpaEmail, infoBox } from "./_layout";

export function buildEsterilizacionSolicitadaEmail({
  nombre,
  nombreMascota,
  folio,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
}) {
  const subject = `Solicitud de esterilización recibida · Folio ${folio}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Recibimos tu solicitud de esterilización para <strong>${nombreMascota}</strong>.
      Nuestro equipo veterinario la revisará y te avisará por correo cuando esté
      aprobada y agendada.
    </p>

    ${infoBox("Folio", folio, { tone: "neutral" })}

    <p style="margin:14px 0 0;">
      Mientras tanto, puedes consultar el estado en tu panel:
      <strong>Mis mascotas · Esterilizaciones</strong>.
    </p>

    <p style="margin:14px 0 0;">Gracias por cuidar de tu mascota.</p>
  `;

  return {
    subject,
    html: renderImpaEmail({
      tone: "neutral",
      title: "Solicitud recibida",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
