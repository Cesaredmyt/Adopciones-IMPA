import { renderImpaEmail, infoBox, detailsTable } from "./_layout";

export function buildPlaticaAprobadaEmail({
  nombre,
  folio,
  fechaTexto,
  direccion,
}: {
  nombre: string;
  folio: string;
  fechaTexto: string;
  direccion: string;
}) {
  const subject = `Tu plática IMPA fue aprobada · Folio ${folio}`;
  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tu solicitud de plática fue <strong style="color:#0f830f;">aprobada</strong>.
      Hemos agendado la siguiente fecha:
    </p>
    ${infoBox("Folio", folio, { tone: "success" })}
    ${detailsTable([
      { label: "Fecha y hora", value: fechaTexto },
      { label: "Dirección", value: direccion },
    ])}
    <p style="margin:14px 0 0;">
      Nos pondremos en contacto contigo en caso de necesitar más detalles
      (acceso, equipo audiovisual, etc.).
    </p>
    <p style="margin:14px 0 0;">¡Gracias por ayudarnos a difundir el cuidado animal!</p>
  `;
  return {
    subject,
    html: renderImpaEmail({
      tone: "success",
      title: "Plática agendada",
      preheader: `Folio ${folio} · ${fechaTexto}`,
      content,
    }),
  };
}
