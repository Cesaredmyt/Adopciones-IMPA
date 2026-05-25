# 17 - Casos de Uso e Historias de Usuario

---

## Actores del Sistema

| Actor | Descripcion |
|-------|-------------|
| Visitante | Persona no registrada que accede a paginas publicas |
| Usuario / Adoptante | Persona registrada con rol_id = 2 |
| Administrador | Personal de IMPA con rol_id = 1 |
| Sistema | Automatizaciones internas (emails, triggers) |

---

## Casos de Uso por Modulo

### CU-AUTH: Autenticacion

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-AUTH-01 | Registrarse | Visitante | Crear cuenta con email y contrasena |
| CU-AUTH-02 | Verificar email | Usuario | Confirmar email via enlace |
| CU-AUTH-03 | Iniciar sesion | Usuario/Admin | Autenticarse en el sistema |
| CU-AUTH-04 | Cerrar sesion | Usuario/Admin | Terminar sesion activa |
| CU-AUTH-05 | Recuperar contrasena | Usuario/Admin | Restablecer contrasena via email |
| CU-AUTH-06 | Completar perfil | Usuario | Agregar datos personales y direccion |

### CU-MASC: Mascotas

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-MASC-01 | Ver catalogo de mascotas | Visitante/Usuario | Explorar mascotas disponibles |
| CU-MASC-02 | Ver ficha de mascota | Visitante/Usuario | Ver detalle de una mascota (via QR o URL) |
| CU-MASC-03 | Registrar mascota | Admin | Agregar nueva mascota al sistema |
| CU-MASC-04 | Editar mascota | Admin | Actualizar datos de una mascota |
| CU-MASC-05 | Eliminar mascota | Admin | Remover mascota del catalogo |
| CU-MASC-06 | Generar QR de mascota | Admin | Crear codigo QR de identificacion |
| CU-MASC-07 | Gestionar razas | Admin | CRUD de razas disponibles |

### CU-ADOP: Proceso de Adopcion

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-ADOP-01 | Solicitar adopcion | Usuario | Enviar solicitud para adoptar una mascota |
| CU-ADOP-02 | Ver estado de solicitud | Usuario | Consultar en que etapa esta su solicitud |
| CU-ADOP-03 | Cancelar solicitud | Usuario | Cancelar su solicitud antes de completarla |
| CU-ADOP-04 | Revisar solicitudes | Admin | Ver todas las solicitudes pendientes |
| CU-ADOP-05 | Aprobar solicitud | Admin | Aprobar solicitud y notificar al usuario |
| CU-ADOP-06 | Rechazar solicitud | Admin | Rechazar solicitud con motivo |
| CU-ADOP-07 | Subir documentos | Usuario | Cargar documentos de identificacion |
| CU-ADOP-08 | Revisar documentos | Admin | Aprobar o rechazar documentos |
| CU-ADOP-09 | Agendar cita de conocer mascota | Admin | Programar visita al refugio |
| CU-ADOP-10 | Evaluar cita | Admin | Registrar asistencia e interaccion |
| CU-ADOP-11 | Aprobar adopcion final | Admin | Confirmar adopcion exitosa |
| CU-ADOP-12 | Ver mis mascotas adoptadas | Usuario | Ver mascotas que ha adoptado |

### CU-CITA: Citas

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-CITA-01 | Ver disponibilidad de citas | Usuario | Consultar horarios disponibles |
| CU-CITA-02 | Solicitar cita de adopcion | Usuario | Pedir cita para conocer mascota |
| CU-CITA-03 | Cancelar cita | Usuario/Admin | Cancelar una cita programada |
| CU-CITA-04 | Gestionar calendario de citas | Admin | Ver y administrar todas las citas |
| CU-CITA-05 | Solicitar cita veterinaria | Usuario | Programar cita medica para mascota adoptada |
| CU-CITA-06 | Aprobar cita veterinaria | Admin | Confirmar cita veterinaria |
| CU-CITA-07 | Completar cita veterinaria | Admin | Marcar cita como realizada con evidencias |

### CU-ESTE: Esterilizaciones

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-ESTE-01 | Solicitar esterilizacion | Usuario | Pedir cirugia de esterilizacion para mascota |
| CU-ESTE-02 | Aprobar solicitud | Admin | Aprobar y programar esterilizacion |
| CU-ESTE-03 | Rechazar solicitud | Admin | Rechazar con motivo |
| CU-ESTE-04 | Programar fecha | Admin | Asignar fecha y hora definitiva |
| CU-ESTE-05 | Registrar cirugia completada | Admin | Marcar como exitosa (activa trigger) |
| CU-ESTE-06 | Cancelar esterilizacion | Usuario/Admin | Cancelar antes de la cirugia |

### CU-PLAT: Platicas de Concientizacion

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-PLAT-01 | Solicitar platica | Usuario | Pedir platica para una institucion |
| CU-PLAT-02 | Revisar y aprobar platica | Admin | Confirmar fecha y aprobar |
| CU-PLAT-03 | Rechazar solicitud | Admin | Rechazar con motivo |
| CU-PLAT-04 | Finalizar platica | Admin | Marcar platica como impartida |
| CU-PLAT-05 | Cancelar platica | Usuario/Admin | Cancelar antes de la fecha |

### CU-REPO: Reportes de Maltrato

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-REPO-01 | Reportar maltrato (anonimo) | Visitante | Enviar reporte sin identificarse |
| CU-REPO-02 | Reportar maltrato (autenticado) | Usuario | Enviar reporte vinculado a su cuenta |
| CU-REPO-03 | Consultar estado de reporte | Visitante/Usuario | Ver estado por folio + contacto |
| CU-REPO-04 | Ver todos los reportes | Admin | Lista de reportes con filtros |
| CU-REPO-05 | Atender reporte | Admin | Cambiar estado e investigar |
| CU-REPO-06 | Cerrar caso | Admin | Marcar como resuelto o cerrado |

### CU-SEGU: Seguimiento Post-Adopcion

| ID | Caso de Uso | Actor | Descripcion |
|----|-------------|-------|-------------|
| CU-SEGU-01 | Ver seguimientos de mi adopcion | Usuario | Consultar historial de visitas |
| CU-SEGU-02 | Registrar seguimiento | Admin | Documentar visita con fotos y evaluacion |
| CU-SEGU-03 | Ver seguimientos de todas las adopciones | Admin | Lista general de seguimientos |
| CU-SEGU-04 | Programar proxima visita | Admin | Agendar fecha de siguiente seguimiento |

---

## Historias de Usuario

### Autenticacion

**HU-01 — Registro de usuario**
Como visitante, quiero registrarme con mi email para poder acceder al sistema
y solicitar la adopcion de una mascota.
- Criterio: Puedo crear una cuenta con nombre completo, email y contrasena
- Criterio: Recibo un email de verificacion al registrarme
- Criterio: No puedo iniciar sesion hasta verificar mi email

**HU-02 — Inicio de sesion**
Como usuario registrado, quiero iniciar sesion para acceder a mi dashboard
y ver el estado de mis gestiones.
- Criterio: Al iniciar sesion soy redirigido a mi dashboard segun mi rol
- Criterio: Si olvide mi contrasena puedo recuperarla via email

---

### Mascotas

**HU-03 — Explorar mascotas disponibles**
Como visitante o usuario, quiero ver el catalogo de mascotas disponibles
para encontrar una que me interese adoptar.
- Criterio: Puedo ver fotos, nombre, raza y descripcion de cada mascota
- Criterio: El catalogo tiene scroll infinito para cargar mas mascotas
- Criterio: Puedo escanear el QR de una mascota para ver su ficha

**HU-04 — Registrar nueva mascota (admin)**
Como administrador, quiero registrar un nuevo animal al sistema para que
aparezca en el catalogo de adopciones.
- Criterio: Puedo subir una foto, definir nombre, raza, sexo, edad, colores
- Criterio: El sistema genera automaticamente un codigo QR para la mascota
- Criterio: La mascota aparece en el catalogo publico inmediatamente

---

### Adopcion

**HU-05 — Solicitar adopcion**
Como usuario, quiero solicitar la adopcion de una mascota que me gusto
para iniciar el proceso formal.
- Criterio: Puedo describir mi motivo de adopcion, experiencia y situacion
- Criterio: Recibo confirmacion por email con el numero de solicitud
- Criterio: Puedo ver el estado de mi solicitud en mi dashboard

**HU-06 — Aprobar o rechazar solicitud (admin)**
Como administrador, quiero revisar las solicitudes pendientes para
aprobar o rechazar segun los criterios de IMPA.
- Criterio: Veo todas las solicitudes en una tabla con filtros
- Criterio: Al aprobar, el usuario recibe email con instrucciones
- Criterio: Al rechazar, indico el motivo y el usuario es notificado

**HU-07 — Ver mis mascotas adoptadas**
Como usuario que ha completado una adopcion, quiero ver mis mascotas
adoptadas para gestionar sus citas y seguimiento.
- Criterio: Veo una tarjeta de cada mascota adoptada con foto y datos
- Criterio: Desde la tarjeta puedo acceder a citas vet, esterilizaciones y seguimiento

---

### Reportes

**HU-08 — Reportar maltrato anonimamente**
Como ciudadano preocupado, quiero reportar un caso de maltrato animal
sin necesidad de registrarme, para proteger mi identidad.
- Criterio: El formulario no requiere sesion ni registro
- Criterio: Puedo subir fotos como evidencia
- Criterio: Recibo un folio para dar seguimiento a mi reporte
- Criterio: Puedo consultar el estado de mi reporte con el folio y mi contacto

**HU-09 — Atender reporte (admin)**
Como administrador, quiero ver los reportes de maltrato y gestionarlos
para darles seguimiento y resolver los casos.
- Criterio: Veo todos los reportes ordenados por gravedad y prioridad
- Criterio: Cada cambio de estado queda registrado en la bitacora
- Criterio: El reportante recibe email cuando el estado cambia
