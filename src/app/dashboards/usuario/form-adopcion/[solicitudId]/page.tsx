"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FileText, Heart, Sparkles, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";

import AdoptionForm, { type AdoptionPayload } from "@/features/adopciones/components/client/AdoptionForm";
import { obtenerSolicitudParaAdopcion } from "@/features/usuarios/actions/solicitudes-actions";
import { crearAdopcion } from "@/features/adopciones/actions/adopciones-actions";

import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import PanelEstado from "@/features/adopciones/components/client/PanelEstado";

import { toast } from "sonner";

export default function FormularioAdopcionPage() {
    const router = useRouter();
    const { solicitudId } = useParams<{ solicitudId: string }>();

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [solicitud, setSolicitud] = useState<null | {
        id: string;
        numero_solicitud: string;
        usuario_id: string;
        mascota_id: string;
    }>(null);

    useEffect(() => {
        (async () => {
            try {
                const s = await obtenerSolicitudParaAdopcion(String(solicitudId));
                setSolicitud({
                    id: s.id,
                    numero_solicitud: s.numero_solicitud,
                    usuario_id: s.usuario_id,
                    mascota_id: s.mascota_id,
                });
            } catch (e: any) {
                setErrorMsg(e?.message || "No se pudo cargar la solicitud.");
            } finally {
                setLoading(false);
            }
        })();
    }, [solicitudId]);

    const handleSubmit = async (payload: AdoptionPayload) => {
        if (!solicitud) {
            toast.error("No se encontró la solicitud para continuar.");
            return;
        }

        try {
            await crearAdopcion({
                solicitud_id: solicitud.id,
                tipo_vivienda: payload.tipoVivienda,
                espacio_disponible: payload.espacioDisponible,
                otras_mascotas: payload.otrasMascotas === "si",
                detalle_otras_mascotas: payload.detalleOtrasMascotas || null,
                evidencia_hogar_urls: payload.evidenciaHogarUrls,
                compromiso_seguimiento: payload.compromisoSeguimiento,
                compromiso_cuidado: payload.compromisoCuidado,
                observaciones_usuario: payload.observaciones || null,
            });

            toast.success("Formulario de adopción enviado con éxito.");
            router.push("/dashboards/usuario");
        } catch (err: any) {
            console.error(err);
            toast.error("No se pudo enviar el formulario de adopción.");
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="h-9 w-44 bg-impa-surface-3 rounded-xl impa-shimmer" />
                <div className="h-12 w-72 bg-impa-surface-3 rounded-xl impa-shimmer" />
                <div className="rounded-2xl border border-impa-line bg-white p-8 shadow-impa-sm space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 w-32 bg-impa-surface-2 rounded impa-shimmer" />
                            <div className="h-11 w-full bg-impa-surface-3 rounded-xl impa-shimmer" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboards/usuario/adopcion")}
                    className="cursor-pointer -ml-2"
                >
                    <ArrowLeft size={16} />
                    Volver al proceso
                </Button>

                <PanelEstado
                    tone="danger"
                    icon={<AlertCircle className="h-6 w-6" />}
                    title="No pudimos cargar tu solicitud"
                    desc={errorMsg}
                    action={
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/dashboards/usuario/adopcion")}
                        >
                            <ArrowLeft size={14} />
                            Regresar al inicio
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboards/usuario/adopcion")}
                className="cursor-pointer -ml-2"
            >
                <ArrowLeft size={16} />
                Volver al proceso
            </Button>

            <PageHead
                icon={<FileText size={22} />}
                eyebrow={
                    <>
                        <Sparkles size={12} />
                        Paso final · Adopción IMPA
                    </>
                }
                title="Formulario de adopción"
                subtitle="Cuéntanos cómo será el hogar de tu nueva mascota. Esta información ayudará al equipo IMPA a confirmar que el match será una historia exitosa."
            />

            {/* Banner contextual de seguridad */}
            <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl border border-impa-200 bg-gradient-to-r from-impa-50 via-white to-impa-success-soft/40 p-4 shadow-impa-xs">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-impa-cta text-white shadow-impa-sm shrink-0">
                    <ShieldCheck size={18} />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-impa-text-strong">
                        Tu información está protegida
                    </p>
                    <p className="text-xs text-impa-muted mt-0.5 leading-relaxed">
                        Estos datos solo serán visibles para el equipo IMPA y se usarán exclusivamente
                        para evaluar y dar seguimiento a tu proceso de adopción.
                    </p>
                </div>
                {solicitud?.numero_solicitud && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-impa-line text-[10px] font-bold uppercase tracking-wider text-impa-700 shadow-impa-xs shrink-0">
                        Solicitud #{solicitud.numero_solicitud}
                    </span>
                )}
            </div>

            {/* Card que envuelve el formulario */}
            <section className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

                <header className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-impa-line bg-gradient-to-b from-impa-surface-2/60 to-white">
                    <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-600 shadow-impa-xs">
                        <Heart size={16} className="fill-impa-500" />
                    </span>
                    <div className="min-w-0">
                        <h3 className="text-[15px] font-bold tracking-tight text-impa-text-strong">
                            Información para la adopción
                        </h3>
                        <p className="text-xs text-impa-muted leading-tight">
                            Completa cada sección. Los campos con asterisco son obligatorios.
                        </p>
                    </div>
                </header>

                <div className="p-5 sm:p-6">
                    <AdoptionForm
                        defaultValues={{
                            usuarioId: solicitud!.usuario_id,
                            mascotaId: solicitud!.mascota_id,
                        }}
                        onSubmit={handleSubmit}
                    />
                </div>
            </section>
        </div>
    );
}
