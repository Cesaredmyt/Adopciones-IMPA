"use client";

/**
 * Skeleton del Perfil — paleta IMPA (reemplaza el orange/peach legacy
 * que rompía la identidad visual).
 */
export default function PerfilSkeleton() {
  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Sidebar skeleton */}
      <div className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden lg:sticky lg:top-24 self-start">
        <div className="p-5 border-b border-impa-line">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-impa-surface-3 impa-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 bg-impa-surface-3 rounded impa-shimmer" />
              <div className="h-2.5 w-24 bg-impa-surface-2 rounded impa-shimmer" />
            </div>
          </div>
        </div>
        <div className="p-2 space-y-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-impa-surface-2 impa-shimmer" />
          ))}
        </div>
      </div>

      {/* Main skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-impa-line">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-impa-surface-3 impa-shimmer" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-impa-surface-3 rounded impa-shimmer" />
                  <div className="h-2.5 w-44 bg-impa-surface-2 rounded impa-shimmer" />
                </div>
              </div>
              <div className="h-8 w-20 rounded-lg bg-impa-surface-3 impa-shimmer" />
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-2.5 w-24 bg-impa-surface-2 rounded impa-shimmer" />
                  <div className="h-4 w-40 bg-impa-surface-3 rounded impa-shimmer" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
