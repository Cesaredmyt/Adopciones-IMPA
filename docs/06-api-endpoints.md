# 06 - API Endpoints

---

## Descripcion General

El sistema expone **37+ endpoints** bajo el prefijo `/api/`.
Todos los endpoints son internos (no hay API publica documentada externamente).
Los endpoints de email y autenticacion son los mas numerosos.

Los endpoints de email son llamados desde Server Actions o Client Components
y requieren el header `x-internal-secret` con el valor de `INTERNAL_API_SECRET`.

---

## 1. Endpoints de Autenticacion (`/api/auth/`)

| Metodo | Endpoint | Descripcion | Auth requerida |
|--------|----------|-------------|----------------|
| GET | /api/auth/check-email | Verifica si un email ya esta registrado | No |
| POST | /api/auth/login | Inicia sesion, setea cookies y rol | No |
| POST | /api/auth/logout | Cierra sesion, borra cookies server-side | Si (sesion) |
| POST | /api/auth/register | Registra nuevo usuario + crea perfil | No |
| POST | /api/auth/resend-verification | Reenviar email de verificacion | No |
| POST | /api/auth/reset-password | Solicitar reset de contrasena | No |
| POST | /api/auth/reset/confirm | Confirmar nueva contrasena con token | No |
| GET | /api/auth/verify | Verificar email con token | No |

### Detalle: POST /api/auth/login

**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response exitosa:**
```json
{
  "redirectUrl": "/dashboards/administrador" | "/dashboards/usuario"
}
```

**Cookies seteadas:** session JWT de Supabase + `impa-role` (1 o 2)

---

## 2. Endpoints de Documentos (`/api/documentos/`)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET/DELETE | /api/documentos/[id] | Obtener o eliminar un documento |
| POST | /api/documentos/subir | Subir documento al bucket documentos_adopcion |

---

## 3. Endpoint de Donaciones (`/api/donaciones/`)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /api/donaciones/webhook | Webhook de MercadoPago para procesar pagos |

---

## 4. Endpoints de Email (`/api/email/`)

Cada evento del sistema tiene su propio endpoint de email.
Todos los endpoints de email son POST y requieren autenticacion interna.

### Emails del Proceso de Adopcion

| Endpoint | Trigger | Destinatario |
|----------|---------|-------------|
| /api/email/adopcion-aprobada | Admin aprueba adopcion | Usuario adoptante |
| /api/email/adopcion-rechazada | Admin rechaza adopcion | Usuario adoptante |
| /api/email/documento | Admin revisa documentos | Usuario |

### Emails de Citas de Adopcion

| Endpoint | Trigger | Destinatario |
|----------|---------|-------------|
| /api/email/cita | Admin agenda cita de adopcion | Usuario |
| /api/email/cita-cancelada | Cita cancelada | Usuario |
| /api/email/citaVeterinaria | Admin programa cita vet | Usuario |
| /api/email/cita-veterinaria-aprobada | Cita vet aprobada | Usuario |
| /api/email/cita-veterinaria-cancelada | Cita vet cancelada | Usuario |

### Emails de Esterilizacion

| Endpoint | Trigger | Destinatario |
|----------|---------|-------------|
| /api/email/esterilizacion-solicitada | Usuario crea solicitud | Usuario (confirmacion) |
| /api/email/esterilizacion-aprobada | Admin aprueba | Usuario |
| /api/email/esterilizacion-rechazada | Admin rechaza | Usuario |
| /api/email/esterilizacion-programada | Admin programa fecha | Usuario |
| /api/email/esterilizacion-completada | Cirugia completada | Usuario |
| /api/email/esterilizacion-cancelada | Esterilizacion cancelada | Usuario |

### Emails de Platicas

| Endpoint | Trigger | Destinatario |
|----------|---------|-------------|
| /api/email/platica-solicitada | Usuario crea solicitud | Usuario (confirmacion) |
| /api/email/platica-aprobada | Admin aprueba | Usuario |
| /api/email/platica-rechazada | Admin rechaza | Usuario |
| /api/email/platica-finalizada | Platica realizada | Usuario |

### Emails de Reportes de Maltrato

| Endpoint | Trigger | Destinatario |
|----------|---------|-------------|
| /api/email/reporte-recibido | Reporte creado | Reportante (si tiene email) |
| /api/email/reporte-en-investigacion | Estado cambia | Reportante |
| /api/email/reporte-resuelto | Caso resuelto | Reportante |
| /api/email/reporte-falso-positivo | Marcado falso | Reportante |

### Emails de Sistema

| Endpoint | Trigger | Destinatario |
|----------|---------|-------------|
| /api/email/registro | Nuevo usuario registrado | Usuario (bienvenida) |
| /api/email/reenviar | Reenvio manual de email | Usuario |
| /api/email/send | Endpoint generico de envio | Variable |

---

## 5. Plantillas de Email (`/api/email/templates/`)

Cada template es un archivo TypeScript que exporta una funcion que recibe
parametros y devuelve el HTML del email.

| Template | Descripcion |
|---------|-------------|
| _layout.ts | Layout base con header IMPA y footer |
| sendEmail.ts | Utilidad central de envio (Nodemailer/Resend) |
| adopcionAprobada.ts | Email de adopcion aprobada |
| adopcionRechazada.ts | Email de adopcion rechazada |
| citaAdopcion.ts | Email de cita de adopcion agendada |
| citaConocerMascota.ts | Email de cita para conocer mascota |
| citaVeterinaria.ts | Email de cita veterinaria programada |
| citaVeterinariaCancelada.ts | Email de cita vet cancelada |
| documentacionAprobada.ts | Email de documentos aprobados |
| documentacionRechazada.ts | Email de documentos rechazados |
| esterilizacionAprobada.ts | Email de esterilizacion aprobada |
| esterilizacionCancelada.ts | Email de esterilizacion cancelada |
| esterilizacionCompletada.ts | Email de esterilizacion completada |
| esterilizacionProgramada.ts | Email de esterilizacion programada |
| esterilizacionSolicitada.ts | Email de confirmacion de solicitud |
| platicaAprobada.ts | Email de platica aprobada |
| platicaFinalizada.ts | Email de platica finalizada |
| platicaRechazada.ts | Email de platica rechazada |
| platicaSolicitada.ts | Email de confirmacion de solicitud |
| recordatorioCita.ts | Email de recordatorio de cita |
| reporteEnInvestigacion.ts | Email de reporte en investigacion |
| reporteFalsoPositivo.ts | Email de falso positivo |
| reporteRecibido.ts | Email de reporte recibido |
| reporteResuelto.ts | Email de reporte resuelto |
| resetPassword.ts | Email de recuperacion de contrasena |

---

## 6. Supabase Edge Function

**Path:** `supabase/functions/send-email/index.ts`
**Runtime:** Deno v2

Endpoint adicional de envio de email via EmailJS.
Funciona como alternativa a los endpoints de API Routes.

**Nota:** Esta funcion usa credenciales hardcodeadas en el codigo fuente.
Ver seccion de Riesgos Tecnicos para mas detalles.
