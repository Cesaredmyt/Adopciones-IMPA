import { Skeleton } from "@/components/ui/Skeleton";

export default function UserTableSkeleton() {
  return (
    <div className="w-full border border-impa-line rounded-2xl bg-white p-5 shadow-impa-sm">
      <div className="flex items-center gap-4 mb-5">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-28" />
      </div>

      <div className="space-y-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border border-impa-line rounded-xl p-3 bg-white"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
