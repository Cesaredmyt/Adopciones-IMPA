"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function EsterilizacionesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-28" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6 items-start">
        <div className="space-y-3 rounded-2xl border border-impa-line bg-white p-4 shadow-impa-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-impa-line bg-white p-4 shadow-impa-sm">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
