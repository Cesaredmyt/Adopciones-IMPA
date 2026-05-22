"use client";
import { CalendarDays, Plus } from "lucide-react";

export default function EmptyState({ onNueva }: { onNueva: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-impa-line bg-impa-tinted p-10 text-center">
      <div className="mx-auto max-w-sm space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-impa-50 text-impa-700">
          <CalendarDays />
        </div>
        <h3 className="text-lg font-extrabold text-impa-text">No tienes citas aún</h3>
        <p className="text-sm text-impa-muted">Agenda tu primera cita. Solo necesitamos unos pocos datos.</p>
        <button
          onClick={onNueva}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-impa-500 px-4 py-2 text-sm font-bold text-white shadow-impa-sm transition hover:bg-impa-600 hover:shadow-impa-md"
        >
          <Plus size={18} /> Agendar cita
        </button>
      </div>
    </div>
  );
}
