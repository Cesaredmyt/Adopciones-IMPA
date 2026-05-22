"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import dayjs from "dayjs";
import { PawPrint, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCrearSeguimientoMutation } from "../../hooks/useCrearSeguimientoMutation";
import { useImagePreview } from "../../hooks/useImagePreview";
import { ESTADO_MAP } from "../../utils/estadoMascota";
import {
  seguimientoSchema,
  type SeguimientoFormValues,
} from "../../schemas/seguimiento-form.schema";

export default function SeguimientoForm({
  adopcionId,
  fechaProgramada,
  onSuccess,
}: {
  adopcionId: string;
  fechaProgramada: string;
  onSuccess?: () => void;
}) {
  /* ------------------ RATINGS ------------------ */
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [estadoMascota, setEstadoMascota] = useState(0);
  const [hoverEstado, setHoverEstado] = useState(0);

  /* ------------------ PREVIEW ------------------ */
  const preview = useImagePreview(5);

  /* ------------------ MUTATION ------------------ */
  const crearSeguimiento = useCrearSeguimientoMutation();

  /* ------------------ FORM ------------------ */
  const {
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm<SeguimientoFormValues>({
    resolver: zodResolver(seguimientoSchema),
    defaultValues: {
      satisfaccion_adoptante: 0,
      estado_mascota: "",
    },
  });

  /* ------------------ FILE HANDLERS ------------------ */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    preview.addFiles(e.target.files, (files) => {
      setValue("fotos", files, { shouldValidate: true });
    });
  };

  const removePhoto = (index: number) => {
    preview.removeFile(index, (files) => {
      setValue("fotos", files, { shouldValidate: true });
    });
  };

  /* ------------------ SUBMIT ------------------ */
  const onSubmit = (data: SeguimientoFormValues) => {
    const archivos = data.fotos as FileList | undefined;

    if (!archivos || archivos.length === 0) {
      toast.error("Debes subir al menos una foto.");
      return;
    }

    if (!rating || !estadoMascota) {
      toast.error("Completa la calificación y el estado.");
      return;
    }

    crearSeguimiento.mutate(
      {
        adopcionId,
        fechaProgramada,
        observaciones: data.observaciones,
        recomendaciones: data.recomendaciones ?? null,
        satisfaccion_adoptante: rating,
        estado_mascota: ESTADO_MAP[estadoMascota],
        problemas_reportados: data.problemas_reportados
          ? data.problemas_reportados.split(",").map((p) => p.trim())
          : [],
        fotos: archivos,
      },
      {
        onSuccess: () => {
          toast.success("Seguimiento enviado con exito");
          reset();
          preview.reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error("Ocurrió un error al guardar el seguimiento");
        },
      }
    );
  };

  /* ------------------ UI ------------------ */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-impa-line bg-impa-tinted p-4 text-sm shadow-impa-sm"
    >
      <h2 className="mb-3 text-center text-lg font-bold text-impa-text">
        Registra el seguimiento de tu mascota
      </h2>

      <p className="mb-4 text-center text-xs text-impa-muted">
        Seguimiento programado para:{" "}
        <span className="font-semibold text-impa-700">
          {dayjs(fechaProgramada).format("DD/MM/YYYY")}
        </span>
      </p>

      {/* OBSERVACIONES */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-impa-text">
          Observaciones
        </label>
        <textarea
          {...register("observaciones")}
          rows={3}
          className="w-full rounded-xl border border-impa-line bg-white p-3 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
        />
      </div>

      {/* RECOMENDACIONES */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-impa-text">
          Recomendaciones (opcional)
        </label>
        <textarea
          {...register("recomendaciones")}
          rows={2}
          className="w-full rounded-xl border border-impa-line bg-white p-3 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
        />
      </div>

      {/* ESTADO + CALIFICACIÓN */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* ESTADO */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-impa-text">
            Estado de la mascota
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => {
              const active = val <= (hoverEstado || estadoMascota);
              return (
                <button
                  key={val}
                  type="button"
                  onMouseEnter={() => setHoverEstado(val)}
                  onMouseLeave={() => setHoverEstado(0)}
                  onClick={() => setEstadoMascota(val)}
                >
                  <svg
                    className={active ? "text-red-500" : "text-impa-line"}
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill={active ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-6.716-4.437-9.083-8.01C.42 9.843.486 6.35 2.293 4.293 4.1 2.236 7.314 2.236 9.12 4.293L12 7.5l2.88-3.207c1.806-2.057 5.02-2.057 6.827 0 1.807 2.057 1.873 5.55-.624 8.697C18.716 16.563 12 21 12 21z" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* CALIFICACIÓN */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-impa-text">
            Calificación del seguimiento
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => {
              const active = val <= (hoverRating || rating);
              return (
                <button
                  key={val}
                  type="button"
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(val)}
                >
                  <PawPrint
                    size={26}
                    className={active ? "text-impa-600" : "text-impa-line"}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PROBLEMAS */}
      <div>
        <label className="text-xs font-semibold text-impa-text">
          Problemas reportados (separados por comas)
        </label>
        <input
          {...register("problemas_reportados")}
          className="h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
        />
      </div>

      {/* FOTOS */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-impa-text">
          Fotos del seguimiento
        </label>

        <label className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-impa-line bg-white p-6 transition hover:border-impa-300 hover:bg-impa-50/35">
          <Upload size={30} className="text-impa-600" />
          <span className="text-center text-xs text-impa-muted">
            Haz clic o arrastra fotos
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("fotos")}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {preview.urls.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {preview.urls.map((url, i) => (
              <div key={i} className="relative w-20 h-20">
                <img
                  src={url}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow-impa-xs"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={crearSeguimiento.isPending}
          variant="primary"
        >
          {crearSeguimiento.isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Guardar seguimiento"
          )}
        </Button>
      </div>
    </form>
  );
}
