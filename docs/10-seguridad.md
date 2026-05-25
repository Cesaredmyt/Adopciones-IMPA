# 10 - Seguridad

---

## 1. Modelo de Seguridad

La seguridad del sistema se implementa en **multiples capas** siguiendo el principio
de defensa en profundidad. Ninguna capa es suficiente por si sola; la seguridad
depende de que todas las capas funcionen en conjunto.

```
CAPA 1: Red/Transporte (HTTPS obligatorio en produccion)
CAPA 2: Middleware de Next.js (JWT + cookies)
CAPA 3: Server-side guards (requireRole / requireSession)
CAPA 4: Row Level Security de Supabase (en DB)
CAPA 5: Rate limiting (Upstash Redis / memoria)
CAPA 6: Validacion de entrada (Zod schemas)
CAPA 7: Sanitizacion de HTML (emails)
CAPA 8: Autenticacion de APIs internas (INTERNAL_API_SECRET)
```

---

## 2. Autenticacion y Sesiones

### JWT con Supabase Auth

- Las sesiones se manejan mediante **JSON Web Tokens** emitidos por Supabase
- Los tokens se almacenan en **cookies HTTP-only** (inaccesibles desde JavaScript del navegador)
- Duracion del JWT: **3600 segundos** (1 hora), con refresco automatico
- El middleware refresca automaticamente los tokens antes de que expiren

### Cookie de Rol (impa-role)

- Cookie adicional que cachea el `rol_id` del usuario (1 o 2)
- Reduce llamadas a la base de datos en el middleware
- Si es alterada por el cliente, la validacion server-side en `requireRole()` la corrige
- Se borra al hacer logout

### Validacion del JWT

El middleware usa `supabase.auth.getUser()` que **valida el JWT contra Supabase**,
no solo lee el payload del token. Esto previene ataques con tokens manipulados.

---

## 3. Rate Limiting

Implementado para proteger los endpoints de autenticacion contra ataques de
fuerza bruta y enumeracion de usuarios.

### Configuracion (Upstash Redis)

```
Algoritmo: Sliding Window (ventana deslizante)
Configuracion tipica: 5-10 requests por 60 segundos por IP
```

### Endpoints protegidos

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/reset-password
- POST /api/auth/resend-verification

### Fallback en desarrollo

En entorno local sin Upstash, se usa una implementacion en memoria
(`src/lib/auth/ratelimit/memory.ts`). Esta NO es persistente entre reinicios
y NO funciona en entornos multi-instancia.

---

## 4. Row Level Security (RLS)

Cada tabla tiene RLS habilitado. Incluso si un bug en el codigo de la aplicacion
intenta acceder a datos de otro usuario, la base de datos lo bloquea a nivel SQL.

Ver detalle completo de politicas RLS en [07-base-de-datos.md](./07-base-de-datos.md).

---

## 5. Validacion de Entradas

### Zod Schemas

Todas las entradas del usuario pasan por validacion con **Zod** antes de ser
procesadas. Los schemas estan en `schemas/` dentro de cada feature.

### React Hook Form + Zod

Los formularios del lado del cliente validan con Zod mediante `@hookform/resolvers`.
La misma validacion se repite en el servidor (Server Actions) para garantizar
que no se puedan enviar datos invalidos aunque se deshabilite JavaScript.

---

## 6. Seguridad de APIs Internas

Los endpoints `/api/email/*` son internos y no estan pensados para ser llamados
desde el exterior. Se protegen con un secreto compartido:

```
Header: x-internal-secret: [INTERNAL_API_SECRET]
```

Las llamadas sin este header son rechazadas con HTTP 401.

---

## 7. Sanitizacion de HTML

El contenido dinamico insertado en emails es sanitizado con `safeHtml.ts`
para prevenir que datos del usuario introduzcan HTML malicioso en los correos.

---

## 8. Manejo Seguro de Credenciales en el Servidor

- La `SUPABASE_SERVICE_ROLE_KEY` se usa exclusivamente en `src/lib/supabase/admin.ts`
  y solo en contextos de servidor. Nunca se expone al cliente.
- Los tokens de Upstash Redis solo se usan en el servidor.
- El `EMAIL_PASS` es una App Password de Google (no la contrasena real de Gmail).
- El `RESEND_API_KEY` solo se usa en contextos de servidor.

---

## 9. Prevencion de Acceso a Datos de Terceros

### Nivel de Aplicacion

- `requireRole()` valida que el usuario tenga sesion y el rol correcto
- Los Server Actions verifican `auth.uid()` para operaciones sensibles

### Nivel de Base de Datos

- RLS garantiza que cada usuario solo vea sus propios registros
- Los admins tienen acceso total via politicas explicitamente definidas

---

## 10. Gestion de Sesion al Logout

El logout se realiza **server-side** via `/api/auth/logout`:
1. Se llama `supabase.auth.signOut()` en el servidor
2. Las cookies de sesion se eliminan del navegador
3. La cookie `impa-role` se elimina
4. Se redirige a `/login`

Esto garantiza que el logout no dependa de JavaScript del cliente y que
las cookies HTTP-only sean correctamente eliminadas.

---

## 11. Seguridad en la Subida de Archivos

- El bucket `adopciones` tiene un limite de **5 MB por archivo**
- Los demas buckets no tienen limite configurado explicitamente (oportunidad de mejora)
- Los tipos MIME no estan restringidos en ninguno de los buckets (oportunidad de mejora)
- La URL de cada archivo es aleatoria (UUID) previniendo enumeracion de archivos

---

## 12. Riesgos de Seguridad Identificados

Para el detalle completo de riesgos, ver [19-riesgos-mejoras.md](./19-riesgos-mejoras.md).

**Resumen de riesgos criticos:**

1. Credenciales de EmailJS hardcodeadas en `supabase/functions/send-email/index.ts`
2. Buckets de Storage sin restriccion de tipos MIME
3. Varios buckets sin limite de tamano de archivo
4. `typescript.ignoreBuildErrors: true` en next.config.mjs
5. Cobertura de tests insuficiente (5 suites para 300+ archivos)
