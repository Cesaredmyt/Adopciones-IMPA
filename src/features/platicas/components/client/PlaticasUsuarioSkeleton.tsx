"use client";

export default function PlaticasUsuarioSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-impa-line rounded-2xl overflow-hidden"
        >
          <div className="h-12 bg-impa-surface-2 border-b border-impa-line" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-1/2 bg-impa-surface-2 rounded" />
            <div className="h-3 w-2/3 bg-impa-surface-2 rounded" />
            <div className="h-3 w-1/2 bg-impa-surface-2 rounded" />
            <div className="h-3 w-3/4 bg-impa-surface-2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
