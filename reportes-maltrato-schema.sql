-- =====================================================================
-- IMPA · Módulo de Reportes de Maltrato Animal
-- Crea tablas reportes_maltrato + reportes_maltrato_bitacora,
-- bucket de storage y políticas RLS para flujo Admin + Público anónimo.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Limpieza previa (idempotente)
-- ---------------------------------------------------------------------
drop trigger if exists reportes_set_updated_at on reportes_maltrato;
drop trigger if exists reportes_bitacora_estado on reportes_maltrato;
drop table if exists reportes_maltrato_bitacora cascade;
drop table if exists reportes_maltrato cascade;
drop type if exists estado_reporte_maltrato;
drop type if exists gravedad_reporte;
drop type if exists prioridad_reporte;
drop sequence if exists reportes_folio_seq;

-- ---------------------------------------------------------------------
-- 2. Enums
-- ---------------------------------------------------------------------
create type estado_reporte_maltrato as enum (
    'recibido',          -- recién creado, sin revisar
    'en_revision',       -- admin lo está clasificando
    'en_investigacion',  -- caso activo en campo
    'resuelto',          -- caso atendido y cerrado positivamente
    'cerrado',           -- cerrado por otras razones (no procedía, duplicado)
    'falso_positivo'     -- denuncia infundada
);

create type gravedad_reporte as enum (
    'baja',
    'media',
    'alta',
    'critica'
);

create type prioridad_reporte as enum (
    'baja',
    'normal',
    'alta',
    'urgente'
);

-- ---------------------------------------------------------------------
-- 3. Secuencia para folio legible (REP-01000, REP-01001, ...)
-- ---------------------------------------------------------------------
create sequence reportes_folio_seq start 1000;

-- ---------------------------------------------------------------------
-- 4. Tabla principal
-- ---------------------------------------------------------------------
create table reportes_maltrato (
    id                  uuid primary key default gen_random_uuid(),
    folio               text not null unique
                        default 'REP-' || lpad(
                            nextval('reportes_folio_seq')::text,
                            5,
                            '0'
                        ),

    -- Reportante: opcionalmente vinculado a un perfil (NULL si anónimo)
    reportante_id       uuid references perfiles(id) on delete set null,

    -- Snapshot de datos del reportante (anónimo opcional)
    nombre_reportante   text,             -- NULL = anónimo
    telefono_contacto   text,
    email_contacto      text,
    es_anonimo          boolean not null default false,

    -- Datos del incidente
    asunto              text not null,
    descripcion         text not null,
    direccion_incidente text not null,
    colonia             text not null,
    fecha_incidente     date,
    gravedad            gravedad_reporte not null default 'media',

    -- Evidencia fotográfica (URLs públicas del bucket reportes-maltrato)
    evidencias_urls     text[] not null default '{}',

    -- Datos internos del admin
    prioridad           prioridad_reporte not null default 'normal',
    asignado_a          uuid references perfiles(id) on delete set null,
    notas_internas      text,
    resolucion          text,

    -- Estado
    estado              estado_reporte_maltrato not null default 'recibido',

    -- Auditoría
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    actualizado_por     uuid references perfiles(id) on delete set null
);

create index reportes_estado_idx     on reportes_maltrato(estado);
create index reportes_gravedad_idx   on reportes_maltrato(gravedad);
create index reportes_prioridad_idx  on reportes_maltrato(prioridad);
create index reportes_reportante_idx on reportes_maltrato(reportante_id);
create index reportes_created_idx    on reportes_maltrato(created_at desc);

-- ---------------------------------------------------------------------
-- 5. Tabla de bitácora (historial)
-- ---------------------------------------------------------------------
create table reportes_maltrato_bitacora (
    id              uuid primary key default gen_random_uuid(),
    reporte_id      uuid not null references reportes_maltrato(id) on delete cascade,
    autor_id        uuid references perfiles(id) on delete set null,
    autor_nombre    text,        -- snapshot por si el perfil se borra
    accion          text not null,           -- "estado:recibido->en_revision", "comentario", "asignacion", ...
    descripcion     text,
    estado_anterior estado_reporte_maltrato,
    estado_nuevo    estado_reporte_maltrato,
    created_at      timestamptz not null default now()
);

create index reportes_bitacora_reporte_idx on reportes_maltrato_bitacora(reporte_id, created_at desc);

-- ---------------------------------------------------------------------
-- 6. Triggers
-- ---------------------------------------------------------------------
create or replace function set_updated_at_reportes()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger reportes_set_updated_at
before update on reportes_maltrato
for each row execute function set_updated_at_reportes();

-- Bitácora automática en cambios de estado
create or replace function on_reporte_estado_cambia()
returns trigger as $$
begin
    if new.estado is distinct from old.estado then
        insert into reportes_maltrato_bitacora (
            reporte_id, autor_id, accion,
            estado_anterior, estado_nuevo,
            descripcion
        ) values (
            new.id,
            new.actualizado_por,
            'cambio_estado',
            old.estado,
            new.estado,
            'Estado actualizado por sistema'
        );
    end if;
    return new;
end;
$$ language plpgsql;

create trigger reportes_bitacora_estado
after update of estado on reportes_maltrato
for each row execute function on_reporte_estado_cambia();

-- ---------------------------------------------------------------------
-- 7. Row Level Security · reportes_maltrato
-- ---------------------------------------------------------------------
alter table reportes_maltrato enable row level security;

-- 7a) Admin: acceso total
create policy "reportes_admin_all" on reportes_maltrato
    for all
    using (
        exists (
            select 1 from perfiles
            where perfiles.id = auth.uid()
              and perfiles.rol_id = 1
        )
    )
    with check (
        exists (
            select 1 from perfiles
            where perfiles.id = auth.uid()
              and perfiles.rol_id = 1
        )
    );

-- 7b) Insert público (anónimo): cualquiera puede crear un reporte,
--      pero sólo con estado inicial 'recibido' y sin tocar campos internos.
create policy "reportes_publico_insert" on reportes_maltrato
    for insert
    to anon, authenticated
    with check (
        estado = 'recibido'
        and asignado_a is null
        and prioridad = 'normal'
        and notas_internas is null
        and resolucion is null
        and actualizado_por is null
    );

-- 7c) Reportante autenticado: lee SUS reportes (cuando tenía sesión al
--      crear). El seguimiento público anónimo NO usa RLS: pasa por una
--      Server Action que valida (folio + email/teléfono) lado servidor.
create policy "reportes_reportante_read" on reportes_maltrato
    for select
    using (reportante_id = auth.uid());

-- ---------------------------------------------------------------------
-- 8. Row Level Security · reportes_maltrato_bitacora
-- ---------------------------------------------------------------------
alter table reportes_maltrato_bitacora enable row level security;

create policy "reportes_bitacora_admin_all" on reportes_maltrato_bitacora
    for all
    using (
        exists (
            select 1 from perfiles
            where perfiles.id = auth.uid()
              and perfiles.rol_id = 1
        )
    )
    with check (
        exists (
            select 1 from perfiles
            where perfiles.id = auth.uid()
              and perfiles.rol_id = 1
        )
    );

-- ---------------------------------------------------------------------
-- 9. Storage bucket para evidencias fotográficas
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('reportes-maltrato', 'reportes-maltrato', true)
on conflict (id) do nothing;

-- 9a) Cualquier visitante (anon/authenticated) puede SUBIR evidencias
--      (necesario para el reporte público anónimo)
drop policy if exists "reportes_evidencia_insert_publico" on storage.objects;
create policy "reportes_evidencia_insert_publico" on storage.objects
    for insert
    to anon, authenticated
    with check (bucket_id = 'reportes-maltrato');

-- 9b) Lectura pública del bucket (las URLs públicas se exponen al admin
--      y al reportante; el bucket es público de todas formas).
drop policy if exists "reportes_evidencia_select_publico" on storage.objects;
create policy "reportes_evidencia_select_publico" on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'reportes-maltrato');

-- 9c) Sólo admins pueden borrar evidencias.
drop policy if exists "reportes_evidencia_delete_admin" on storage.objects;
create policy "reportes_evidencia_delete_admin" on storage.objects
    for delete
    using (
        bucket_id = 'reportes-maltrato'
        and exists (
            select 1 from perfiles
            where perfiles.id = auth.uid()
              and perfiles.rol_id = 1
        )
    );

commit;

-- =====================================================================
-- Notas operativas
-- =====================================================================
-- · El reporte público anónimo se crea desde /reportar-maltrato:
--      - sin sesión       → reportante_id = NULL, es_anonimo = TRUE
--      - con sesión       → reportante_id = auth.uid(), es_anonimo = FALSE
-- · El seguimiento de un reporte anónimo se hace por folio + email/tel
--   en un endpoint server (no por RLS). Esto evita filtrar reportes
--   ajenos a quien sólo tenga un folio.
-- · El trigger reportes_bitacora_estado registra cada cambio de estado
--   automáticamente. Comentarios manuales del admin se insertan
--   directamente en reportes_maltrato_bitacora con accion='comentario'.
-- · Si quieres deshabilitar el bucket público, cambia el insert de
--   storage.buckets a `public=false` y agrega política de read condicional.
-- =====================================================================
