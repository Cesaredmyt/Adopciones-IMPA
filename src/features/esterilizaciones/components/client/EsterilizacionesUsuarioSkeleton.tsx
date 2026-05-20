"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function EsterilizacionesUsuarioSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3"
        >
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
