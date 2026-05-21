"use client";

import { useMemo, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "@/utils/calendarLocalizer";

import { useCitas } from "@/features/citas/hooks/useCitas";
import { useReprogramarCita } from "@/features/citas/hooks/useReprogramarCita";
import { useCancelarCita } from "@/features/citas/hooks/useCancelarCita";
import { useEvaluarCita } from "@/features/citas/hooks/useEvaluarCita";

import { Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import PageHead from "@/components/layout/PageHead";
import CitasTable from "@/features/citas/components/client/CitasTAble";
import CitaEvalModal from "@/features/citas/components/client/CitasEvalModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

import CitaReprogramarModal from "@/features/citas/components/client/CitaReprogramarModal";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import UserTableSkeleton from "@/features/usuarios/components/client/UserTableSkeleton";

type Cita = CitaType;

export default function GestionCitasPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const { data: citas = [], isLoading } = useCitas();
  const { mutate: reprogramar, isPending: isReprogramando } = useReprogramarCita();
  const { mutate: cancelar, isPending: isCancelando } = useCancelarCita();
  const { mutate: evaluar, isPending: isEvaluando } = useEvaluarCita();

  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] =
    useState<"todas" | "programada" | "completada" | "cancelada" | "aprobada">("programada");

  const [view, setView] = useState<"tabla" | "calendario">("tabla");

  // Modal reprogramar
  const [modalOpen, setModalOpen] = useState(false);
  const [edicionId, setEdicionId] = useState<string | null>(null);
  const [formFecha, setFormFecha] = useState<string>("");
  const [formHora, setFormHora] = useState<string>("");

  // Modal evaluación
  const [evalOpen, setEvalOpen] = useState(false);
  const [evalTarget, setEvalTarget] = useState<Cita | null>(null);

  useBodyScrollLock(modalOpen || evalOpen);

  /* FILTROS + BÚSQUEDA */
  const citasFiltradas = useMemo(() => {
    const q = query.toLowerCase().trim();

    return citas.filter((c) => {
      const matchQ =
        !q ||
        c.mascota?.nombre?.toLowerCase().includes(q) ||
        c.usuario?.nombres?.toLowerCase().includes(q) ||
        c.usuario?.email?.toLowerCase().includes(q);

      let matchEstado = true;

      if (filtroEstado === "aprobada") {
        // aprobada = asistió + buena_aprobada
        matchEstado =
          c.asistencia === "asistio" &&
          c.interaccion === "buena_aprobada";
      } else if (filtroEstado !== "todas") {
        // otros filtros usan directamente el estado
        matchEstado = c.estado === filtroEstado;
      }

      return matchQ && matchEstado;
    });
  }, [citas, query, filtroEstado]);

  /* PAGINACIÓN */
  const {
    slice: paginated,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = usePagination(citasFiltradas, ITEMS_PER_PAGE);

  /* CALENDARIO */
  const buildDate = (d: string, t: string) => {
    const hhmm = t.length > 5 ? t.slice(0, 5) : t;
    return new Date(`${d}T${hhmm}:00`);
  };

  const events = useMemo(
    () =>
      citas.map((c) => ({
        id: c.id,
        title: `${c.usuario?.nombres ?? "—"} · ${c.mascota?.nombre ?? "Mascota"
          }`,
        start: buildDate(c.fecha_cita, c.hora_cita),
        end: new Date(buildDate(c.fecha_cita, c.hora_cita).getTime() + 30 * 60 * 1000),
        resource: c,
        allDay: false,
      })),
    [citas]
  );

  /* HANDLERS */

  const openEdit = (c: Cita) => {
    setEdicionId(c.id);
    setFormFecha(c.fecha_cita);
    setFormHora(c.hora_cita.slice(0, 5));
    setModalOpen(true);
  };

  const closeModalReprogramar = () => {
    setModalOpen(false);
  };

  const onSubmitModal = () => {
    const ocupado = citas.some(c =>
      c.fecha_cita === formFecha &&
      c.hora_cita.slice(0, 5) === formHora &&
      c.id !== edicionId
    );

    if (ocupado) {
      return toast.error("Ese horario ya está ocupado");
    }

    // Ejecutar mutation
    reprogramar(
      {
        id: edicionId!,
        fecha: formFecha,
        hora: formHora,
      },
      {
        onSuccess: () => {
          closeModalReprogramar();
          toast.success("Cita reprogramada");
        },
        onError: () => {
          toast.error("Error al reprogramar");
        },
      }
    );
  };


  const cancelarCita = async (id: string) => {
    const ok = await toastConfirm("¿Cancelar esta cita?");
    if (!ok) return;

    cancelar(id, {
      onSuccess: () => {
        toast.success("Cita cancelada");
      },
      onError: () => {
        toast.error("No se pudo cancelar");
      }
    });
  };


  const openEval = (c: Cita) => {
    setEvalTarget(c);
    setEvalOpen(true);
  };

  const applyEvaluation = (payload: {
    asistencia: Cita["asistencia"];
    interaccion: Cita["interaccion"];
    nota: string | null;
  }) => {
    if (!evalTarget) return;

    evaluar(
      {
        id: evalTarget.id,
        asistencia: payload.asistencia,
        interaccion: payload.interaccion,
        nota: payload.nota,
      },
      {
        onSuccess: () => {
          toast.success("Evaluación guardada");
          setEvalOpen(false);
          setEvalTarget(null);
        },
        onError: (err) => {
          console.error(err);
          toast.error("Error al guardar la evaluación");
        },
      }
    );
  };


  if (isLoading)
    return (
      <div className="py-12">
        <UserTableSkeleton />
      </div>
    );

  return (
    <div className="min-h-[70vh] space-y-6 transition-all">
      {/* HEADER */}
      <PageHead
        title="Gestión de citas de adopción"
        subtitle="Administra todas las citas de adopción programadas."
      />

      {/* FILTROS Y BUSCADOR */}
      <div className="space-y-6">

        {/* Toggle Tabla / Calendario */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-0.5 rounded-xl border border-impa-line bg-impa-surface-2 p-1 shadow-impa-xs">
            <button
              className={`inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ease-impa-out ${view === "tabla"
                ? "bg-white text-impa-text shadow-impa-sm border border-impa-line"
                : "text-impa-muted hover:text-impa-text hover:bg-white/60"
                }`}
              onClick={() => setView("tabla")}
            >
              Tabla
            </button>

            <button
              className={`inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ease-impa-out ${view === "calendario"
                ? "bg-white text-impa-text shadow-impa-sm border border-impa-line"
                : "text-impa-muted hover:text-impa-text hover:bg-white/60"
                }`}
              onClick={() => setView("calendario")}
            >
              Calendario
            </button>
          </div>
        </div>

        {/* KPI CHIPS COMO FILTROS */}
        <div className="flex flex-wrap gap-2 pt-1">

          {/* Programadas */}
          <button
            onClick={() => setFiltroEstado("programada")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer
                ${filtroEstado === "programada"
                ? "bg-amber-100 text-amber-800 border-amber-300 shadow-impa-xs scale-[1.03]"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:-translate-y-px"}
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Programadas: {citas.filter((c) => c.estado === "programada").length}
          </button>

          {/* Completadas */}
          <button
            onClick={() => setFiltroEstado("completada")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer
                ${filtroEstado === "completada"
                ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-impa-xs scale-[1.03]"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:-translate-y-px"}
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completadas: {citas.filter((c) => c.estado === "completada").length}
          </button>

          {/* Canceladas */}
          <button
            onClick={() => setFiltroEstado("cancelada")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer
                ${filtroEstado === "cancelada"
                ? "bg-impa-surface-3 text-impa-text border-impa-line-strong shadow-impa-xs scale-[1.03]"
                : "bg-impa-surface-2 text-impa-muted border-impa-line hover:bg-impa-surface-3 hover:-translate-y-px"}
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-impa-quiet" />
            Canceladas: {citas.filter((c) => c.estado === "cancelada").length}
          </button>

          {/* Aprobadas */}
          <button
            onClick={() => setFiltroEstado("aprobada")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer
                ${filtroEstado === "aprobada"
                ? "bg-impa-100 text-impa-800 border-impa-300 shadow-impa-xs scale-[1.03]"
                : "bg-impa-50 text-impa-700 border-impa-200 hover:bg-impa-100 hover:-translate-y-px"
              }
            `}
          >
            <CheckCircle size={12} />
            Aprobadas:{" "}
            {
              citas.filter(
                (c) =>
                  c.asistencia === "asistio" &&
                  c.interaccion === "buena_aprobada"
              ).length
            }
          </button>

          {/* Botón para limpiar filtro */}
          {filtroEstado !== "todas" && (
            <button
              onClick={() => setFiltroEstado("todas")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-impa-line text-xs font-semibold bg-white text-impa-muted hover:bg-impa-surface-2 hover:text-impa-text transition-colors duration-150 cursor-pointer"
            >
              Mostrar todas
            </button>
          )}
        </div>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 rounded-xl border border-impa-line bg-white px-3 h-10 w-full md:w-96 shadow-impa-xs transition-[border-color,box-shadow,background-color] duration-200 ease-impa-out hover:border-impa-300 focus-within:border-impa-500 focus-within:ring-4 focus-within:ring-impa-500/15">
        <Search className="h-4 w-4 text-impa-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por usuario, mascota o correo"
          className="flex-1 text-sm text-impa-text placeholder:text-impa-subtle outline-none bg-transparent"
        />
      </div>

      {/* CONTENIDO */}
      {view === "tabla" ? (
        <>
          <CitasTable
            items={paginated}
            onReprogramar={openEdit}
            onCancelar={cancelarCita}
            onEvaluar={openEval}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={citasFiltradas.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemsLabel="citas"
            onChange={(p) => {
              if (p > page) nextPage();
              else if (p < page) prevPage();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 10);
            }}
          />
        </>
      ) : (

        /* VISTA CALENDARIO */
        <div className="rounded-2xl border border-impa-line bg-white p-3 shadow-impa-sm">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            views={["month", "week", "day"]}
            defaultView="week"
            popup
            min={new Date(0, 0, 0, 8, 0)}
            max={new Date(0, 0, 0, 15, 0)}
            step={30}
            selectable={false}
            onSelectEvent={(e: any) => openEdit(e.resource)}
          />
        </div>
      )}

      {modalOpen &&
        createPortal(
          <CitaReprogramarModal
            open={modalOpen}
            onClose={closeModalReprogramar}
            onSubmit={onSubmitModal}
            isSaving={isReprogramando}
            fecha={formFecha}
            hora={formHora}
            onFechaChange={setFormFecha}
            onHoraChange={setFormHora}
            cita={citas.find(c => c.id === edicionId) || null}
            citas={citas}
          />,
          document.body
        )
      }


      {/* MODAL EVALUACIÓN */}
      {evalOpen &&
        createPortal(
          <CitaEvalModal
            open={evalOpen}
            onClose={() => {
              setEvalOpen(false);
              setEvalTarget(null);
            }}
            onConfirm={applyEvaluation}
            citaLabel={
              evalTarget
                ? `${evalTarget.usuario?.nombres ?? ""} ${evalTarget.usuario?.apellido_paterno ?? ""} ${evalTarget.usuario?.apellido_materno ?? ""} — ${evalTarget.mascota?.nombre ?? ""}`
                : ""
            }
            defaultAsistencia={evalTarget?.asistencia ?? null}
            defaultInteraccion={evalTarget?.interaccion ?? null}
            defaultNota={evalTarget?.nota ?? ""}
          />,
          document.body
        )
      }


    </div>
  );
}
