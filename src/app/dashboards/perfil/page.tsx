"use client";

import { User, Sparkles } from "lucide-react";

import HeaderAd from "@/components/layout/HeaderAd";
import HeaderUsr from "@/components/layout/HeaderUsr";
import PageHead from "@/components/layout/PageHead";
import PerfilCard from "@/features/perfil/components/client/PerfilCard";
import { usePerfilQuery } from "@/features/perfil/hooks/usePerfilQuery";

export default function PerfilPage() {
  const { data } = usePerfilQuery();

  const HeaderByRole = data?.rol_id === 1 ? <HeaderAd /> : <HeaderUsr />;

  return (
    <>
      {HeaderByRole}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto mt-[6.5rem] md:mt-[5.5rem]">
        <div className="mb-6">
          <PageHead
            icon={<User size={22} />}
            eyebrow={
              <>
                <Sparkles size={12} />
                Tu cuenta IMPA
              </>
            }
            title="Mi perfil"
            subtitle="Revisa y actualiza tu información personal, dirección y mascotas adoptadas."
          />
        </div>

        <PerfilCard />
      </div>
    </>
  );
}
