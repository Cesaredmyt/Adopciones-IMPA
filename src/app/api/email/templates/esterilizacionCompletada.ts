import { renderImpaEmail, infoBox } from "./_layout";

export function buildEsterilizacionCompletadaEmail({
  nombre,
  nombreMascota,
  folio,
  estado,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
  estado: "completada" | "complicacion";
}) {
  const exitosa = estado === "completada";
  const subject = exitosa
    ? `Esterilización completada · Folio ${folio}`
    : `Esterilización con observaciones · Folio ${folio}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      La esterilización de <strong>${nombreMascota}</strong> ha finalizado${
    exitosa
      ? " satisfactoriamente."
      : ", pero presentó observaciones clínicas relevantes."
  }
    </p>

    ${infoBox("Folio", folio, { tone: exitosa ? "success" : "warning" })}

    <p style="margin:14px 0 0;">
      Consulta el expediente clínico desde tu panel:
      <strong>Mis mascotas · Esterilizaciones</strong>.
    </p>
  `;

  return {
    subject,
    html: renderImpaEmail({
      tone: exitosa ? "success" : "warning",
      title: exitosa ? "Cirugía exitosa" : "Cirugía con observaciones",
      preheader: `Folio ${folio}`,
      content,
    }),
  };
}
