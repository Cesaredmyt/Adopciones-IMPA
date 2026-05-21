"use client";

import { useRef } from "react";
import { Camera, ImagePlus } from "lucide-react";

interface IMPAPhotoInputProps {
  previewUrl?: string | null;
  onSelectFile: (file: File | null) => void;
  className?: string;
}

export function IMPAPhotoInput({
  previewUrl,
  onSelectFile,
  className = "",
}: IMPAPhotoInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onSelectFile(file);
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {previewUrl ? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="rounded-2xl w-64 h-64 object-cover shadow-impa-md border border-impa-line"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 grid place-items-center rounded-2xl bg-impa-text/0 group-hover:bg-impa-text/40 transition-colors"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-impa-text text-xs font-semibold px-3 py-1.5 rounded-lg shadow-impa-sm">
                Cambiar foto
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-impa-50 hover:bg-impa-100 text-impa-700 transition"
          >
            <Camera size={14} />
            Cambiar foto
          </button>
          <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleChange} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center w-64 h-64 rounded-2xl border-2 border-dashed border-impa-300 bg-impa-50/40 text-impa-700 hover:border-impa-500 hover:bg-impa-50 transition cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/15"
        >
          <div className="grid place-items-center w-14 h-14 rounded-full bg-impa-100 mb-3">
            <ImagePlus size={26} className="text-impa-600" />
          </div>
          <p className="text-sm font-semibold text-impa-text">Subir foto</p>
          <p className="text-xs text-impa-muted mt-1">PNG, JPG hasta 5MB</p>
          <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleChange} />
        </button>
      )}
    </div>
  );
}

export const CAAMPhotoInput = IMPAPhotoInput;
