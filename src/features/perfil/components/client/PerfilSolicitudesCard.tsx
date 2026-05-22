import { Card } from "@/components/ui/card";
import type { SolicitudAdopcionMin } from "@/features/perfil/types/perfil";

export default function PerfilSolicitudesCard({
  solicitudes,
}: {
  solicitudes: SolicitudAdopcionMin[];
}) {
  return (
    <Card className="border-impa-line bg-white p-6 shadow-impa-sm">
      <h2 className="mb-4 text-xl font-semibold text-impa-text">
        Mascotas en proceso de adopción
      </h2>

      {solicitudes.length === 0 ? (
        <p className="text-impa-muted">No tienes solicitudes pendientes.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {solicitudes.map((sol) => (
            <li
              key={sol.id}
              className="rounded-2xl border border-impa-line bg-impa-tinted p-4 shadow-impa-xs"
            >
              <p className="font-semibold text-impa-text">
                {sol.mascota?.nombre ?? "Mascota"}
              </p>
              <p className="text-sm text-impa-muted">
                Solicitud #{sol.numero_solicitud}
              </p>
              <span className="mt-2 inline-block rounded-full border border-impa-200 bg-impa-50 px-3 py-1 text-xs font-semibold capitalize text-impa-700">
                {sol.estado}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
