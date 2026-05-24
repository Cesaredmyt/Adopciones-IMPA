"use client";

import { Plus } from "lucide-react";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";

import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import Filters from "@/features/mascotas/components/client/Filters";
import FormMascota from "@/features/mascotas/components/client/FormMascota";
import MascotasTable from "@/features/mascotas/components/client/MascotasTable";
import MascotaCardFull from "@/features/mascotas/components/client/MascotaCardFull";
import GestionRazas from "@/features/mascotas/razas/GestionRazas";

import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import UserTableSkeleton from "@/features/usuarios/components/client/UserTableSkeleton";

import { createPortal } from "react-dom";

import { useDeleteMascota } from "@/features/mascotas/hooks/useDeleteMascota";
import { useMascotasPageState } from "@/features/mascotas/hooks/useMascotasPageState";

import { useCreateMascota } from "@/features/mascotas/hooks/useCreateMascota";
import { useUpdateMascota } from "@/features/mascotas/hooks/useUpdateMascota";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { formatEdad } from "@/features/mascotas/utils/formatEdad";
import { uploadQRClient } from "@/features/mascotas/utils/uploadQRClient";
import { uploadImageClient } from "@/features/mascotas/utils/uploadImageClient";
import { useMascotasInfiniteQuery } from "@/features/mascotas/hooks/useMascotasInfiniteQuery";

export default function MascotasPage() {
  const {
    openForm, setOpenForm,
    selectedMascota, setSelectedMascota,
    openCard, setOpenCard,
    openRazas, setOpenRazas,
    q, setQ,
    especie, setEspecie,
    sexo, setSexo,
  } = useMascotasPageState();

  const [page, setPage] = useState(1);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMascotasInfiniteQuery({ q, especie, sexo });

  /** Aplanar datos recibidos */
  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const deleteMascota = useDeleteMascota();
  const createMascota = useCreateMascota();
  const updateMascota = useUpdateMascota();

  useBodyScrollLock(openCard);

  const filteredItems = items;

  const dataParaTabla = filteredItems.map((m) => ({
    id: m.id,
    nombre: m.nombre,
    especie: m.raza?.especie ?? "Desconocido",
    raza: m.raza?.nombre ?? "Mestizo",
    sexo: m.sexo,
    tamano: m.tamano,
    edadMeses: formatEdad(m.edad),
    descripcion: m.personalidad || m.descripcion_fisica || "",
    foto: m.imagen_url ?? null,
    original: m,
  }));

  const totalItems = data?.pages?.[0]?.total ?? 0;


  useEffect(() => {
    const ITEMS_PER_PAGE = 10;
    const totalNecesario = page * ITEMS_PER_PAGE;

    if (
      items.length < totalNecesario &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [page, items.length, hasNextPage, isFetchingNextPage]);



  return (
    <>
      <Modal
        open={openForm}
        onClose={() => {
          setSelectedMascota(null);
          setOpenForm(false);
        }}
        title={selectedMascota ? "Editar Mascota" : "Agregar Mascota"}
      >
        <FormMascota
          mascota={selectedMascota}
          onCancel={() => {
            setSelectedMascota(null);
            setOpenForm(false);
          }}
          onSubmitFinal={async (values) => {
            console.log("🐾 [1] onSubmitFinal called", values);
            try {
              if (selectedMascota) {
                console.log("🐾 [2] editando mascota:", selectedMascota.id);
                let imagen_url = values.imagen_url;
                let qr_code = values.qr_code;

                if (values.fotoFile) {
                  imagen_url = await uploadImageClient(
                    values.fotoFile,
                    selectedMascota.id
                  );
                }

                const payloadEdit = {
                  ...values,
                  id: selectedMascota.id,
                  imagen_url,
                  qr_code,
                };

                await updateMascota.mutateAsync(payloadEdit);
                toast.success("Mascota actualizada correctamente");

                setSelectedMascota(null);
                setOpenForm(false);
                return;
              }

              console.log("🐾 [3] creando nueva mascota...");
              const nuevoId = crypto.randomUUID();
              let imagen_url: string | null = null;
              let qr_code: string | null = null;

              if (values.fotoFile) {
                console.log("🐾 [4] subiendo imagen...");
                imagen_url = await uploadImageClient(values.fotoFile, nuevoId);
                console.log("🐾 [4] imagen subida:", imagen_url);
              }

              console.log("🐾 [5] generando QR...");
              const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
              const qrLink = `${appUrl}/mascota/${nuevoId}`;
              const qrDataUrl = await QRCode.toDataURL(qrLink, { width: 300 });
              const qrBlob = await (await fetch(qrDataUrl)).blob();
              console.log("🐾 [6] subiendo QR...");
              qr_code = await uploadQRClient(qrBlob, nuevoId);
              console.log("🐾 [6] QR subido:", qr_code);

              const payloadCreate = {
                ...values,
                id: nuevoId,
                imagen_url,
                qr_code,
              };

              console.log("🐾 [7] llamando mutateAsync con payload:", payloadCreate);
              await createMascota.mutateAsync(payloadCreate);
              console.log("🐾 [8] mascota creada OK");
              toast.success("Mascota agregada correctamente");

              setOpenForm(false);
            } catch (error) {
              console.error("❌ Error al guardar mascota:", error);
              toast.error("Ocurrió un error al guardar la mascota");
            }
          }}
        />
      </Modal>

      <PageHead
        title="Mascotas"
        subtitle="Catálogo y gestión de animales en adopción."
        right={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpenRazas(true)}
            >
              Gestionar razas
            </Button>
            <Button
              onClick={() => {
                setSelectedMascota(null);
                setOpenForm(true);
              }}
            >
              <Plus size={16} /> Nueva mascota
            </Button>
          </div>
        }
      />

      <Filters
        q={q}
        onQ={setQ}
        especie={especie}
        onEspecie={setEspecie}
        sexo={sexo}
        onSexo={setSexo}
        ESPECIES={["Perro", "Gato", "Otro"]}
      />

      {isLoading ? (
        <UserTableSkeleton />
      ) : (
        <div className="p-4">
          <MascotasTable
            data={dataParaTabla}
            page={page}
            onPageChange={setPage}
            totalItems={totalItems}
            actions={{
              onViewCard: (row) => {
                const m = items.find((i) => i.id === row.id);
                setSelectedMascota(m ?? null);
                setOpenCard(true);
              },

              onEdit: (row) => {
                const m = items.find((i) => i.id === row.id);
                setSelectedMascota(m ?? null);
                setOpenForm(true);
              },

              onDelete: async (row) => {
                const id = row.id;
                const confirmar = await toastConfirm(
                  "¿Estás seguro de que deseas eliminar esta mascota?"
                );
                if (!confirmar) return;
                deleteMascota.mutate(id);
              },
            }}
            deleteDisabledForId={() => false}
          />
        </div>
      )}

      {openCard &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-impa-text/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
            <div className="relative bg-white rounded-2xl shadow-impa-xl border border-impa-line w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
              <button
                onClick={() => setOpenCard(false)}
                className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-50 transition z-10"
              >
                ✕
              </button>

              <div className="flex-1 overflow-y-auto rounded-2xl">
                <MascotaCardFull
                  m={selectedMascota}
                  open={true}
                  onClose={() => setOpenCard(false)}
                  onEdit={() => console.log("Editar mascota:", selectedMascota)}
                  onDelete={async () => {
                    if (!selectedMascota) return;

                    const confirm = await toastConfirm(
                      "¿Seguro que deseas eliminar esta mascota?"
                    );
                    if (!confirm) return;

                    deleteMascota.mutate(selectedMascota.id, {
                      onSuccess: () => {
                        setOpenCard(false);
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      <GestionRazas open={openRazas} onClose={() => setOpenRazas(false)} />
    </>
  );
}
