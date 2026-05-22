import { renderImpaEmail, infoBox } from "./_layout";

export function buildReporteEnInvestigacionEmail({
  nombre,
  folio,
}: {
  nombre: string;
  folio: string;
}) {
  const subject = `Tu reporte está en investigación · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tu reporte fue clasificado y pasó a la etapa de <strong>investigación</strong>.
      Nuestro equipo está revisando los hechos en campo.
    </p>
    ${infoBox("Folio", folio, { tone: "info" })}
    <p style="margin:14px 0 0;">
      Te avisaremos en cuanto haya una resolución.
    </p>
  `;
  return {
    subject,
    html: renderImpaEmail({
      tone: "info",
      title: "Reporte en investigación",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
