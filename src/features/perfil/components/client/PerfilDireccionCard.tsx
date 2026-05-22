import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import type { Direccion } from "@/features/perfil/types/perfil";

export default function PerfilDireccionCard({
  direccion,
  onEdit,
}: {
  direccion: Direccion | null;
  onEdit: () => void;
}) {
  return (
    <Card className="border-impa-line bg-white p-6 shadow-impa-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-impa-text">
          Dirección principal
        </h2>
        <Button
          onClick={onEdit}
          variant="primary"
        >
          {direccion ? "Editar" : "Agregar"}
        </Button>
      </div>

      {direccion ? (
        <div className="space-y-1 text-impa-muted">
          <p>
            {direccion.calle} {direccion.numero_exterior}
            {direccion.numero_interior
              ? `, Int. ${direccion.numero_interior}`
              : ""}
            , {direccion.colonia}
          </p>
          <p>
            {direccion.municipio}, {direccion.estado}, CP{" "}
            {direccion.codigo_postal}
          </p>
          <p>México</p>
        </div>
      ) : (
        <p>No tienes dirección principal registrada.</p>
      )}
    </Card>
  );
}
