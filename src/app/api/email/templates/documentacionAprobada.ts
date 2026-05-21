import { renderImpaEmail } from "./_layout";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://impa.vercel.app";

export default function documentacionAprobada({
  nombre,
  mascota,
}: {
  nombre: string;
  mascota: string;
}) {
  const subject = "Documentación aprobada · IMPA";

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Hemos revisado tu documentación y ha sido <strong style="color:#11a611;">aprobada</strong>
      exitosamente. Ya puedes continuar con el proceso de adopción de
      <strong>${mascota}</strong>.
    </p>
  `;

  return {
    subject,
    body: renderImpaEmail({
      tone: "success",
      title: "Documentación aprobada",
      preheader: `Continúa con la adopción de ${mascota}.`,
      content,
      cta: { label: "Continuar proceso", href: `${SITE_URL}/dashboards/usuario` },
    }),
  };
}
