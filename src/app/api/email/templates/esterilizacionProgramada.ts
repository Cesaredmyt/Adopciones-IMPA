import { renderImpaEmail, infoBox } from "./_layout";

export function buildEsterilizacionProgramadaEmail({
  nombre,
  nombreMascota,
  folio,
  fechaTexto,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
  fechaTexto: string;
}) {
  const subject = `Esterilización programada · Folio ${folio}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      La esterilización de <strong>${nombreMascota}</strong> ha sido programada.
    </p>

    ${infoBox("Fecha y hora", fechaTexto, { tone: "info" })}
    ${infoBox("Folio", folio, { tone: "info" })}

    ${infoBox(
      "Indicaciones previas",
      "• Ayuno de al menos 8 horas antes de la cirugía<br/>• Llegar 15 minutos antes de la hora indicada",
      { tone: "warning" }
    )}
  `;

  return {
    subject,
    html: renderImpaEmail({
      tone: "info",
      title: "Cirugía programada",
      preheader: fechaTexto,
      content,
    }),
  };
}
