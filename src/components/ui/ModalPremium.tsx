"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ModalPremium({
  open,
  onClose,
  children,
  width = "600px",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [open]);

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-impa-text/40 transition"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative rounded-2xl shadow-impa-xl border border-impa-line bg-white text-impa-text w-full overflow-hidden transition-all duration-300 ease-out ${
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        style={{ maxWidth: width }}
      >
        <div className="p-6 space-y-6 custom-scroll overflow-y-auto max-h-[85vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
