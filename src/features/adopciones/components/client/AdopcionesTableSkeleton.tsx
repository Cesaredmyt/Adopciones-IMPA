"use client";

export default function AdopcionesTableSkeleton() {
  return (
    <>
      {/* Search Skeleton */}
      <div className="bg-white rounded-2xl border border-impa-line shadow-impa-sm p-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 rounded-xl border border-impa-line bg-white pl-3 pr-2 h-10 w-full">
              <div className="h-4 w-4 bg-impa-surface-3 rounded-full impa-shimmer" />
              <div className="h-3 w-32 bg-impa-surface-3 rounded-full impa-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="lg:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-impa-line rounded-2xl p-4 shadow-impa-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-impa-surface-3 rounded impa-shimmer" />
              <div className="h-5 w-20 bg-impa-surface-3 rounded-full impa-shimmer" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-impa-surface-3 rounded-xl impa-shimmer" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-impa-surface-3 rounded impa-shimmer" />
                <div className="h-3 w-40 bg-impa-surface-3 rounded impa-shimmer" />
                <div className="h-3 w-28 bg-impa-surface-3 rounded impa-shimmer" />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <div className="flex-1 h-9 bg-impa-surface-3 rounded-lg impa-shimmer" />
              <div className="flex-1 h-9 bg-impa-surface-3 rounded-lg impa-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:block bg-white rounded-2xl border border-impa-line shadow-impa-sm overflow-hidden mt-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                Adoptante
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                Mascota
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-impa-line-faint">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="bg-white">
                <td className="px-4 py-4">
                  <div className="h-3 w-32 bg-impa-surface-3 rounded impa-shimmer" />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 bg-impa-surface-3 rounded-lg impa-shimmer" />
                    <div className="h-3 w-24 bg-impa-surface-3 rounded impa-shimmer" />
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="h-5 w-20 bg-impa-surface-3 rounded-full impa-shimmer" />
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="inline-flex gap-1.5">
                    <div className="h-7 w-20 bg-impa-surface-3 rounded-lg impa-shimmer" />
                    <div className="h-7 w-20 bg-impa-surface-3 rounded-lg impa-shimmer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
