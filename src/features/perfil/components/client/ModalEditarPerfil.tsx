"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal";

export type FormPerfil = {
  ocupacion: string;
  telefono: string;
};

export default function ModalEditarPerfil({
  open,
  onClose,
  formPerfil,
  errors,
  onChange,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  formPerfil: FormPerfil;
  errors: { telefono?: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Editar perfil">
      <div className="space-y-4">
        {/* Ocupación */}
        <div>
          <Label htmlFor="ocupacion">Ocupación</Label>
          <select
            id="ocupacion"
            name="ocupacion"
            value={formPerfil.ocupacion}
            onChange={onChange}
            className="mt-1 h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
          >
            <option value="" disabled>
              Selecciona una ocupación
            </option>
            <option value="Estudiante">Estudiante</option>
            <option value="Empleado">Empleado</option>
            <option value="Emprendedor">Emprendedor</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Jubilado">Jubilado</option>
            <option value="Desempleado">Desempleado</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Teléfono */}
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            value={formPerfil.telefono}
            onChange={onChange}
          />
          {errors.telefono && (
            <p className="text-red-600 text-sm">{errors.telefono}</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={onSave}
            disabled={!!errors.telefono}
            variant="primary"
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </Modal>
  );
}
