import { Card } from "@/components/ui/card";
import { MascotaCardAdoptada } from "./MascotaCardAdoptada";

export default function PerfilMascotasCard({
  mascotas,
}: {
  mascotas: any[];
}) {
  return (
    <Card className="border-impa-line bg-white p-6 shadow-impa-sm">
      <h2 className="mb-4 text-xl font-semibold text-impa-text">
        Mascotas adoptadas
      </h2>

      {mascotas.length === 0 ? (
        <p className="text-impa-muted">Aún no tienes mascotas adoptadas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mascotas.map((m) => (
            <MascotaCardAdoptada key={m.id} mascota={m} />
          ))}
        </div>
      )}
    </Card>
  );
}
