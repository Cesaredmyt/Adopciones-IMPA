import { renderImpaEmail, detailsTable } from "./_layout";

export default function recordatorioCita({
  nombre,
  tipoCita,
  mascota,
  fecha,
  hora,
}: {
  nombre: string;
  tipoCita: string;
  mascota?: string;
  fecha: string;
  hora: string;
}) {
  const subject = `Recordatorio · ${tipoCita}`;

  const rows = [{ label: "Tipo", value: tipoCita }];
  if (mascota) rows.push({ label: "Mascota", value: `<strong>${mascota}</strong>` });
  rows.push({ label: "Fecha", value: fecha });
  rows.push({ label: "Hora", value: hora });

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">Este es un recordatorio para tu próxima cita.</p>
    ${detailsTable(rows)}
    <p style="margin:14px 0 0;">Te esperamos puntualmente.</p>
  `;

  return {
    subject,
    body: renderImpaEmail({
      tone: "info",
      title: "Recordatorio de cita",
      preheader: `${fecha} · ${hora}`,
      content,
    }),
  };
}
