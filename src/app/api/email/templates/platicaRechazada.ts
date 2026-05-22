import { renderImpaEmail, infoBox } from "./_layout";

export function buildPlaticaRechazadaEmail({
  nombre,
  folio,
  motivo,
}: {
  nombre: string;
  folio: string;
  motivo: string;
}) {
  const subject = `Sobre tu solicitud de plática · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Lamentamos informarte que, en esta ocasión, no nos fue posible agendar la
      plática que solicitaste.
    </p>
    ${infoBox("Folio", folio, { tone: "danger" })}
    ${infoBox("Motivo", motivo, { tone: "danger" })}
    <p style="margin:14px 0 0;">
      Si tienes dudas o quieres proponer una nueva fecha, puedes responder o
      crear otra solicitud desde tu panel.
    </p>
  `;
  return {
    subject,
    html: renderImpaEmail({
      tone: "danger",
      title: "Solicitud no aprobada",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
