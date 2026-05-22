-- =====================================================================
-- IMPA · Módulo de Pláticas de Concientización
-- Crea tabla platicas_concientizacion para flujo Admin + Usuario.
-- Sigue el mismo estilo de esterilizaciones-schema.sql.
-- =====================================================================
-- Tablas asumidas existentes:
--   - perfiles (id, rol_id, auth_user_id, nombres, apellido_paterno, ...)
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Limpieza previa (idempotente)
--    DROP TABLE ... CASCADE elimina automáticamente los triggers
--    asociados, así que no necesitamos drop trigger explícitos.
-- ---------------------------------------------------------------------
drop table if exists platicas_concientizacion cascade;
drop type if exists estado_platica;
drop type if exists tipo_lugar_platica;
drop sequence if exists platicas_folio_seq;

-- ---------------------------------------------------------------------
-- 2. Enums
-- ---------------------------------------------------------------------
create type estado_platica as enum (
    'pendiente',     -- usuario solicitó; admin no ha revisado
    'en_revision',   -- admin la está revisando
    'aprobada',      -- aprobada, con fecha agendada
    'rechazada',     -- admin no la aprobó
    'finalizada',    -- la plática ya se impartió
    'cancelada'      -- cancelada por usuario o admin
);

create type tipo_lugar_platica as enum (
    'escuela',
    'empresa',
    'colonia',
    'dependencia',
    'asociacion',
    'otro'
);

-- ---------------------------------------------------------------------
-- 3. Secuencia para folio legible (PLA-01000, PLA-01001, ...)
-- ---------------------------------------------------------------------
create sequence platicas_folio_seq start 1000;

-- ---------------------------------------------------------------------
-- 4. Tabla principal
-- ---------------------------------------------------------------------
create table platicas_concientizacion (
    id                    uuid primary key default gen_random_uuid(),
    folio                 text not null unique
                          default 'PLA-' || lpad(
                              nextval('platicas_folio_seq')::text,
                              5,
                              '0'
                          ),

    -- Solicitante (siempre autenticado en este flujo)
    usuario_id            uuid not null references perfiles(id) on delete set null,
    admin_responsable     uuid references perfiles(id) on delete set null,

    -- Datos del solicitante (snapshot, por si cambia el perfil después)
    nombre_solicitante    text not null,
    telefono_contacto     text not null,

    -- Datos de la plática
    tipo_lugar            tipo_lugar_platica not null,
    nombre_lugar          text,                    -- "Escuela primaria X", "Empresa Y"
    numero_personas       integer not null check (numero_personas > 0 and numero_personas < 10000),
    direccion             text not null,
    fecha_tentativa       date not null,
    fecha_definitiva      timestamptz,
    comentarios           text,

    -- Datos internos del admin
    observaciones_internas text,
    motivo_rechazo         text,

    -- Estado
    estado                estado_platica not null default 'pendiente',

    -- Auditoría
    created_at            timestamptz not null default now(),
    updated_at            timestamptz not null default now(),
    actualizado_por       uuid references perfiles(id) on delete set null
);

create index platicas_estado_idx       on platicas_concientizacion(estado);
create index platicas_usuario_idx      on platicas_concientizacion(usuario_id);
create index platicas_fecha_def_idx    on platicas_concientizacion(fecha_definitiva desc);
create index platicas_created_idx      on platicas_concientizacion(created_at desc);

-- ---------------------------------------------------------------------
-- 5. Triggers de auditoría
-- ---------------------------------------------------------------------
create or replace function set_updated_at_platicas()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger platicas_set_updated_at
before update on platicas_concientizacion
for each row execute function set_updated_at_platicas();

-- ---------------------------------------------------------------------
-- 6. Row Level Security
-- ---------------------------------------------------------------------
alter table platicas_concientizacion enable row level security;

-- 6a) Admin: acceso total (rol_id = 1)
create policy "platicas_admin_all" on platicas_concientizacion
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

-- 6b) Usuario: lee sólo sus solicitudes
create policy "platicas_usuario_read" on platicas_concientizacion
    for select
    using (usuario_id = auth.uid());

-- 6c) Usuario: crea solicitudes para sí mismo, en estado pendiente
create policy "platicas_usuario_insert" on platicas_concientizacion
    for insert
    with check (
        usuario_id = auth.uid()
        and estado = 'pendiente'
        and admin_responsable is null
        and fecha_definitiva is null
        and motivo_rechazo is null
        and observaciones_internas is null
    );

-- 6d) Usuario: sólo puede CANCELAR su propia solicitud mientras esté
--      pendiente o en revisión.
create policy "platicas_usuario_cancela" on platicas_concientizacion
    for update
    using (
        usuario_id = auth.uid()
        and estado in ('pendiente', 'en_revision')
    )
    with check (
        usuario_id = auth.uid()
        and estado = 'cancelada'
    );

commit;

-- =====================================================================
-- Notas operativas
-- =====================================================================
-- · Folio generado en BD (PLA-01000, PLA-01001, ...). No tocarlo desde
--   la app: dejar que el DEFAULT lo asigne.
-- · `observaciones_internas` y `motivo_rechazo` son SOLO admin; las
--   políticas usuario impiden insertarlos o modificarlos.
-- · `fecha_tentativa` la propone el ciudadano (date), `fecha_definitiva`
--   la asigna el admin al aprobar (timestamptz con hora).
-- =====================================================================
