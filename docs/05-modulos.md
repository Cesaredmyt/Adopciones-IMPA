# 05 - Modulos Funcionales

---

## Resumen de Modulos

El sistema esta compuesto por **12 modulos funcionales** principales, organizados
como features independientes en `src/features/`.

| Modulo | Feature | Usuarios que lo usan |
|--------|---------|---------------------|
| Dashboard Admin | admin | Administrador |
| Mascotas | mascotas | Admin + Usuario (lectura) |
| Solicitudes de Adopcion | solicitudes | Admin + Usuario |
| Proceso de Adopcion | adopciones | Admin + Usuario |
| Citas de Adopcion | citas | Admin + Usuario |
| Citas Veterinarias | citas | Admin + Usuario |
| Documentos | documentos | Admin + Usuario |
| Esterilizaciones | esterilizaciones | Admin + Usuario |
| Platicas de Concientizacion | platicas | Admin + Usuario |
| Reportes de Maltrato | reportes-maltrato | Admin + Publico |
| Seguimiento Post-Adopcion | seguimiento | Admin + Usuario |
| Gestion de Usuarios | usuarios | Solo Admin |

---

## Modulo 1: Dashboard Administrador

**Feature:** `src/features/admin/`

El dashboard del administrador es la vista central de gestion del sistema.
Muestra estadisticas en tiempo real y actividad reciente.

### Componentes principales

| Componente | Descripcion |
|-----------|-------------|
| StatCard | Tarjeta de estadistica con numero, titulo y navegacion |
| StatsGrid | Cuadricula de todas las estadisticas del sistema |
| ActivityList | Lista de actividad reciente del sistema |
| ActivityItem | Item individual de actividad |
| ActivityFilters | Filtros de la lista de actividad |
| PendientesList | Lista de solicitudes/citas pendientes |
| DashboardSkeleton | Estado de carga del dashboard |

### Estadisticas en tiempo real

Las estadisticas se actualizan automaticamente via Supabase Realtime.
El hook `useDashboardRealtime` escucha cambios en las siguientes tablas:

- mascotas
- citas_adopcion
- citas_veterinarias
- perfiles
- documentos
- esterilizaciones

Cuando cualquiera de estas tablas cambia, TanStack Query invalida la cache
de estadisticas y refetch automaticamente los datos actualizados.

### Hooks del modulo

| Hook | Descripcion |
|------|-------------|
| useDashboardStats | Obtiene estadisticas generales del sistema |
| useDashboardRealtime | Subscripcion Realtime para invalidar cache |
| useActividadReciente | Actividad reciente del sistema |
| useActividadRealtime | Realtime para lista de actividad |
| useUsuarioNombre | Nombre del administrador autenticado |

---

## Modulo 2: Mascotas

**Feature:** `src/features/mascotas/`

Gestion completa del catalogo de animales del refugio.

### Funcionalidades

- **Registro de mascota:** nombre, especie, raza, edad, sexo, peso, colores (array JSON), descripcion fisica, estado de esterilizacion, fecha de ingreso, lugar de rescate, condicion de ingreso
- **Imagenes:** Subida de foto principal al bucket `mascotas-imagenes`
- **Codigo QR:** Generacion automatica de QR unico por mascota, almacenado en bucket `mascotas-qr`. El QR apunta a la URL publica `/mascota/[id]`
- **Razas:** Catalogo separado de razas con tamano y especie, gestionado desde el panel admin
- **Estados de mascota:** disponible | en_proceso | adoptado | en_pausa

### Estados de la Mascota

| Estado | Descripcion |
|--------|-------------|
| disponible | Disponible para adopcion |
| en_proceso | Tiene una solicitud de adopcion activa |
| adoptado | Ha sido adoptado exitosamente |
| en_pausa | Temporalmente no disponible para adopcion |

### Componentes principales

| Componente | Descripcion |
|-----------|-------------|
| MascotaCard | Tarjeta de presentacion con foto, nombre, raza, edad |
| MascotasFeed | Feed paginado con scroll infinito del catalogo |
| MascotasTable | Tabla de gestion para el admin |
| FormMascota | Formulario completo de registro/edicion |
| MascotaInfoModal | Modal de informacion detallada |
| MisMascotasCard | Tarjeta de mascota adoptada del usuario |
| SelectorColores | Selector multiple de colores de pelaje |

### Hooks del modulo

| Hook | Descripcion |
|------|-------------|
| useMascotasInfiniteQuery | Catalogo con infinite scroll |
| useMascotaQuery | Datos de una mascota especifica |
| useCreateMascota | Server Action para crear mascota |
| useUpdateMascota | Server Action para actualizar mascota |
| useDeleteMascota | Server Action para eliminar mascota |

---

## Modulo 3: Proceso de Adopcion

**Feature:** `src/features/adopciones/`

El flujo de adopcion es el modulo mas complejo del sistema. Involucra multiples etapas,
actores y notificaciones de email.

### Flujo Completo del Proceso

```
USUARIO                              ADMIN
   |                                    |
   | 1. Solicitar adopcion              |
   |    (motivo, experiencia, etc.)     |
   |-------------------------------->   |
   |                                    | 2. Revisar solicitud
   |                                    |    Aprobar o Rechazar
   |                                    |
   | 3. Si aprobada:                    |
   |    Subir documentos                |
   |    (INE, comprobante domicilio)    |
   |-------------------------------->   |
   |                                    | 4. Revisar documentos
   |                                    |    Aprobar o Rechazar
   |                                    |
   |                                    | 5. Agendar cita conocer mascota
   |   <-------------------------------  |
   |                                    |
   | 6. Asistir a la cita               |
   |                                    | 7. Evaluar cita:
   |                                    |    asistio + interaccion buena?
   |                                    |    -> Aprobar adopcion
   |                                    |    -> Rechazar adopcion
   |                                    |
   |   <-------------------------------  | 8. Email: adopcion aprobada/rechazada
   |                                    |
   | 9. Adopcion completada             |
   |    Mascota pasa a "adoptado"       |
   |                                    |
   | 10. Seguimiento programado         |
   |    (fechas futuras)                |
```

### Estados de la Solicitud de Adopcion

| Estado | Descripcion |
|--------|-------------|
| pendiente | Solicitud creada, sin revisar |
| en_revision | Admin esta evaluando |
| aprobada | Admin aprobo, esperando documentos |
| rechazada | Admin rechazo |
| documentos_enviados | Usuario subio sus documentos |
| documentos_aprobados | Admin aprobo documentos, cita pendiente |
| cita_programada | Cita agendada |
| completada | Proceso finalizado exitosamente |
| cancelada | Cancelada por el usuario |

### Estados de la Adopcion (tabla adopciones)

| Estado | Descripcion |
|--------|-------------|
| pendiente | Adopcion registrada, sin revision final |
| aprobada | Adopcion aprobada, mascota asignada al adoptante |
| rechazada | Adopcion rechazada en etapa final |

### Componentes del Stepper

El proceso de adopcion usa un componente Stepper para guiar al usuario:

1. Solicitud de adopcion
2. Subida de documentos
3. Cita de conocer mascota
4. Aprobacion/Rechazo
5. Seguimiento

---

## Modulo 4: Citas

**Feature:** `src/features/citas/`

El modulo mas grande del sistema con 77 archivos. Gestiona dos tipos de citas:

### 4.1 Citas de Adopcion

Citas para que el usuario conozca la mascota antes de concretar la adopcion.

**Estados:** programada | completada | cancelada

**Evaluacion de cita (solo admin):**
- asistencia: asistio | no_asistio_no_apto
- interaccion: buena_aprobada | no_apta

**Vista especial:** `citas_ocupadas` (vista de BD) muestra los slots ya reservados
para evitar doble reservacion en el calendario.

### 4.2 Citas Veterinarias

Citas medicas para mascotas ya adoptadas.

**Estados:** pendiente | aprobada | cancelada
**Flag:** completada (boolean) cuando la cita ya se realizo.

**Campos adicionales:** veterinario, ubicacion, evidencia_urls (array de fotos)

### Hooks del modulo (principales)

| Hook | Descripcion |
|------|-------------|
| useCitas | Lista de citas del usuario o todas (admin) |
| useAgendarCitaFlow | Flujo completo de agendamiento |
| useCalendarioCitaVeterinaria | Datos para el calendario de citas vet |
| useCancelarCita | Cancelacion de cita |
| useEvaluarCita | Evaluacion de cita (admin) |
| useHorasOcupadasQuery | Slots ocupados del calendario |

---

## Modulo 5: Documentos

**Feature:** `src/features/documentos/`

Gestion de documentos del proceso de adopcion.

### Tipos de documentos

Los documentos son archivos (PDF, imagen) que el usuario sube para validar su
identidad y situacion de vivienda. El admin los revisa y aprueba o rechaza.

**Bucket:** `documentos_adopcion` (Supabase Storage, publico)

**Estados:** pendiente | aprobado | rechazado

### Componentes

| Componente | Descripcion |
|-----------|-------------|
| DocumentosTable | Tabla de documentos (admin) |
| DocumentosFilters | Filtros por tipo y estado |
| VisorDocumento | Visualizador de documento |
| ModalRechazo | Modal para indicar motivo de rechazo |

---

## Modulo 6: Esterilizaciones

**Feature:** `src/features/esterilizaciones/`

Programa de esterilizacion de mascotas (antes y despues de la adopcion).

### Estados (ENUM estado_esterilizacion)

| Estado | Descripcion |
|--------|-------------|
| pendiente | Solicitud creada por usuario |
| aprobada | Admin aprobo, pendiente de fecha |
| programada | Fecha y hora confirmadas |
| en_quirofano | Cirugia en curso |
| completada | Cirugia exitosa. Trigger actualiza mascotas.esterilizado = true |
| complicacion | Finalizada con eventos adversos |
| cancelada | Cancelada antes de operar |
| rechazada | Admin no aprobo |

### Automatizacion via Trigger

Cuando una esterilizacion pasa a estado "completada", un trigger de PostgreSQL
actualiza automaticamente el campo `mascotas.esterilizado = true`.

**Folio:** Auto-generado con secuencia: EST-01000, EST-01001, ...

---

## Modulo 7: Platicas de Concientizacion

**Feature:** `src/features/platicas/`

Solicitudes de platicas educativas sobre bienestar animal en instituciones.

### Estados (ENUM estado_platica)

| Estado | Descripcion |
|--------|-------------|
| pendiente | Solicitud creada por usuario |
| en_revision | Admin evaluando |
| aprobada | Aprobada con fecha definitiva |
| rechazada | Rechazada por admin |
| finalizada | Platica ya impartida |
| cancelada | Cancelada por usuario o admin |

### Tipos de lugar (ENUM tipo_lugar_platica)

escuela | empresa | colonia | dependencia | asociacion | otro

**Folio:** Auto-generado: PLA-01000, PLA-01001, ...

---

## Modulo 8: Reportes de Maltrato Animal

**Feature:** `src/features/reportes-maltrato/`

Canal publico para reportar casos de maltrato animal. Funciona con y sin sesion.

### Acceso Publico

El formulario `/reportar-maltrato` es completamente publico. No requiere sesion.
Los campos de identidad del reportante son opcionales para permitir reportes anonimos.

### Estados (ENUM estado_reporte_maltrato)

| Estado | Descripcion |
|--------|-------------|
| recibido | Reporte creado |
| en_revision | Admin clasificando |
| en_investigacion | Caso activo en campo |
| resuelto | Caso atendido positivamente |
| cerrado | Cerrado (no procedia, duplicado) |
| falso_positivo | Denuncia infundada |

### Gravedad: baja | media | alta | critica
### Prioridad: baja | normal | alta | urgente

### Bitacora Automatica

Cada cambio de estado en `reportes_maltrato` dispara un trigger que inserta
automaticamente un registro en `reportes_maltrato_bitacora`.

### Seguimiento Publico

Cualquier persona con el folio del reporte puede consultar su estado en
`/reportar-maltrato/seguimiento` sin necesidad de sesion.
La validacion se hace server-side con folio + email/telefono de contacto.

**Folio:** Auto-generado: REP-01000, REP-01001, ...

---

## Modulo 9: Seguimiento Post-Adopcion

**Feature:** `src/features/seguimiento/`

Sistema de verificacion del bienestar del animal despues de la adopcion.

### Tipos de Seguimiento

El sistema tiene dos tablas relacionadas:

1. **seguimientos** — Programacion de fechas de seguimiento futuras
2. **seguimiento_adopcion** — Registro detallado de un seguimiento realizado

### Datos del seguimiento

| Campo | Descripcion |
|-------|-------------|
| estado_mascota | bueno | regular | malo (ENUM estado_salud) |
| satisfaccion_adoptante | 1 a 5 (escala de satisfaccion) |
| fotos_actuales | Array de URLs de fotos del animal en su nuevo hogar |
| problemas_reportados | Array de problemas identificados |
| recomendaciones | Texto con recomendaciones del seguidor |
| observaciones | Notas adicionales |

---

## Modulo 10: Perfil de Usuario

**Feature:** `src/features/perfil/`

Gestion del perfil personal del usuario registrado.

### Datos del Perfil

- Informacion personal: nombres, apellidos, CURP, telefono, fecha de nacimiento, ocupacion
- Avatar: foto de perfil
- Direccion: calle, colonia, municipio, estado, codigo postal, tipo de vivienda
- Documentos: documentos de identificacion subidos
- Solicitudes: historial de solicitudes de adopcion

### Componentes

| Componente | Descripcion |
|-----------|-------------|
| PerfilCard | Tarjeta principal con foto y datos basicos |
| PerfilDatosCard | Datos personales editables |
| PerfilDireccionCard | Direccion y tipo de vivienda |
| PerfilDocumentosCard | Documentos subidos |
| PerfilMascotasCard | Mascotas adoptadas |
| PerfilSolicitudesCard | Historial de solicitudes |

---

## Modulo 11: Gestion de Usuarios (Admin)

**Feature:** `src/features/usuarios/`

Panel de administracion de todos los usuarios registrados en el sistema.

### Funcionalidades Admin

- Ver listado completo de usuarios con filtros
- Ver detalle de usuario y su historial
- Activar / desactivar usuarios
- Ver si un usuario tiene proceso de adopcion activo
- Asignar/cambiar roles (si se habilita en el futuro)

### Componentes

| Componente | Descripcion |
|-----------|-------------|
| UserTable | Tabla paginada de usuarios |
| UserFilters | Filtros por nombre, email, rol, estado |
| UserModal | Modal de detalle y edicion de usuario |
| AdopcionEnProgresoOverlay | Overlay si el usuario tiene adopcion activa |

---

## Modulo 12: Historial Medico

**Tabla:** `historial_medico`

Registro del historial medico de cada mascota (consultas, diagnosticos, tratamientos).

### Tipos de consulta

Gestionado via ENUM `tipo_consulta`. Ejemplos: consulta_general, vacunacion,
cirugia, urgencias, control, desparasitacion.

### Datos por consulta

- veterinario, clinica_veterinaria
- motivo, diagnostico, tratamiento
- medicamentos (JSONB: array de objetos)
- examenes_realizados (array), resultados_examenes (JSONB)
- costo, receta_url, proxima_cita
- observaciones
