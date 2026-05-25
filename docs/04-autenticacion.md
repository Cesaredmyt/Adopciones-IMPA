# 04 - Autenticacion, Roles y Middleware

---

## 1. Sistema de Autenticacion

El sistema utiliza **Supabase Auth** como unico proveedor de autenticacion. No hay autenticacion propia ni terceros activos en produccion. Supabase gestiona:

- Registro con email y contrasena
- Inicio de sesion con JWT
- Verificacion de email
- Recuperacion de contrasena
- Manejo de sesiones via cookies HTTP-only
- Refresco automatico de tokens

### Flujo de Registro

```
1. Usuario completa formulario /register (nombre, email, contrasena)
2. POST /api/auth/register
3. Supabase crea usuario en auth.users
4. Se crea registro en public.perfiles con rol_id = 2 (usuario)
5. Se genera token en public.auth_tokens (purpose: verify_email)
6. Se envia email de verificacion via Nodemailer/Resend
7. Usuario hace clic en enlace -> GET /api/auth/verify?token=...
8. Token se valida y marca como usado_at
9. Usuario redirigido a /dashboards/usuario
```

### Flujo de Login

```
1. Usuario completa formulario /login (email, contrasena)
2. POST /api/auth/login
3. Supabase valida credenciales y devuelve sesion JWT
4. Se consulta public.perfiles para obtener rol_id
5. Se setea cookie HTTP-only de sesion de Supabase
6. Se setea cookie impa-role = "1" (admin) o "2" (usuario)
7. Respuesta con redirectUrl segun el rol
8. Cliente redirige al dashboard correspondiente
```

### Flujo de Recuperacion de Contrasena

```
1. Usuario solicita /recuperacion (email)
2. POST /api/auth/reset-password
3. Se genera token en auth_tokens (purpose: password_reset)
4. Email con enlace de reset enviado via Nodemailer
5. Usuario hace clic -> /recuperacion/reestablecer_contrasena?token=...
6. POST /api/auth/reset/confirm (token + nueva_contrasena)
7. Token validado, contrasena actualizada en Supabase Auth
8. Token marcado como usado_at
```

### Logout

```
1. Usuario hace clic en "Cerrar sesion"
2. POST /api/auth/logout (server-side)
3. Se llama supabase.auth.signOut() en el servidor
4. Cookies borradas (sesion + impa-role)
5. Redireccion a /login
```

---

## 2. Roles y Permisos

El sistema tiene exactamente **dos roles**:

| rol_id | Nombre | Descripcion |
|--------|--------|-------------|
| 1 | Administrador | Acceso total al sistema. Gestiona mascotas, adopciones, usuarios, citas, reportes |
| 2 | Usuario (Adoptante) | Acceso al dashboard de usuario. Puede iniciar proceso de adopcion, agendar citas, solicitar esterilizaciones |

### Tabla de permisos por modulo

| Modulo | Administrador | Usuario |
|--------|--------------|---------|
| Dashboard principal | Stats completas + actividad reciente | Resumen de su proceso |
| Mascotas | CRUD completo + razas + fotos + QR | Solo lectura (catalogo) |
| Solicitudes adopcion | Ver y gestionar todas | Crear y ver las suyas |
| Proceso de adopcion | Aprobar / rechazar | Seguir estado |
| Documentos | Revisar y aprobar/rechazar | Subir los suyos |
| Citas adopcion | Gestionar calendario + evaluar | Agendar y ver las suyas |
| Citas veterinarias | Crear, gestionar, completar | Crear para sus mascotas |
| Esterilizaciones | Aprobar, programar, completar | Solicitar para sus mascotas |
| Platicas | Aprobar, rechazar, finalizar | Solicitar |
| Reportes maltrato | Ver todos + actualizar estado | Reportar (publico) |
| Usuarios | CRUD de usuarios | Solo su perfil |
| Seguimiento | Ver y registrar todos | Ver el suyo |

### Almacenamiento del Rol en el Sistema

El rol se persiste en dos lugares con diferentes propositos:

1. **Base de datos** (`public.perfiles.rol_id`): Fuente de verdad. Se consulta en cada validacion server-side critica mediante `requireRole()`.

2. **Cookie del navegador** (`impa-role`): Cache de performance. Se setea al hacer login para evitar una consulta a la BD en cada request del middleware. Si la cookie no coincide con la BD (rol cambiado por admin), la siguiente validacion server-side `requireRole()` corrige el acceso.

---

## 3. Middleware de Next.js

**Archivo:** `src/middleware.ts`

El middleware intercepta cada request HTTP antes de que llegue a la ruta de destino.

### Categorias de Rutas

| Categoria | Rutas | Comportamiento |
|----------|-------|---------------|
| ADMIN_PATHS | /dashboards/administrador | Solo rol 1. Si usuario (rol 2) intenta acceder: redirige a /dashboards/usuario |
| USER_PATHS | /dashboards/usuario | Solo rol 2. Si admin (rol 1) intenta acceder: redirige a /dashboards/administrador |
| AUTH_PAGES | /login, /register, /recuperacion, /verificar-email, /confirmado, /pendiente | Si ya tiene sesion: redirige al dashboard del rol |
| PUBLIC_REDIRECT_PATHS | /, /adopciones, /nosotros, /contacto, /quienes-somos, /dashboards/mascotas, /reportar-maltrato | Si ya tiene sesion: redirige al dashboard del rol |
| ALWAYS_PUBLIC | /mascota, /reportar-maltrato/seguimiento | Siempre accesible, sin importar estado de sesion |
| API /api/auth/* y /api/email/* | — | Siempre pasan (sin validacion de sesion en middleware) |

### Logica del Middleware

```
Request entra al middleware
  |
  +-- Es /api/auth/ o /api/email/?  -> Pasar (next)
  |
  +-- Es ALWAYS_PUBLIC?             -> Pasar (next)
  |
  +-- Validar sesion Supabase JWT
  |   (createServerClient + getUser())
  |
  SIN sesion:
    +-- Es DASHBOARD?               -> Redirect /login?next={pathname}
    +-- Cualquier otra ruta         -> Pasar (next)
  |
  CON sesion:
    +-- Es AUTH_PAGE?               -> Redirect al dashboard del rol
    +-- Es PUBLIC_REDIRECT?         -> Redirect al dashboard del rol
    +-- Es ADMIN_PATH + rol usuario?-> Redirect /dashboards/usuario
    +-- Es USER_PATH + rol admin?   -> Redirect /dashboards/administrador
    +-- Todo lo demas               -> Pasar con tokens refrescados
```

### Validacion Doble de Seguridad

El middleware es la primera linea de defensa, pero NO es la unica. Los layouts de cada dashboard llaman adicionalmente a `requireRole()` para garantizar que incluso si el middleware fallara, el usuario no autorizado sea bloqueado:

```typescript
// En layout.tsx de /dashboards/administrador:
await requireRole({ allow: [ROLES.admin], fallback: '/dashboards/usuario' })

// En layout.tsx de /dashboards/usuario:
await requireRole({ allow: [ROLES.usuario], fallback: '/dashboards/administrador' })
```

---

## 4. Clientes de Supabase

El sistema tiene tres instancias del cliente Supabase para diferentes contextos:

### client.ts — Cliente Browser

Usado en componentes con "use client". Usa la clave ANON KEY (publica).
Respeta las politicas RLS de Supabase.

### server.ts — Cliente Server

Usado en Server Components, Server Actions y API Routes que NO requieren
privilegios de administrador. Lee las cookies de sesion del usuario actual.
Respeta las politicas RLS del usuario autenticado.

### admin.ts — Cliente Admin (Service Role)

Usado solo en API Routes que requieren operaciones administrativas que
bypassean RLS (ej: crear un usuario, acceder a datos sin importar el rol).
Usa SUPABASE_SERVICE_ROLE_KEY — NUNCA debe exponerse al cliente.

---

## 5. Tokens de Autenticacion Personalizados (auth_tokens)

Ademas de los JWT de Supabase, el sistema mantiene una tabla propia `auth_tokens`
para tokens de uso especifico:

| Campo | Descripcion |
|-------|-------------|
| purpose | "verify_email" o "password_reset" |
| token_hash | Hash del token (nunca el token en texto plano) |
| expires_at | Expiracion del token |
| used_at | Cuando fue usado (NULL si no ha sido usado) |
| ip_origin | IP desde donde se solicito |
| user_agent | User agent del navegador solicitante |

Los tokens son de un solo uso: una vez utilizado, `used_at` se establece y el token no puede reutilizarse.

---

## 6. Rate Limiting

Las rutas de autenticacion (login, register, reset-password) estan protegidas con
rate limiting para prevenir ataques de fuerza bruta.

### Implementacion Dual

| Entorno | Implementacion | Configuracion |
|---------|---------------|---------------|
| Produccion / Serverless | Upstash Redis (sliding window) | UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN |
| Desarrollo local | Memoria (Map de Node.js) | Sin variables de entorno necesarias |

El factory en `src/lib/auth/ratelimit/index.ts` selecciona automaticamente la implementacion
segun la disponibilidad de las variables de entorno de Upstash.

### Ventana deslizante (Sliding Window)

El algoritmo de ventana deslizante permite `max` requests en los ultimos `windowSeconds` segundos
para el mismo identificador (generalmente IP + endpoint).
