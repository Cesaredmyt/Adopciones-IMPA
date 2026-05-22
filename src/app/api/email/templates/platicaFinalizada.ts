import { renderImpaEmail, infoBox } from "./_layout";

export function buildPlaticaFinalizadaEmail({
  nombre,
  folio,
}: {
  nombre: string;
  folio: string;
}) {
  const subject = `¡Plática realizada! · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Hemos registrado tu plática de concientización como
      <strong style="color:#0f830f;">finalizada</strong>. ¡Gracias por sumar tu
      voz a la causa!
    </p>
    ${infoBox("Folio", folio, { tone: "success" })}
    <p style="margin:14px 0 0;">
      Si tienes comentarios o sugerencias sobre la experiencia, nos encantaría
      conocerlos. Puedes escribirnos a contacto@impa.org.mx.
    </p>
  `;
  return {
    subject,
    html: renderImpaEmail({
      tone: "success",
      title: "Plática finalizada",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
