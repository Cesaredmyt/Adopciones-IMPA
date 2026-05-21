"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function MascotaCardSkeleton() {
    return (
        <div className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="w-9 h-9 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                </div>
                <div className="flex justify-between gap-2 pt-3 border-t border-impa-line-faint">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
        </div>
    );
}
