"use client";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import { Cita } from "../../types/types";

export default function NuevoModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (c: Omit<Cita, "id">) => void;
}) {
  const hoy = new Date().toISOString().slice(0, 10);

  const [mascota, setMascota] = useState("");
  const [veterinario, setVeterinario] = useState("Dra. Gómez");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [hora, setHora] = useState("10:00");
  const [duracionMin, setDuracionMin] = useState(30);
  const [telefono, setTelefono] = useState("");
  const [lugar, setLugar] = useState("");
  const [notas, setNotas] = useState("");

  const field = "w-full rounded-2xl border border-impa-line bg-white px-3 py-2.5 text-[15px] text-impa-text shadow-impa-xs outline-none transition placeholder:text-impa-subtle hover:border-impa-300 focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mascota || !motivo) return;
    onSave({ mascota, veterinario, motivo, fecha, hora, duracionMin, telefono, lugar, notas });
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva cita">
      <form className="grid gap-3" onSubmit={submit}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Mascota" required>
            <input className={field} value={mascota} onChange={(e) => setMascota(e.target.value)} placeholder="Ej. Luna" />
          </Field>
          <Field label="Veterinario(a)">
            <select className={field} value={veterinario} onChange={(e) => setVeterinario(e.target.value)}>
              <option>Dra. Gómez</option>
              <option>Dr. Pérez</option>
              <option>Clínica Vet Norte</option>
            </select>
          </Field>
        </div>

        <Field label="Motivo" required>
          <input className={field} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Vacunas, revisión, etc." />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Fecha" required>
            <input type="date" min={hoy} className={field} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </Field>
          <Field label="Hora" required>
            <input type="time" className={field} value={hora} onChange={(e) => setHora(e.target.value)} />
          </Field>
          <Field label="Duración (min)">
            <input type="number" min={5} step={5} className={field} value={duracionMin} onChange={(e) => setDuracionMin(Number(e.target.value))} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Teléfono">
            <input className={field} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Opcional" />
          </Field>
          <Field label="Lugar">
            <input className={field} value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Clínica o dirección (opcional)" />
          </Field>
        </div>

        <Field label="Notas">
          <textarea className={`${field} min-h-[84px]`} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Indicaciones, recordatorios, etc." />
        </Field>

        <div className="mt-1 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="cursor-pointer rounded-xl border border-impa-line bg-white px-4 py-2 text-sm font-bold text-impa-700 shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50">
            Cancelar
          </button>
          <button type="submit" className="cursor-pointer rounded-xl bg-impa-500 px-4 py-2 text-sm font-bold text-white shadow-impa-sm transition hover:bg-impa-600 hover:shadow-impa-md">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-extrabold uppercase text-impa-muted">
        {label} {required && <span className="text-impa-600">*</span>}
      </label>
      {children}
    </div>
  );
}
