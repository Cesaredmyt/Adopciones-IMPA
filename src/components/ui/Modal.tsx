"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-impa-text/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-impa-line bg-white text-impa-text shadow-impa-xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <header className="flex items-center justify-between border-b border-impa-line px-5 py-3.5 sticky top-0 bg-white z-10 rounded-t-2xl">
            <h2 className="text-base font-bold tracking-tight text-impa-text">
              {title}
            </h2>
            <button
              aria-label="Cerrar"
              onClick={onClose}
              className="grid place-items-center w-8 h-8 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-50 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/15"
            >
              <X size={16} />
            </button>
          </header>
        )}
        {!title && (
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-50 transition z-10"
          >
            <X size={16} />
          </button>
        )}
        <div className="p-5 overflow-y-auto flex-1 custom-scroll">{children}</div>
      </div>
    </div>,
    document.body
  );
}
