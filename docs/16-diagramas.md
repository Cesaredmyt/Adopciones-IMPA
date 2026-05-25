# 16 - Diagramas

---

## 1. Diagrama de Arquitectura General

```
+----------------------------------------------------------+
|                  NAVEGADOR (Browser)                      |
|                                                            |
|  React 19 + TailwindCSS v4                                |
|  TanStack Query (estado del servidor)                     |
|  React Hook Form + Zod (formularios)                      |
|  Sonner (notificaciones)                                   |
+-------------------------+--------------------------------+
                          |
              HTTP / WebSocket (Realtime)
                          |
+-------------------------v--------------------------------+
|                NEXT.JS 15 (Servidor)                      |
|                                                            |
|  App Router                                               |
|  +------------------+ +---------------------------+      |
|  | Server Components | | API Routes (/api/*)       |      |
|  | Server Actions    | | auth, email, documentos   |      |
|  +------------------+ +---------------------------+      |
|                                                            |
|  Middleware (JWT + cookies + rol)                         |
|  requireRole() / requireSession() (server guards)         |
|  Rate Limiting (Upstash Redis)                            |
+----+---------------------------+--------------------------+
     |                           |
     | Supabase Client           | Nodemailer / Resend
     |                           |
+----v-------------------+   +---v--------------------------+
|      SUPABASE          |   |    EMAIL PROVIDERS           |
|                        |   |                              |
| PostgreSQL 17          |   | Gmail SMTP (Nodemailer)      |
| Supabase Auth (JWT)    |   | Resend API                   |
| Storage (7 buckets)    |   +------------------------------+
| Realtime (WebSocket)   |
| Row Level Security     |
| Edge Functions         |
+------------------------+
```

---

## 2. Diagrama de Flujo de Autenticacion

```
Usuario                  Next.js Server              Supabase Auth
   |                           |                           |
   | POST /api/auth/login       |                           |
   | { email, password }        |                           |
   |-------------------------> |                           |
   |                           | signInWithPassword()      |
   |                           |-------------------------> |
   |                           | <--- JWT session          |
   |                           |                           |
   |                           | SELECT rol_id FROM        |
   |                           | perfiles WHERE id=user.id |
   |                           |-------------------------> |
   |                           | <--- rol_id               |
   |                           |                           |
   |                           | Set-Cookie: sb-session    |
   |                           | Set-Cookie: impa-role=1   |
   |                           |                           |
   | <-- { redirectUrl }       |                           |
   |                           |                           |
   | GET /dashboards/admin      |                           |
   |-------------------------> |                           |
   |                           | middleware.ts             |
   |                           | createServerClient()      |
   |                           | supabase.auth.getUser()   |
   |                           |-------------------------> |
   |                           | <--- user valid           |
   |                           | cookies.get(impa-role)=1  |
   |                           | matchPath(ADMIN_PATHS) OK |
   |                           |                           |
   |                           | layout.tsx                |
   |                           | requireRole({allow:[1]})  |
   |                           | (segunda validacion)      |
   |                           |                           |
   | <-- HTML del dashboard    |                           |
```

---

## 3. Diagrama del Proceso de Adopcion

```
USUARIO                         ADMIN
   |                               |
[1] Solicita adopcion              |
    POST motivo, experiencia, etc. |
   |-----------------------------> |
   |                               |
   |            [2] Admin revisa solicitud
   |            Estado: en_revision
   |                               |
   |   Email: solicitud recibida   |
   |<--------------------------    |
   |                               |
   |            [3a] APROBADA      |
   |            Estado: aprobada   |
   |   Email: solicitud aprobada   |
   |<--------------------------    |
   |                               |
[4] Sube documentos (INE, etc.)    |
    POST documentos_adopcion       |
   |-----------------------------> |
   |                               |
   |            [5] Revisa docs    |
   |                               |
   |            [5a] Docs aprobados|
   |            Estado: docs_aprobados
   |   Email: documentos aprobados |
   |<--------------------------    |
   |                               |
   |            [6] Agenda cita    |
   |            Estado: cita_programada
   |   Email: cita agendada        |
   |<--------------------------    |
   |                               |
[7] Asiste a la cita               |
   |                               |
   |            [8] Evalua cita    |
   |            asistencia + interaccion
   |                               |
   |            [8a] APROBADA      |
   |            adopcion.estado = aprobada
   |            mascota.estado = adoptado
   |   Email: adopcion aprobada    |
   |<--------------------------    |
   |                               |
[9] Adopcion completada            |
    Acceso a modulos de:           |
    - Citas veterinarias           |
    - Esterilizaciones             |
    - Seguimiento                  |
```

---

## 4. Diagrama de Roles y Accesos

```
                    SISTEMA IMPA
                         |
            +------------+------------+
            |                         |
         ADMIN                    USUARIO
         rol_id=1                 rol_id=2
            |                         |
     /dashboards/                /dashboards/
     administrador               usuario
            |                         |
   +--------+--------+       +--------+--------+
   |                 |       |                 |
   v                 v       v                 v
Mascotas          Citas   Catalogo          Solicitar
(CRUD)         (gestionar) mascotas         adopcion
   |                 |       |                 |
Adopciones      Usuarios  Mis citas        Mis docs
(aprobar)        (CRUD)   (propias)        (subir)
   |                 |       |                 |
Reportes       Docs      Esteriliz.       Seguimiento
(atender)     (revisar)  (solicitar)      (ver el suyo)
   |
Esteriliz.
Platicas
(gestionar)
```

---

## 5. Diagrama Entidad-Relacion (ER Simplificado)

```
auth.users (Supabase)
    |
    | 1:1
    v
perfiles -----> roles
    |           (1=admin, 2=usuario)
    |
    +-----> direcciones (1:N)
    |
    +-----> documentos (1:N)
    |
    +-----> solicitudes_adopcion (1:N)
                |
                | 1:1
                v
            adopciones ---------> mascotas
                |                     |
                |                     +----> razas
                |                     |
                |                     +----> historial_medico
                |
                +-----> citas_adopcion (1:N)
                |
                +-----> citas_veterinarias (1:N)
                |
                +-----> esterilizaciones (1:N)
                |
                +-----> seguimiento_adopcion (1:N)
                |
                +-----> seguimientos (1:N)

platicas_concientizacion ----> perfiles (usuario_id)

reportes_maltrato ----> perfiles (reportante_id, opcional)
    |
    +-----> reportes_maltrato_bitacora (1:N)

auditoria (registro de cambios globales)
auth_tokens ----> auth.users
```

---

## 6. Diagrama de Storage

```
Supabase Storage
    |
    +-- mascotas-imagenes/
    |       [uuid].jpg / .png
    |       Subida: al crear/editar mascota
    |       Lectura: publica (componente <Image>)
    |
    +-- mascotas-qr/
    |       [mascota_id].png
    |       Subida: automatica al crear mascota
    |       Lectura: publica (impresion fisica)
    |
    +-- documentos_adopcion/
    |       [usuario_id]/[uuid].pdf
    |       Subida: usuario en proceso de adopcion
    |       Lectura: admin y usuario propietario
    |
    +-- adopciones/
    |       evidencias del hogar del adoptante
    |       Limite: 5 MB por archivo
    |
    +-- reportes-maltrato/
    |       evidencias fotograficas del incidente
    |       Subida: PUBLICA (anonimo permitido)
    |
    +-- seguimineto/      (typo: deberia ser "seguimiento")
    |       fotos del animal en nuevo hogar
    |
    +-- logos/
            logos institucionales
```

---

## 7. Diagrama de CI/CD

```
Developer hace push / abre PR
         |
         v
GitHub Actions disparado
         |
    +----+----+
    |         |
tests.yml  pr-comment.yml
    |         |
    |    Comenta en el PR
    v
1. checkout
2. setup node 20
3. npm install
4. vitest run  (tests unitarios)
5. next build  (validacion de compilacion)
    |
    v
CI PASA?
    |
    +-- SI --> Merge disponible
    |
    +-- NO --> Build bloqueado
```
