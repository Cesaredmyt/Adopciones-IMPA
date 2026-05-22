import { renderImpaEmail, infoBox } from "./_layout";

export function buildReporteRecibidoEmail({
  nombre,
  folio,
  asunto,
}: {
  nombre: string;
  folio: string;
  asunto: string;
}) {
  const subject = `Reporte recibido · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Hemos recibido tu reporte de maltrato animal. Nuestro equipo lo revisará
      a la brevedad y, si lo amerita, lo turnaremos para investigación.
    </p>
    ${infoBox("Folio", folio, { tone: "neutral" })}
    ${infoBox("Asunto", asunto, { tone: "neutral" })}
    <p style="margin:14px 0 0;">
      Guarda este folio: lo necesitarás para consultar el estado del caso en la
      sección de seguimiento.
    </p>
    <p style="margin:14px 0 0;">Gracias por ayudar a proteger a los animales.</p>
  `;
  return {
    subject,
    html: renderImpaEmail({
      tone: "neutral",
      title: "Reporte recibido",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
