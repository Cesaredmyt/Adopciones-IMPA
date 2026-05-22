import { renderImpaEmail, infoBox } from "./_layout";

export function buildPlaticaSolicitadaEmail({
  nombre,
  folio,
}: {
  nombre: string;
  folio: string;
}) {
  const subject = `Solicitud de plática recibida · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Recibimos tu solicitud de plática de concientización. Nuestro equipo la
      revisará y te avisará por correo cuando esté agendada.
    </p>
    ${infoBox("Folio", folio, { tone: "neutral" })}
    <p style="margin:14px 0 0;">
      Puedes consultar el estado en tu panel:
      <strong>Mi espacio · Pláticas</strong>.
    </p>
    <p style="margin:14px 0 0;">Gracias por sumarte a la causa por el bienestar animal.</p>
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
