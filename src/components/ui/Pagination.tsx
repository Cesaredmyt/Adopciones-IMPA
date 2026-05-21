"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  itemsLabel?: string;
  itemsPerPage?: number;
  totalItems?: number;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  itemsLabel = "registros",
  itemsPerPage,
  totalItems,
}: Props) {
  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      onChange(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const start = itemsPerPage && totalItems ? (page - 1) * itemsPerPage + 1 : null;
  const end =
    itemsPerPage && totalItems ? Math.min(page * itemsPerPage, totalItems) : null;

  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3)
      return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  })();

  const chipBase =
    "min-w-[2.25rem] h-9 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ease-impa-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20 cursor-pointer";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm">
      <span className="text-impa-muted">
        {start && end && totalItems ? (
          <>
            Mostrando <b className="text-impa-text">{start}</b>–
            <b className="text-impa-text">{end}</b> de{" "}
            <b className="text-impa-text">{totalItems}</b> {itemsLabel}
          </>
        ) : (
          <>
            Página <b className="text-impa-text">{page}</b> de{" "}
            <b className="text-impa-text">{totalPages}</b>
          </>
        )}
      </span>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => page > 1 && goTo(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
          className={cn(
            "h-9 px-3 rounded-lg border border-impa-line text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ease-impa-out bg-white shadow-impa-xs cursor-pointer",
            page === 1
              ? "text-impa-quiet cursor-not-allowed opacity-60"
              : "text-impa-text hover:bg-impa-50 hover:border-impa-300 hover:shadow-impa-sm"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((p, i) =>
            typeof p === "number" ? (
              <button
                key={i}
                onClick={() => goTo(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  chipBase,
                  p === page
                    ? "bg-impa-cta text-white shadow-impa-sm scale-[1.02]"
                    : "bg-white text-impa-text border border-impa-line shadow-impa-xs hover:bg-impa-50 hover:border-impa-300 hover:shadow-impa-sm hover:-translate-y-px"
                )}
              >
                {p}
              </button>
            ) : (
              <span key={i} className="px-1 text-impa-quiet text-xs">
                {p}
              </span>
            )
          )}
        </div>

        <button
          onClick={() => page < totalPages && goTo(page + 1)}
          disabled={page === totalPages}
          aria-label="Página siguiente"
          className={cn(
            "h-9 px-3 rounded-lg border border-impa-line text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ease-impa-out bg-white shadow-impa-xs cursor-pointer",
            page === totalPages
              ? "text-impa-quiet cursor-not-allowed opacity-60"
              : "text-impa-text hover:bg-impa-50 hover:border-impa-300 hover:shadow-impa-sm"
          )}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
