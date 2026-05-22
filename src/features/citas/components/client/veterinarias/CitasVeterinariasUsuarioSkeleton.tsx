"use client";

export default function CitasVeterinariasUsuarioSkeleton() {
  return (
    <div className="mt-8 animate-pulse">
      {/* Header skeleton */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-impa-line bg-white shadow-impa-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-impa-surface-2">
            <tr>
              {["Mascota", "Fecha", "Hora", "Motivo", "Estado"].map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <div className="h-3 w-20 rounded bg-impa-100" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 5 }).map((_, row) => (
              <tr key={row} className="border-t border-impa-line">
                {Array.from({ length: 5 }).map((_, col) => (
                  <td key={col} className="px-4 py-4">
                    <div className="h-3 w-full rounded bg-impa-50" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid sm:hidden gap-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl border border-impa-line bg-white p-4 shadow-impa-sm"
          >
            {/* Title row */}
            <div className="flex justify-between">
              <div className="h-3 w-28 rounded bg-impa-50" />
              <div className="h-3 w-16 rounded bg-impa-100" />
            </div>

            {/* Fecha */}
            <div className="h-3 w-40 rounded bg-impa-50" />

            {/* Hora */}
            <div className="h-3 w-32 rounded bg-impa-50" />

            {/* Motivo */}
            <div className="h-3 w-48 rounded bg-impa-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
