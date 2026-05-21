"use client";

import ModalPremium from "@/components/ui/ModalPremium";

export default function ModalSeguimiento({
  open,
  onClose,
  titulo,
  children,
}: {
  open: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <ModalPremium
      open={open}
      onClose={onClose}
      title={titulo}
      maxWidth="max-w-2xl"
      bg="bg-[#f6f8f6]"
      border="border-[#E5D1B8]"
      padding="p-5"
    >
      {children}
    </ModalPremium>
  );
}
