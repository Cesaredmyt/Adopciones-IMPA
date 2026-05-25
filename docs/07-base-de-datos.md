# 07 - Base de Datos

---

## 1. Motor de Base de Datos

| Parametro | Valor |
|-----------|-------|
| Motor | PostgreSQL 17 |
| Proveedor | Supabase Cloud |
| Schema principal | public |
| Schema de autenticacion | auth (gestionado por Supabase) |
| Seguridad | Row Level Security (RLS) habilitado |
| Region | Supabase Cloud (ver Dashboard) |

---

## 2. Tablas del Sistema

El sistema tiene **22 tablas** en el schema `public` mas vistas derivadas.

### 2.1 Tabla: perfiles

Extiende a `auth.users` de Supabase. Cada usuario registrado tiene exactamente un perfil.

| Columna | Tipo | Nulo | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | uuid | NO | — | FK -> auth.users(id) |
| nombres | varchar | NO | — | Nombres del usuario |
| apellido_paterno | varchar | NO | — | Primer apellido |
| apellido_materno | varchar | SI | — | Segundo apellido |
| email | varchar | NO | '' | Email unico |
| curp | varchar | SI | — | CURP (unico si se proporciona) |
| telefono | varchar | SI | — | Telefono de contacto |
| fecha_nacimiento | date | SI | — | Fecha de nacimiento |
| ocupacion | varchar | SI | — | Ocupacion del usuario |
| activo | boolean | SI | true | Si el usuario esta activo |
| avatar_url | text | SI | — | URL de foto de perfil |
| bio | text | SI | — | Biografia breve |
| preferencias | jsonb | SI | '{}' | Preferencias del usuario |
| rol_id | integer | SI | — | FK -> roles(id) |
| created_at | timestamptz | SI | now() | Fecha de creacion |
| updated_at | timestamptz | SI | now() | Ultima actualizacion |
| created_by | uuid | SI | — | FK -> auth.users(id) |

---

### 2.2 Tabla: roles

Catalogo de roles del sistema.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | integer | PK (secuencia) |
| nombre | varchar | Nombre del rol |

**Datos:** `1 = administrador`, `2 = usuario`

---

### 2.3 Tabla: mascotas

Catalogo de animales del refugio IMPA.

| Columna | Tipo | Nulo | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |
| nombre | varchar | NO | — | Nombre del animal |
| raza_id | uuid | SI | — | FK -> razas(id) |
| sexo | USER-DEFINED | NO | — | ENUM: macho / hembra |
| edad | varchar | SI | — | Descripcion de edad |
| peso_kg | numeric | SI | — | Peso en kilogramos |
| altura_cm | integer | SI | — | Altura en centimetros |
| colores | jsonb | SI | '[]' | Array JSON de colores del pelaje |
| descripcion_fisica | text | SI | — | Descripcion detallada |
| personalidad | varchar | SI | — | Descripcion de personalidad |
| esterilizado | boolean | SI | false | Si fue esterilizado |
| disponible_adopcion | boolean | SI | true | Si esta disponible |
| estado | USER-DEFINED | NO | 'disponible' | ENUM estado_mascota |
| tamano | varchar | SI | 'pequeno' | Tamano del animal |
| qr_code | varchar | SI | — | Codigo QR unico |
| imagen_url | text | SI | — | URL de imagen principal |
| fecha_ingreso | date | NO | CURRENT_DATE | Fecha de ingreso al refugio |
| lugar_rescate | text | SI | — | Lugar donde fue rescatado |
| condicion_ingreso | text | SI | — | Condicion al ingresar |
| observaciones_medicas | text | SI | — | Notas medicas iniciales |
| metadata | jsonb | SI | '{}' | Datos adicionales |
| created_at | timestamptz | SI | now() | Fecha de creacion |
| updated_at | timestamptz | SI | now() | Ultima actualizacion |

**ENUM estado_mascota:** disponible | en_proceso | adoptado | en_pausa

---

### 2.4 Tabla: razas

Catalogo de razas de animales.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| nombre | varchar | Nombre de la raza (unico) |
| slug | varchar | Slug URL (unico) |
| especie | text | "perro" o "gato" |
| tamano | USER-DEFINED | ENUM: pequeno, mediano, grande, gigante |
| activa | boolean | Si la raza esta activa |
| created_at | timestamptz | Fecha de creacion |

---

### 2.5 Tabla: solicitudes_adopcion

Solicitudes formales de adopcion enviadas por usuarios.

| Columna | Tipo | Nulo | Descripcion |
|---------|------|------|-------------|
| id | uuid | NO | PK |
| numero_solicitud | varchar | NO | Numero unico legible |
| usuario_id | uuid | NO | FK -> perfiles(id) |
| mascota_id | uuid | NO | FK -> mascotas(id) |
| estado | USER-DEFINED | SI | ENUM estado_solicitud |
| prioridad | integer | SI | 1 = normal |
| motivo_adopcion | text | NO | Por que quiere adoptar |
| experiencia_mascotas | text | SI | Experiencia previa |
| mascotas_anteriores | jsonb | SI | Lista de mascotas anteriores |
| otros_animales_actuales | text | SI | Animales que viven en casa |
| tiempo_disponible | varchar | SI | Tiempo dedicado al animal |
| presupuesto_mensual | numeric | SI | Presupuesto estimado |
| plan_cuidados | text | SI | Plan de cuidados |
| situacion_vivienda | text | SI | Descripcion del hogar |
| acuerdo_familia | boolean | SI | Acuerdo familiar |
| referencias_personales | jsonb | SI | Array de referencias |
| veterinario_referencia | jsonb | SI | Datos de veterinario de confianza |
| comentarios_admin | text | SI | Notas del admin |
| admin_responsable | uuid | SI | FK -> perfiles(id) |
| fecha_respuesta | timestamptz | SI | Cuando el admin respondio |
| ip_address | inet | SI | IP del solicitante |
| utm_source | varchar | SI | Origen del trafico |
| created_at | timestamptz | SI | Fecha de creacion |
| updated_at | timestamptz | SI | Ultima actualizacion |

**ENUM estado_solicitud:** pendiente | en_revision | aprobada | rechazada | documentos_enviados | documentos_aprobados | cita_programada | completada | cancelada (valores inferidos del codigo)

---

### 2.6 Tabla: adopciones

Registro formal de adopciones completadas o en proceso avanzado.

| Columna | Tipo | Nulo | Descripcion |
|---------|------|------|-------------|
| id | uuid | NO | PK |
| solicitud_id | uuid | NO | FK -> solicitudes_adopcion(id) |
| mascota_id | uuid | SI | FK -> mascotas(id) |
| adoptante_id | uuid | SI | FK -> perfiles(id) |
| numero_adopcion | varchar | NO | Numero unico de adopcion |
| fecha_adopcion | date | NO | CURRENT_DATE |
| admin_responsable | uuid | SI | FK -> perfiles(id) |
| estado | text | NO | pendiente/aprobada/rechazada |
| tipo_vivienda | text | SI | Tipo de vivienda del adoptante |
| espacio_disponible | text | SI | Descripcion del espacio |
| otras_mascotas | boolean | SI | Si tiene otras mascotas |
| detalle_otras_mascotas | text | SI | Detalle |
| evidencia_hogar_urls | ARRAY | SI | Fotos del hogar |
| compromiso_seguimiento | boolean | SI | Acepto seguimiento |
| compromiso_cuidado | boolean | SI | Acepto compromiso de cuidado |
| observaciones_usuario | text | SI | Notas del usuario |
| observaciones_admin | text | SI | Notas del admin |
| contrato_url | text | SI | URL del contrato firmado |
| seguimiento_programado | date | SI | Fecha del primer seguimiento |
| fecha_revision | timestamptz | SI | Fecha de revision |
| observaciones_legacy | text | SI | Datos migrados de sistema anterior |
| created_at | timestamptz | SI | Fecha de creacion |

---

### 2.7 Tabla: citas_adopcion

Citas para conocer a la mascota antes de adoptar.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| usuario_id | uuid | FK -> auth.users(id) |
| solicitud_id | uuid | FK -> solicitudes_adopcion(id) |
| mascota_id | uuid | FK -> mascotas(id) |
| fecha_cita | date | Fecha de la cita |
| hora_cita | time | Hora de la cita |
| estado | text | programada / completada / cancelada |
| asistencia | text | asistio / no_asistio_no_apto |
| interaccion | text | buena_aprobada / no_apta |
| nota | text | Notas del evaluador |
| creada_en | timestamptz | Fecha de creacion |
| actualizada_en | timestamptz | Ultima actualizacion |

---

### 2.8 Vista: citas_ocupadas

Vista derivada de `citas_adopcion` que muestra los slots ya reservados
para evitar doble reservacion.

| Columna | Tipo |
|---------|------|
| fecha_cita | date |
| hora_cita | time |
| estado | text |

---

### 2.9 Tabla: citas_adopcion_aprobadas

Tabla historica de citas que fueron completadas y aprobadas.
Funciona como registro inmutable de citas evaluadas positivamente.

---

### 2.10 Tabla: citas_veterinarias

Citas medicas para mascotas ya adoptadas.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| adopcion_id | uuid | FK -> adopciones(id) |
| fecha_cita | timestamptz | Fecha y hora de la cita |
| motivo | text | Motivo de la consulta |
| observaciones | text | Observaciones medicas |
| veterinario | text | Nombre del veterinario |
| ubicacion | text | Clinica / ubicacion |
| completada | boolean | Si la cita ya se realizo |
| evidencia_urls | ARRAY | Fotos de la consulta |
| estado | text | pendiente / aprobada / cancelada |
| created_at | timestamptz | Fecha de creacion |

---

### 2.11 Tabla: documentos

Documentos de identificacion del proceso de adopcion.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| perfil_id | uuid | FK -> perfiles(id) |
| tipo | text | Tipo de documento (INE, comprobante, etc.) |
| url | text | URL en bucket documentos_adopcion |
| status | text | pendiente / aprobado / rechazado |
| observacion_admin | text | Razon de rechazo si aplica |
| created_at | timestamptz | Fecha de subida |

---

### 2.12 Tabla: esterilizaciones

Programa de esterilizacion de animales.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| folio | text | Auto: EST-01000, EST-01001... |
| mascota_id | uuid | FK -> mascotas(id) |
| usuario_id | uuid | FK -> perfiles(id) |
| admin_responsable | uuid | FK -> perfiles(id) |
| peso_kg | numeric | Peso del animal |
| observaciones_previas | text | Notas pre-operatorias |
| fecha_solicitud | timestamptz | Cuando se solicito |
| fecha_programada | timestamptz | Cuando esta programada |
| fecha_realizada | timestamptz | Cuando se realizo |
| resultado_notas | text | Notas post-operatorias |
| complicaciones | text | Complicaciones si las hubo |
| motivo_cancelacion | text | Razon de cancelacion |
| estado | estado_esterilizacion | Ver ENUM en seccion anterior |
| actualizado_por | uuid | FK -> perfiles(id) |
| created_at | timestamptz | Fecha de creacion |
| updated_at | timestamptz | Ultima actualizacion |

---

### 2.13 Tabla: platicas_concientizacion

Solicitudes de platicas educativas.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| folio | text | Auto: PLA-01000, PLA-01001... |
| usuario_id | uuid | FK -> perfiles(id) |
| admin_responsable | uuid | FK -> perfiles(id) |
| nombre_solicitante | text | Nombre del solicitante |
| telefono_contacto | text | Telefono |
| tipo_lugar | tipo_lugar_platica | escuela/empresa/colonia/etc. |
| nombre_lugar | text | Nombre de la institucion |
| numero_personas | integer | Asistentes esperados (1-9999) |
| direccion | text | Direccion del evento |
| fecha_tentativa | date | Fecha propuesta |
| fecha_definitiva | timestamptz | Fecha confirmada por admin |
| comentarios | text | Notas del solicitante |
| observaciones_internas | text | Notas internas del admin |
| motivo_rechazo | text | Si fue rechazada |
| estado | estado_platica | Ver ENUM |
| actualizado_por | uuid | FK -> perfiles(id) |
| created_at | timestamptz | Fecha de creacion |
| updated_at | timestamptz | Ultima actualizacion |

---

### 2.14 Tabla: reportes_maltrato

Reportes de maltrato animal (publico y anonimo).

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| folio | text | Auto: REP-01000, REP-01001... |
| reportante_id | uuid | FK -> perfiles(id), NULL si anonimo |
| nombre_reportante | text | Nombre (NULL = anonimo) |
| telefono_contacto | text | Telefono de contacto |
| email_contacto | text | Email de contacto |
| es_anonimo | boolean | Si es reporte anonimo |
| asunto | text | Titulo del reporte |
| descripcion | text | Descripcion detallada |
| direccion_incidente | text | Donde ocurrio |
| colonia | text | Colonia |
| fecha_incidente | date | Fecha del incidente |
| gravedad | gravedad_reporte | baja/media/alta/critica |
| evidencias_urls | text[] | Fotos de evidencia |
| prioridad | prioridad_reporte | baja/normal/alta/urgente |
| asignado_a | uuid | FK -> perfiles(id) |
| notas_internas | text | Solo visibles para admin |
| resolucion | text | Descripcion de la resolucion |
| estado | estado_reporte_maltrato | Ver ENUM |
| actualizado_por | uuid | FK -> perfiles(id) |
| created_at | timestamptz | Fecha de creacion |
| updated_at | timestamptz | Ultima actualizacion |

---

### 2.15 Tabla: reportes_maltrato_bitacora

Historial automatico de cambios en reportes de maltrato.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| reporte_id | uuid | FK -> reportes_maltrato(id) ON DELETE CASCADE |
| autor_id | uuid | FK -> perfiles(id) |
| autor_nombre | text | Snapshot del nombre (por si se borra el perfil) |
| accion | text | Tipo: cambio_estado / comentario / asignacion |
| descripcion | text | Descripcion del cambio |
| estado_anterior | estado_reporte_maltrato | Estado previo |
| estado_nuevo | estado_reporte_maltrato | Estado nuevo |
| created_at | timestamptz | Fecha del cambio |

---

### 2.16 Tabla: seguimiento_adopcion

Registro detallado de seguimientos post-adopcion realizados.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| adopcion_id | uuid | FK -> adopciones(id) |
| realizado_por | uuid | FK -> perfiles(id) |
| fecha_seguimiento | date | Fecha del seguimiento |
| estado_mascota | USER-DEFINED | bueno/regular/malo (estado_salud) |
| satisfaccion_adoptante | integer | 1 a 5 |
| fotos_actuales | ARRAY | URLs de fotos |
| problemas_reportados | ARRAY | Problemas identificados |
| recomendaciones | text | Recomendaciones |
| observaciones | text | Notas adicionales |
| completado | boolean | Si el seguimiento esta completo |
| created_at | timestamptz | Fecha de registro |

---

### 2.17 Tabla: seguimientos

Programacion de fechas futuras de seguimiento.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| adopcion_id | uuid | FK -> adopciones(id) |
| fecha_programada | date | Fecha programada |
| realizada | boolean | Si ya se realizo |
| observaciones | text | Notas |
| created_at | timestamptz | Fecha de creacion |

---

### 2.18 Tabla: historial_medico

Historial completo de consultas veterinarias por mascota.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| mascota_id | uuid | FK -> mascotas(id) |
| created_by | uuid | FK -> perfiles(id) |
| fecha_consulta | date | Fecha de la consulta |
| tipo_consulta | USER-DEFINED | Tipo de atencion medica |
| veterinario | varchar | Nombre del veterinario |
| clinica_veterinaria | varchar | Nombre de la clinica |
| motivo_consulta | text | Razon de la visita |
| diagnostico | text | Diagnostico medico |
| tratamiento | text | Tratamiento indicado |
| medicamentos | jsonb | Array de medicamentos |
| examenes_realizados | ARRAY | Lista de examenes |
| resultados_examenes | jsonb | Resultados detallados |
| recomendaciones | text | Recomendaciones del veterinario |
| costo | numeric | Costo de la consulta |
| receta_url | text | URL de la receta |
| proxima_cita | date | Fecha de siguiente visita |
| observaciones | text | Notas adicionales |
| created_at | timestamptz | Fecha de registro |

---

### 2.19 Tabla: direcciones

Domicilios de los usuarios.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| usuario_id | uuid | FK -> perfiles(id) |
| calle | varchar | Nombre de la calle |
| numero_exterior | varchar | Numero exterior |
| numero_interior | varchar | Numero interior |
| colonia | varchar | Colonia |
| codigo_postal | varchar | Codigo postal |
| municipio | varchar | Municipio |
| estado | varchar | Estado de la republica |
| pais | varchar | Pais (default: Mexico) |
| tipo_vivienda | USER-DEFINED | ENUM tipo_vivienda |
| es_propia | boolean | Si la vivienda es propia |
| direccion_principal | boolean | Si es la direccion principal |
| created_at | timestamptz | Fecha de creacion |
| updated_at | timestamptz | Ultima actualizacion |

---

### 2.20 Tabla: auditoria

Log de cambios criticos en la base de datos.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| tabla | varchar | Nombre de la tabla afectada |
| registro_id | uuid | ID del registro afectado |
| accion | varchar | INSERT / UPDATE / DELETE |
| datos_anteriores | jsonb | Snapshot previo al cambio |
| datos_nuevos | jsonb | Snapshot posterior al cambio |
| usuario_id | uuid | FK -> perfiles(id) quien hizo el cambio |
| ip_address | inet | IP del origen del cambio |
| created_at | timestamptz | Fecha y hora del cambio |

---

### 2.21 Tabla: auth_tokens

Tokens de un solo uso para verificacion y reset de contrasena.

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK -> auth.users(id) |
| purpose | text | verify_email / password_reset |
| token_hash | text | Hash del token (UNICO) |
| expires_at | timestamptz | Expiracion |
| used_at | timestamptz | Cuando fue utilizado |
| ip_origin | inet | IP del solicitante |
| user_agent | text | User agent del navegador |
| created_at | timestamptz | Fecha de creacion |

---

### 2.22 Tablas de Better Auth (sistema secundario, no activo en flujo principal)

Las tablas `user`, `account`, `session`, `verification` pertenecen al schema
de Better Auth y no son utilizadas por el flujo principal del sistema,
que opera con Supabase Auth. Son tablas heredadas o de una integracion experimental.

---

## 3. Tipos ENUM Personalizados

| Tipo | Valores |
|------|---------|
| estado_mascota | disponible, en_proceso, adoptado, en_pausa |
| estado_esterilizacion | pendiente, aprobada, programada, en_quirofano, completada, complicacion, cancelada, rechazada |
| estado_platica | pendiente, en_revision, aprobada, rechazada, finalizada, cancelada |
| tipo_lugar_platica | escuela, empresa, colonia, dependencia, asociacion, otro |
| estado_reporte_maltrato | recibido, en_revision, en_investigacion, resuelto, cerrado, falso_positivo |
| gravedad_reporte | baja, media, alta, critica |
| prioridad_reporte | baja, normal, alta, urgente |
| estado_salud | bueno, regular, malo |
| tipo_vivienda | casa, departamento, otro |

---

## 4. Triggers de Base de Datos

### Trigger 1: esterilizaciones_set_updated_at
- **Tabla:** esterilizaciones
- **Evento:** BEFORE UPDATE
- **Accion:** Setea `updated_at = now()` automaticamente

### Trigger 2: esterilizaciones_marca_mascota
- **Tabla:** esterilizaciones
- **Evento:** AFTER INSERT OR UPDATE OF estado
- **Accion:** Cuando `estado = 'completada'`, actualiza `mascotas.esterilizado = true`
- **Funcion:** `on_esterilizacion_completada()`

### Trigger 3: reportes_set_updated_at
- **Tabla:** reportes_maltrato
- **Evento:** BEFORE UPDATE
- **Accion:** Setea `updated_at = now()` automaticamente

### Trigger 4: reportes_bitacora_estado
- **Tabla:** reportes_maltrato
- **Evento:** AFTER UPDATE OF estado
- **Accion:** Inserta automaticamente en `reportes_maltrato_bitacora` cada cambio de estado
- **Funcion:** `on_reporte_estado_cambia()`

---

## 5. Indices de Performance

| Tabla | Indices |
|-------|---------|
| esterilizaciones | estado, mascota_id, usuario_id, fecha_programada DESC, created_at DESC |
| reportes_maltrato | estado, gravedad, prioridad, reportante_id, created_at DESC |
| reportes_maltrato_bitacora | (reporte_id, created_at DESC) |

---

## 6. Row Level Security (RLS) por Tabla

Las politicas RLS garantizan que cada usuario solo vea y modifique los datos
que le corresponden, incluso si la query llega directamente a Supabase.

### Principio general

| Actor | Que puede hacer |
|-------|----------------|
| Admin (rol_id = 1) | SELECT + INSERT + UPDATE + DELETE en todas las tablas |
| Usuario (rol_id = 2) | Solo sus propios registros. INSERT limitado a creacion inicial |
| Anonimo (sin sesion) | Solo tablas y operaciones especificamente permitidas |

### RLS de esterilizaciones

- **admin_all:** Admin tiene acceso total (FOR ALL)
- **usuario_read:** Usuario lee sus esterilizaciones o las de sus mascotas adoptadas
- **usuario_insert:** Usuario crea solicitudes solo para mascotas donde es adoptante aprobado
- **usuario_cancela:** Usuario solo puede cambiar estado a "cancelada" mientras esta pendiente o aprobada

### RLS de reportes_maltrato

- **admin_all:** Admin tiene acceso total
- **publico_insert:** Cualquier visitante (anonimo o autenticado) puede crear reporte con estado inicial "recibido"
- **reportante_read:** Usuario autenticado ve solo sus reportes

### Storage RLS (bucket reportes-maltrato)

- **insert_publico:** Cualquier visitante puede subir evidencias
- **select_publico:** Cualquier visitante puede leer (bucket publico)
- **delete_admin:** Solo admin puede eliminar evidencias
