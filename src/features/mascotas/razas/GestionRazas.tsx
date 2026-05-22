"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toastConfirm } from "@/components/ui/toastConfirm";
import { toast } from "sonner";
import { useRazasQuery } from "@/features/mascotas/hooks/useRazasQuery";
import { useEliminarRaza } from "@/features/mascotas/hooks/useEliminarRaza";

import FormRaza from "@/features/mascotas/razas/FormRaza";

export default function GestionRazas({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: razas = [], isLoading } = useRazasQuery();
  const deleteRaza = useEliminarRaza();

  async function handleDelete(id: string) {
    const confirm = await toastConfirm(
      "¿Seguro que deseas eliminar esta raza?"
    );
    if (!confirm) return;
    deleteRaza.mutate(id);
    toast.success("Raza eliminada correctamente");
  }

  function colorPorTamano(t: string) {
    switch (t) {
      case "pequeño":
        return "bg-emerald-100 text-emerald-700";
      case "mediano":
        return "bg-impa-100 text-impa-700";
      case "grande":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-impa-bg-elevated text-impa-muted";
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Gestionar Razas">
      <div className="space-y-6">
        {/* FORM NUEVO */}
        <FormRaza onCancel={onClose} />

        {/* LISTA DE RAZAS */}
        <div className="max-h-80 overflow-y-auto rounded-2xl border border-impa-line bg-impa-tinted p-3">
          {isLoading ? (
            <p className="py-4 text-center text-sm text-impa-muted">
              Cargando razas...
            </p>
          ) : razas.length === 0 ? (
            <p className="py-4 text-center text-sm text-impa-muted">
              No hay razas registradas.
            </p>
          ) : (
            <div className="grid gap-3">
              {razas.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-impa-line bg-white p-3 shadow-impa-xs transition hover:border-impa-200 hover:shadow-impa-sm"
                >
                  <div>
                    <p className="font-semibold text-impa-text">{r.nombre}</p>

                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {r.especie}
                      </span>

                      {r.tamano && (
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${colorPorTamano(
                            r.tamano
                          )}`}
                        >
                          {r.tamano}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleDelete(r.id)}
                    className="text-sm px-3"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
