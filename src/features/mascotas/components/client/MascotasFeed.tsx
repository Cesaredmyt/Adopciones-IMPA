"use client";

import React from "react";
import { useMascotasPublicasInfiniteQuery } from "@/features/mascotas/hooks/useMascotasPublicasInfiniteQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import MascotaCard from "@/features/mascotas/components/client/MascotaCard";
import type { Mascota } from "@/features/mascotas/types/mascotas";
import MascotasFeedSkeleton from "@/features/mascotas/components/client/MascotasFeedSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search } from "lucide-react";


type Props = {
    search: string;
    especie: string;
    sexo: string;
    onView: (m: Mascota) => void;
    onAdopt: (m: Mascota) => void;
    limit?: number;
    disableInfinite?: boolean;
};


export default function MascotasFeed({
    search,
    especie,
    sexo,
    onView,
    onAdopt,
}: Props) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useMascotasPublicasInfiniteQuery({
        search,
        especie,
        sexo,
    });

    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        onLoadMore: fetchNextPage,
    });

    const mascotas = data?.pages.flatMap((p) => p.items) ?? [];

    if (isLoading) {
        return <MascotasFeedSkeleton />;
    }


    return (
        <>
            <section className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {mascotas.map((m, i) => (
                    <div
                        key={m.id}
                        className="stagger-item"
                        style={{ ['--i' as any]: i % 12 }}
                    >
                        <MascotaCard
                            m={m}
                            onView={() => onView(m)}
                            onAdopt={() => onAdopt(m)}
                        />
                    </div>
                ))}

                {mascotas.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState
                            icon={<Search size={26} />}
                            title="No encontramos mascotas con esos filtros"
                            description="Intenta ajustar los filtros de especie, sexo o el término de búsqueda para descubrir más amigos esperando un hogar."
                        />
                    </div>
                )}
            </section>


            {hasNextPage && (
                <div
                    ref={loadMoreRef}
                    className="h-10 pointer-events-none"
                />
            )}

            {isFetchingNextPage && (
                <div className="py-6 flex justify-center transition-opacity duration-300">
                    <div className="w-5 h-5 border-2 border-impa-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </>
    );
}
