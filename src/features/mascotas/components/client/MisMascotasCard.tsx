"use client";

import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { generarFechasSeguimiento } from "@/features/mascotas/utils/generarFechasSeguimiento";

export default function MisMascotasCard({
  mascota,
  onVerCertificado,
}: {
  mascota: any;
  onVerCertificado: (mascota: any) => void;
}) {
  const fechaAdopcion = dayjs(mascota.fecha_adopcion);
  const seguimientos = generarFechasSeguimiento(fechaAdopcion);

  const lineaSecundaria = [
    mascota.raza_nombre,
    mascota.sexo,
    mascota.tamano,
    mascota.personalidad,
  ]
    .filter(Boolean)
    .join(" · ");

  const coloresTexto = Array.isArray(mascota.colores)
    ? mascota.colores.join(", ")
    : mascota.colores || "";

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border border-impa-line shadow-impa-sm md:flex-row">
      {/* Imagen */}
      <div className="w-full md:w-[45%] h-64 md:h-auto">
        <img
          src={
            mascota.imagen_url?.startsWith("http")
              ? mascota.imagen_url
              : "/ISOTIPO IMPA.png"
          }
          alt={mascota.mascota_nombre || "Mascota adoptada"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-between w-full p-6">
        <div>
          <h2 className="text-2xl font-semibold text-impa-text">
            {mascota.mascota_nombre || "Sin nombre"}
          </h2>

          <p className="mb-3 text-sm italic text-impa-muted">
            {lineaSecundaria || "Sin datos"}
          </p>

          <div className="space-y-1 text-sm text-impa-muted">
            <p>
              <strong>Adoptada el:</strong>{" "}
              {fechaAdopcion.isValid()
                ? fechaAdopcion.format("DD/MM/YYYY")
                : "Sin fecha"}
            </p>

            <p>
              <strong>Edad:</strong> {mascota.edad || "Sin datos"}
            </p>

            {mascota.peso_kg && (
              <p>
                <strong>Peso:</strong> {mascota.peso_kg} kg
              </p>
            )}

            {mascota.altura_cm && (
              <p>
                <strong>Altura:</strong> {mascota.altura_cm} cm
              </p>
            )}

            {coloresTexto && (
              <p>
                <strong>Colores:</strong> {coloresTexto}
              </p>
            )}

            {mascota.esterilizado !== null &&
              mascota.esterilizado !== undefined && (
                <p>
                  <strong>Esterilizado:</strong>{" "}
                  {mascota.esterilizado ? "Sí" : "No"}
                </p>
              )}
          </div>

          {/* Seguimientos */}
          <div className="mt-4 border-t border-impa-line pt-3">
            <p className="mb-1 font-semibold text-impa-text">
              Seguimientos programados:
            </p>
            <ul className="ml-5 list-disc text-sm text-impa-muted">
              {seguimientos.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <ButtonLink
            href={`/dashboards/usuario/seguimiento/${mascota.adopcion_id}`}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Gestionar seguimiento
          </ButtonLink>

          <Button
            className="w-full sm:w-auto"
            onClick={() => onVerCertificado(mascota)}
          >
            Ver certificado de adopción
          </Button>
        </div>
      </div>
    </Card>
  );
}
