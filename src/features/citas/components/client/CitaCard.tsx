import { Button } from "@/components/ui/Button";
import { CalendarDays, Trash2 } from "lucide-react";

export default function CitaCard({
  cita,
  onDelete,
}: {
  cita: any;
  onDelete: (id: string) => void;
}) {
  const { id, motivo, fecha_solicitada, fecha_confirmada, estado, mascota } =
    cita;

  const getEstadoColor = () => {
    switch (estado) {
      case "confirmada":
        return "bg-impa-50 text-impa-700 border-impa-200";
      case "cancelada":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  return (
    <div className="flex flex-col space-y-3 rounded-2xl border border-impa-line bg-white p-4 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm">
      {/* Imagen y nombre mascota */}
      <div className="flex items-center space-x-3">
        {mascota?.foto_url ? (
          <img
            src={mascota.foto_url}
            alt={mascota.nombre}
            className="h-16 w-16 rounded-xl border border-impa-line object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl border border-impa-line bg-impa-50" />
        )}
        <div>
          <h2 className="text-lg font-semibold text-impa-text">
            {mascota?.nombre || "Mascota"}
          </h2>
          <p
            className={`text-sm font-medium inline-block px-2 py-1 rounded-lg border ${getEstadoColor()}`}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </p>
        </div>
      </div>

      {/* Información cita */}
      <div className="space-y-1 text-sm text-impa-muted">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-impa-600" />
          <span>
            Fecha solicitada:{" "}
            <strong>{new Date(fecha_solicitada).toLocaleDateString()}</strong>
          </span>
        </p>
        {fecha_confirmada && (
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-impa-600" />
            <span>
              Confirmada para:{" "}
              <strong>{new Date(fecha_confirmada).toLocaleDateString()}</strong>
            </span>
          </p>
        )}
        <p>
          Motivo: <span className="italic">{motivo}</span>
        </p>
      </div>

      {/* Botón eliminar */}
      {estado !== "confirmada" && (
        <Button
          variant="primary"
          className="w-full mt-2 flex items-center justify-center gap-2"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="w-4 h-4" /> Cancelar cita
        </Button>
      )}
    </div>
  );
}
