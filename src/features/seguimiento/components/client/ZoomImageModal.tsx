"use client";

import { X } from "lucide-react";

export default function ZoomImageModal({
  image,
  onClose,
}: {
  image: string | null;
  onClose: () => void;
}) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-impa-text/75 p-4 backdrop-blur-sm">
      <div className="relative max-w-3xl w-full">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full border border-impa-line bg-white p-1 text-impa-muted shadow-impa-xs transition hover:bg-impa-50 hover:text-impa-700"
        >
          <X size={22} />
        </button>

        <img
          src={image}
          className="w-full max-h-[90vh] object-contain rounded-xl border border-white shadow-lg"
        />
      </div>
    </div>
  );
}
