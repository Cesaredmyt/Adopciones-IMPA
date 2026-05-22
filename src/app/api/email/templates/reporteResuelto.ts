import { renderImpaEmail, infoBox } from "./_layout";

export function buildReporteResueltoEmail({
  nombre,
  folio,
  resolucion,
}: {
  nombre: string;
  folio: string;
  resolucion: string;
}) {
  const subject = `Tu reporte fue atendido · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      ¡Buenas noticias! Hemos atendido tu reporte de maltrato.
    </p>
    ${infoBox("Folio", folio, { tone: "success" })}
    ${
      resolucion
        ? infoBox("Resolución", resolucion, { tone: "success" })
        : ""
    }
    <p style="margin:14px 0 0;">
      Gracias a ti pudimos actuar a favor de los animales. Sigue reportando
      cualquier caso que detectes.
    </p>
  `;
  return {
    subject,
    html: renderImpaEmail({
      tone: "success",
      title: "Reporte resuelto",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
