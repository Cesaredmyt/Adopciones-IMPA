# 09 - Emails Automaticos y Certificados

---

## 1. Sistema de Email

El sistema tiene dos capas de envio de email:

### Capa 1: Nodemailer (SMTP Gmail) — Emails del sistema

Usado para todos los emails del flujo del sistema: confirmaciones, notificaciones,
alertas de estado. Configurado con una cuenta institucional de Gmail.

**Configuracion:**
- Proveedor: Gmail SMTP
- Cuenta institucional: info.impamorelia@gmail.com
- Variables necesarias: EMAIL_USER, EMAIL_PASS (App Password), EMAIL_FROM

### Capa 2: Resend API — Emails transaccionales

Resend es un proveedor moderno de email transaccional.
Se configura con `RESEND_API_KEY`.

### Flujo de envio

```
Evento del sistema (adopcion aprobada, cita agendada, etc.)
  |
  v
Server Action o API Route interna
  |
  +-- Construye parametros del email
  |
  v
POST /api/email/[tipo-evento]
  |
  +-- Valida INTERNAL_API_SECRET
  |
  v
Selecciona template correspondiente
  |
  v
Template genera HTML con datos del evento
  |
  v
sendEmail() -> Nodemailer/Resend -> Correo entregado
```

---

## 2. Templates de Email

Todos los templates estan en `src/app/api/email/templates/`.

### Layout Base (_layout.ts)

Todos los emails usan el mismo layout base con:
- Header con logo de IMPA
- Contenido dinamico
- Footer con datos de contacto de IMPA Morelia

### Catalogo de Emails Automaticos

#### Autenticacion y Cuenta

| Email | Trigger | Destinatario |
|-------|---------|-------------|
| Bienvenida / Registro | Nuevo usuario registrado | Nuevo usuario |
| Verificacion de email | Al registrarse | Nuevo usuario |
| Recuperacion de contrasena | Solicita reset | Usuario |

#### Proceso de Adopcion

| Email | Trigger | Datos incluidos |
|-------|---------|----------------|
| Solicitud recibida | Usuario envia solicitud | Nombre mascota, folio solicitud |
| Adopcion aprobada | Admin aprueba adopcion | Nombre mascota, fecha, instrucciones |
| Adopcion rechazada | Admin rechaza | Motivo de rechazo |
| Documentos recibidos | Usuario sube documentos | Confirmacion |
| Documentos aprobados | Admin aprueba docs | Siguiente paso |
| Documentos rechazados | Admin rechaza docs | Motivo de rechazo |

#### Citas de Adopcion

| Email | Trigger | Datos incluidos |
|-------|---------|----------------|
| Cita agendada | Admin agenda cita | Fecha, hora, lugar |
| Recordatorio de cita | Dia anterior o mismo dia | Fecha, hora, lugar |
| Cita cancelada | Cita cancelada | Razon |

#### Citas Veterinarias

| Email | Trigger | Datos incluidos |
|-------|---------|----------------|
| Cita veterinaria programada | Admin crea cita vet | Fecha, hora, veterinario, ubicacion |
| Cita vet aprobada | Estado cambia a aprobada | Confirmacion |
| Cita vet cancelada | Cita cancelada | Razon |

#### Esterilizaciones

| Email | Trigger | Datos incluidos |
|-------|---------|----------------|
| Solicitud de esterilizacion | Usuario solicita | Nombre mascota, folio EST- |
| Esterilizacion aprobada | Admin aprueba | Instrucciones previas |
| Esterilizacion rechazada | Admin rechaza | Motivo |
| Esterilizacion programada | Admin asigna fecha | Fecha, instrucciones |
| Esterilizacion completada | Cirugia completada | Resultados, cuidados post-op |
| Esterilizacion cancelada | Cancelada | Razon |

#### Platicas de Concientizacion

| Email | Trigger | Datos incluidos |
|-------|---------|----------------|
| Platica solicitada | Usuario solicita | Folio PLA-, fecha tentativa |
| Platica aprobada | Admin aprueba | Fecha definitiva |
| Platica rechazada | Admin rechaza | Motivo |
| Platica finalizada | Platica realizada | Agradecimiento |

#### Reportes de Maltrato

| Email | Trigger | Destinatario | Datos |
|-------|---------|-------------|-------|
| Reporte recibido | Reporte creado | Reportante (si tiene email) | Folio REP-, instrucciones |
| En investigacion | Estado cambia | Reportante | Actualizacion |
| Resuelto | Caso resuelto | Reportante | Descripcion resolucion |
| Falso positivo | Marcado como falso | Reportante | Explicacion |

---

## 3. Autenticacion de Emails Internos

Los endpoints `/api/email/*` estan protegidos con un secreto interno.
Las llamadas que no incluyan el header correcto son rechazadas con 401.

**Header requerido:** `x-internal-secret: [INTERNAL_API_SECRET]`

**Archivo:** `src/lib/email/internalAuth.ts`

---

## 4. Sanitizacion HTML

El contenido dinamico que se inserta en los emails es sanitizado para prevenir
inyeccion de HTML malicioso.

**Archivo:** `src/lib/email/safeHtml.ts`

---

## 5. Certificados PDF

### Generacion de Certificados

El sistema puede generar certificados PDF para adopciones completadas.

**Tecnologia:** `@react-pdf/renderer` v4.3.x
**Componente:** `src/components/certificados/CertificadoPDF.tsx`
**Modal:** `src/components/certificados/CertificadoModal.tsx`

### Contenido del Certificado

El certificado de adopcion incluye tipicamente:
- Nombre y datos del adoptante
- Nombre, foto y datos de la mascota
- Numero de adopcion
- Fecha de adopcion
- Firma/sello de IMPA
- Compromisos de cuidado

### Flujo de Generacion

```
1. Admin o usuario abre CertificadoModal
2. Se renderiza CertificadoPDF con datos de la adopcion
3. @react-pdf/renderer genera el PDF en el navegador
4. El usuario puede descargar el PDF
```

---

## 6. Codigos QR de Mascotas

### Generacion

**Tecnologia:** libreria `qrcode` v1.5.x
**Archivo:** `src/features/mascotas/utils/`

### Proceso

```
1. Se crea o actualiza una mascota
2. Se genera el QR con la URL: http(s)://[dominio]/mascota/[mascota.id]
3. El QR se renderiza como imagen PNG en memoria
4. Se sube al bucket mascotas-qr como [mascota_id].png
5. La URL del QR se guarda en mascotas.qr_code
```

### Uso del QR

El codigo QR puede imprimirse en una placa o tarjeta fisica del animal.
Al escanear, dirige a la ficha publica del animal en `/mascota/[id]`.
Esta ficha es accesible sin sesion (ALWAYS_PUBLIC en middleware).
