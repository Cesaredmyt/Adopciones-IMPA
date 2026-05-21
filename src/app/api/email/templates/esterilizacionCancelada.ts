import { renderImpaEmail, infoBox } from "./_layout";

export function buildEsterilizacionCanceladaEmail({
  nombre,
  nombreMascota,
  folio,
  motivo,
  variante,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
  motivo: string;
  variante: "cancelada" | "rechazada";
}) {
  const titulo =
    variante === "rechazada" ? "Solicitud no aprobada" : "Esterilización cancelada";

  const subject = `${titulo} · Folio ${folio}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Te informamos que la solicitud de esterilización para
      <strong>${nombreMascota}</strong> ha sido
      <strong>${variante === "rechazada" ? "rechazada" : "cancelada"}</strong>.
    </p>

    ${infoBox("Folio", folio, { tone: "danger" })}
    ${infoBox("Motivo", motivo, { tone: "danger" })}

    <p style="margin:14px 0 0;">
      Puedes contactarnos si tienes dudas o deseas reintentar la solicitud más adelante.
    </p>
  `;

  return {
    subject,
    html: renderImpaEmail({
      tone: "danger",
      title: titulo,
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
