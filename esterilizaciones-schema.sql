-- =====================================================================
-- IMPA · Módulo de Esterilizaciones
-- Migración: recrea tabla esterilizaciones para flujo Admin + Usuario
-- =====================================================================
-- Asume que la tabla esterilizaciones existente está VACÍA o solo con
-- datos de prueba. Si tienes datos reales, NO ejecutes este script tal cual.
--
-- Tablas relacionadas que se asumen existentes:
--   - perfiles (id, rol_id, auth_user_id, nombres, email)
--   - mascotas (id, esterilizado, nombre, ...)
--   - adopciones (id, adoptante_id -> perfiles.id, mascota_id, estado)
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Limpieza de la tabla previa
-- ---------------------------------------------------------------------
drop trigger if exists esterilizaciones_set_updated_at on esterilizaciones;
drop trigger if exists esterilizaciones_marca_mascota on esterilizaciones;
drop table if exists esterilizaciones cascade;
drop type if exists estado_esterilizacion;
drop sequence if exists esterilizaciones_folio_seq;

-- ---------------------------------------------------------------------
-- 2. Enum de estados (alineado con citas_veterinarias en estilo)
-- ---------------------------------------------------------------------
create type estado_esterilizacion as enum (
    'pendiente',      -- usuario solicitó; admin no ha revisado
    'aprobada',       -- admin aprobó; falta asignar fecha/hora
    'programada',     -- agendada con fecha y hora confirmadas
    'en_quirofano',   -- cirugía en curso
    'completada',     -- cirugía finalizada exitosamente
    'complicacion',   -- finalizada con eventos adversos relevantes
    'cancelada',      -- cancelada (por usuario o admin) antes de operar
    'rechazada'       -- admin no aprobó la solicitud
);

-- ---------------------------------------------------------------------
-- 3. Secuencia para folio legible (sin colisiones, sin Math.random())
-- ---------------------------------------------------------------------
create sequence esterilizaciones_folio_seq start 1000;

-- ---------------------------------------------------------------------
-- 4. Tabla principal
-- ---------------------------------------------------------------------
create table esterilizaciones (
    id                    uuid primary key default gen_random_uuid(),
    folio                 text not null unique
                          default 'EST-' || lpad(
                              nextval('esterilizaciones_folio_seq')::text,
                              5,
                              '0'
                          ),

    -- Relaciones (referenciales fuertes)
    mascota_id            uuid not null references mascotas(id) on delete restrict,
    usuario_id            uuid references perfiles(id) on delete set null,
    admin_responsable     uuid references perfiles(id) on delete set null,

    -- Datos clínicos
    peso_kg               numeric(5, 2)
                          check (peso_kg is null or peso_kg > 0 and peso_kg < 200),
    observaciones_previas text,

    -- Programación
    fecha_solicitud       timestamptz not null default now(),
    fecha_programada      timestamptz,
    fecha_realizada       timestamptz,

    -- Resultado clínico
    resultado_notas       text,
    complicaciones        text,
    motivo_cancelacion    text,

    -- Estado
    estado                estado_esterilizacion not null default 'pendiente',

    -- Auditoría
    created_at            timestamptz not null default now(),
    updated_at            timestamptz not null default now(),
    actualizado_por       uuid references perfiles(id) on delete set null
);

create index esterilizaciones_estado_idx       on esterilizaciones(estado);
create index esterilizaciones_mascota_idx      on esterilizaciones(mascota_id);
create index esterilizaciones_usuario_idx      on esterilizaciones(usuario_id);
create index esterilizaciones_fecha_prog_idx   on esterilizaciones(fecha_programada desc);
create index esterilizaciones_created_idx      on esterilizaciones(created_at desc);

-- ---------------------------------------------------------------------
-- 5. Triggers de auditoría
-- ---------------------------------------------------------------------

-- 5a) updated_at automático
create or replace function set_updated_at_esterilizaciones()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger esterilizaciones_set_updated_at
before update on esterilizaciones
for each row execute function set_updated_at_esterilizaciones();

-- 5b) Al completar, marcar mascotas.esterilizado = true
create or replace function on_esterilizacion_completada()
returns trigger as $$
begin
    if new.estado = 'completada'
       and (old.estado is null or old.estado <> 'completada') then
        update mascotas
        set esterilizado = true
        where id = new.mascota_id;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger esterilizaciones_marca_mascota
after insert or update of estado on esterilizaciones
for each row execute function on_esterilizacion_completada();

-- ---------------------------------------------------------------------
-- 6. Row Level Security
-- ---------------------------------------------------------------------
alter table esterilizaciones enable row level security;

-- 6a) Admin: acceso total (rol_id = 1)
create policy "esterilizaciones_admin_all" on esterilizaciones
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

-- 6b) Usuario: lee solo registros donde es solicitante o adoptante aprobado
create policy "esterilizaciones_usuario_read" on esterilizaciones
    for select
    using (
        usuario_id = auth.uid()
        or exists (
            select 1 from adopciones a
            where a.mascota_id = esterilizaciones.mascota_id
              and a.adoptante_id = auth.uid()
              and a.estado = 'aprobada'
        )
    );

-- 6c) Usuario: solo puede CREAR solicitudes para sus mascotas adoptadas
create policy "esterilizaciones_usuario_insert" on esterilizaciones
    for insert
    with check (
        usuario_id = auth.uid()
        and estado = 'pendiente'
        and admin_responsable is null
        and fecha_realizada is null
        and exists (
            select 1 from adopciones a
            where a.mascota_id = esterilizaciones.mascota_id
              and a.adoptante_id = auth.uid()
              and a.estado = 'aprobada'
        )
    );

-- 6d) Usuario: solo puede CANCELAR su solicitud mientras está pendiente o aprobada
create policy "esterilizaciones_usuario_cancela" on esterilizaciones
    for update
    using (
        usuario_id = auth.uid()
        and estado in ('pendiente', 'aprobada')
    )
    with check (
        usuario_id = auth.uid()
        and estado = 'cancelada'
    );

commit;

-- =====================================================================
-- Notas operativas
-- =====================================================================
-- · El folio se genera en BD (EST-01000, EST-01001, ...). No tocarlo
--   desde la app: dejar que el DEFAULT lo asigne.
-- · El trigger esterilizaciones_marca_mascota mantiene en sync el flag
--   mascotas.esterilizado. Si necesitas revertir (cancelar una cirugía
--   completada), hazlo manualmente en mascotas.
-- · Para campañas internas IMPA sin usuario, deja usuario_id = NULL.
--   La política de inserción usuario_insert rechaza ese caso, así que
--   el admin debe insertar campañas internas con su sesión admin
--   (donde aplica esterilizaciones_admin_all).
-- · auth.uid() devuelve el ID del usuario autenticado de Supabase Auth,
--   que en este sistema coincide con perfiles.id (ver
--   features/adopciones/actions/obtenerAdopcionesIdsPorUsuario).
-- =====================================================================
