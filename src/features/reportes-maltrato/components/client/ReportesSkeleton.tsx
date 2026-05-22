"use client";

export default function ReportesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-impa-surface-2 rounded-2xl border border-impa-line"
          />
        ))}
      </div>
      <div className="bg-white border border-impa-line rounded-2xl shadow-impa-sm overflow-hidden">
        <div className="h-12 bg-impa-surface-2 border-b border-impa-line" />
        <div className="divide-y divide-impa-line-faint">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 px-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-impa-surface-2" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-1/2 bg-impa-surface-2 rounded" />
                <div className="h-3 w-2/3 bg-impa-surface-2 rounded" />
              </div>
              <div className="h-7 w-24 bg-impa-surface-2 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
