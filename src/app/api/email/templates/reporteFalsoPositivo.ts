import { renderImpaEmail, infoBox } from "./_layout";

export function buildReporteFalsoPositivoEmail({
  nombre,
  folio,
}: {
  nombre: string;
  folio: string;
}) {
  const subject = `Cierre de tu reporte · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tras revisar tu reporte, nuestro equipo concluyó que no se identificó una
      situación de maltrato en este caso.
    </p>
    ${infoBox("Folio", folio, { tone: "warning" })}
    <p style="margin:14px 0 0;">
      Agradecemos tu reporte. Si crees que hay nueva información o evidencia,
      puedes crear un nuevo reporte y la revisaremos.
    </p>
  `;
  return {
    subject,
    html: renderImpaEmail({
      tone: "warning",
      title: "Reporte cerrado",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
