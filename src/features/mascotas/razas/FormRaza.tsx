"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { RazaSchema } from "@/features/mascotas/schemas/razas-schemas";
import { useCrearRaza } from "@/features/mascotas/hooks/useCrearRaza";

import { FormSection } from "@/components/form/FormSection";
import { FormGrid } from "@/components/form/FormGrid";
import { FieldWrapper } from "@/components/form/FieldWrapper";
import { FieldLabel } from "@/components/form/FieldLabel";

import { IMPAInput } from "@/components/form/IMPAInput";
import { IMPASelect } from "@/components/form/IMPASelect";

export default function FormRaza({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const crearRaza = useCrearRaza();

  const form = useForm({
    resolver: zodResolver(RazaSchema),
    defaultValues: {
      nombre: "",
      especie: "Perro",
      tamano: "mediano",
      activa: true,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await crearRaza.mutateAsync(values);
      toast.success("Raza guardada correctamente");
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.message || "Ocurrió un error al guardar la raza"
      );
    }
  });

  return (
    <form onSubmit={submit} className="space-y-6 text-impa-text">
      <FormSection title="Información de la raza">
        <FormGrid cols={3}>
          {/* Nombre */}
          <Controller
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Nombre</FieldLabel>
                <IMPAInput
                  placeholder="Ej. Labrador Retriever"
                  {...field}
                />
                {form.formState.errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.nombre.message as string}
                  </p>
                )}
              </FieldWrapper>
            )}
          />

          {/* Especie */}
          <Controller
            control={form.control}
            name="especie"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Especie</FieldLabel>
                <IMPASelect
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Perro", value: "Perro" },
                    { label: "Gato", value: "Gato" },
                    { label: "Otro", value: "Otro" },
                  ]}
                />
                {form.formState.errors.especie && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.especie.message as string}
                  </p>
                )}
              </FieldWrapper>
            )}
          />

          {/* Tamaño */}
          <Controller
            control={form.control}
            name="tamano"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Tamaño</FieldLabel>
                <IMPASelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={[
                    { label: "Pequeño", value: "pequeño" },
                    { label: "Mediano", value: "mediano" },
                    { label: "Grande", value: "grande" },
                  ]}
                />
                {form.formState.errors.tamano && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.tamano.message as string}
                  </p>
                )}
              </FieldWrapper>
            )}
          />
        </FormGrid>
      </FormSection>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={crearRaza.isPending}
          className="cursor-pointer rounded-xl border border-impa-line bg-white px-4 py-2 text-sm font-semibold text-impa-700 shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50 disabled:cursor-not-allowed disabled:opacity-55"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={crearRaza.isPending}
          className="cursor-pointer rounded-xl bg-impa-500 px-4 py-2 text-sm font-semibold text-white shadow-impa-sm transition hover:bg-impa-600 hover:shadow-impa-md disabled:cursor-not-allowed disabled:opacity-55"
        >
          {crearRaza.isPending ? "Guardando..." : "Guardar raza"}
        </button>
      </div>
    </form>
  );
}
