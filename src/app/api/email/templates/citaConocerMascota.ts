import { renderImpaEmail, detailsTable } from "./_layout";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://impa.vercel.app";

export default function citaConocerMascota({
  nombre,
  mascota,
  fecha,
  hora,
  direccion,
}: {
  nombre: string;
  mascota: string;
  fecha: string;
  hora: string;
  direccion: string;
}) {
  const subject = `Cita confirmada para conocer a ${mascota}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tu cita para conocer a <strong>${mascota}</strong> está confirmada.
    </p>

    ${detailsTable([
      { label: "Mascota", value: `<strong>${mascota}</strong>` },
      { label: "Fecha", value: fecha },
      { label: "Hora", value: hora },
      { label: "Lugar", value: direccion },
    ])}
  `;

  return {
    subject,
    body: renderImpaEmail({
      tone: "success",
      title: "Tu cita está confirmada",
      preheader: `${fecha} · ${hora}`,
      content,
      cta: { label: "Ver detalles", href: SITE_URL },
    }),
  };
}
