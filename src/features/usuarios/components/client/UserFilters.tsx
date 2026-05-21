"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export default function UserFilters({
  searchTerm,
  onSearchChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md rounded-xl border border-impa-line bg-white px-3 h-10 shadow-impa-xs transition-[border-color,box-shadow,background-color] duration-200 ease-impa-out hover:border-impa-300 focus-within:border-impa-500 focus-within:ring-4 focus-within:ring-impa-500/15 focus-within:bg-white">
        <Search className="h-4 w-4 text-impa-muted" />
        <input
          placeholder="Buscar usuario..."
          className="flex-1 bg-transparent text-sm focus:outline-none text-impa-text placeholder:text-impa-subtle"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filtros */}
      <button
        type="button"
        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-impa-line bg-impa-50 text-impa-700 text-sm font-semibold shadow-impa-xs transition-[border-color,box-shadow,background-color,transform] duration-200 ease-impa-out hover:bg-impa-100 hover:border-impa-200 hover:-translate-y-px cursor-pointer"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </button>
    </div>
  );
}
