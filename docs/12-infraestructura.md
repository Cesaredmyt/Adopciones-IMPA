# 12 - Infraestructura y CI/CD

---

## 1. Dockerizacion

El sistema esta contenerizado con Docker usando un build multi-etapa (multi-stage)
para optimizar el tamano de la imagen de produccion.

### Dockerfile

**Archivo:** `Dockerfile`

```
Etapa 1: builder (node:20-alpine)
  - Copia package.json y package-lock.json
  - Instala dependencias (npm install)
  - Copia el resto del codigo fuente
  - Ejecuta el build de Next.js (npm run build)

Etapa 2: runner (node:20-alpine)
  - Solo copia los artefactos del build:
    .next/standalone  -> ./
    .next/static      -> ./.next/static
    public/           -> ./public
  - Puerto expuesto: 3000
  - Comando: node server.js
```

### Beneficios del Multi-Stage Build

- La imagen final NO incluye el codigo fuente, node_modules de desarrollo, ni herramientas de build
- Imagen de produccion considerablemente mas liviana
- Next.js con `output: 'standalone'` genera un servidor minimo autosuficiente

### docker-compose.yml

**Archivo:** `docker-compose.yml`

```yaml
services:
  app:
    build: .
    container_name: caam_app
    ports:
      - "3000:3000"
    env_file:
      - .env.local
```

### Correr el sistema con Docker (local)

```bash
# Construir imagen
docker build -t impa-app .

# O con docker-compose
docker-compose build

# Levantar el contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## 2. Configuracion de Next.js

**Archivo:** `next.config.mjs`

| Opcion | Valor | Proposito |
|--------|-------|----------|
| output | 'standalone' | Genera servidor minimo para Docker |
| typescript.ignoreBuildErrors | true | Permite build con errores de tipos |
| eslint.ignoreDuringBuilds | true | Omite linting durante el build |
| serverActions.bodySizeLimit | '5mb' | Limite de subida via Server Actions |
| images.unoptimized | true | Desactiva optimizacion Next/Image |
| images.remotePatterns | *.supabase.co | Permite imagenes de Supabase |

> Nota: `ignoreBuildErrors` y `ignoreDuringBuilds` deben ser removidos o configurados
> con cuidado. Ver seccion de Riesgos Tecnicos.

---

## 3. Variables de Entorno

**Archivo requerido:** `.env.local` en la raiz del proyecto

### Variables de Supabase (obligatorias)

| Variable | Descripcion | Contexto |
|----------|-------------|---------|
| NEXT_PUBLIC_SUPABASE_URL | URL del proyecto Supabase | Cliente + Servidor |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Clave anonima de Supabase | Cliente + Servidor |
| SUPABASE_SERVICE_ROLE_KEY | Clave de servicio (admin) | Solo servidor |

### Variables de Email (obligatorias para envio de correos)

| Variable | Descripcion | Contexto |
|----------|-------------|---------|
| EMAIL_USER | Email institucional (Gmail) | Servidor |
| EMAIL_PASS | App Password de Gmail | Servidor |
| EMAIL_FROM | Nombre y email del remitente | Servidor |
| RESEND_API_KEY | Clave de API de Resend | Servidor |

### Variables de Rate Limiting (recomendadas para produccion)

| Variable | Descripcion | Contexto |
|----------|-------------|---------|
| UPSTASH_REDIS_REST_URL | URL de Upstash Redis | Servidor |
| UPSTASH_REDIS_REST_TOKEN | Token de Upstash Redis | Servidor |

### Variables de Seguridad

| Variable | Descripcion | Contexto |
|----------|-------------|---------|
| INTERNAL_API_SECRET | Secreto para APIs internas de email | Servidor |

### Variables de URL del Sitio

| Variable | Descripcion | Contexto |
|----------|-------------|---------|
| NEXT_PUBLIC_SITE_URL | URL base del sitio | Cliente + Servidor |

### Variables de Base de Datos Directa

| Variable | Descripcion | Contexto |
|----------|-------------|---------|
| DATABASE_URL | Conexion directa a PostgreSQL | Servidor |

### Template de .env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[tu-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]

# Email (Gmail SMTP)
EMAIL_USER=[tu-email@impa.com]
EMAIL_PASS=[tu-app-password]
EMAIL_FROM="IMPA Morelia <[tu-email@impa.com]>"

# Resend
RESEND_API_KEY=[tu-resend-api-key]

# Rate Limiting (opcional en desarrollo)
UPSTASH_REDIS_REST_URL=[tu-upstash-url]
UPSTASH_REDIS_REST_TOKEN=[tu-upstash-token]

# Seguridad
INTERNAL_API_SECRET=[genera con: openssl rand -base64 32]

# URL del sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Base de datos directa
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

---

## 4. CI/CD con GitHub Actions

El proyecto tiene 4 workflows de GitHub Actions.

### Workflow 1: CI - Tests y Build (tests.yml)

**Disparador:** Push o Pull Request a las ramas `main` y `godav`

**Pasos:**
1. Checkout del codigo
2. Setup de Node.js 20 con cache de npm
3. `npm install` — Instalar dependencias
4. `npm run test:run` — Ejecutar tests con Vitest
5. `npm run build` — Build de Next.js (validacion de compilacion)
6. Echo de confirmacion

**Secretos necesarios en GitHub:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Proposito:** Garantizar que cada push pasa los tests y compila correctamente
antes de ser mergeado a la rama principal.

### Workflow 2: PR - Comentarios Automaticos (pr-comment.yml)

**Disparador:** Apertura, sincronizacion o reapertura de Pull Request

**Accion:** Publica un comentario automatico en el PR con informacion del autor
y las ramas involucradas, indicando que el CI ejecutara las validaciones.

**Permisos:** `pull-requests: write`, `issues: write`

### Workflow 3: PR - Alerta por Correo (pr-email.yml)

**Disparador:** Apertura de Pull Request

**Accion:** Imprime en los logs del workflow la informacion del PR (autor,
repositorio, ramas). Funciona como punto de extension para agregar
notificaciones reales.

### Workflow 4: CD - Deploy VPS (deploy.yml)

> Este workflow aplica para entornos de servidor. No se usa en desarrollo local.

**Disparador:** Push a ramas `main` o `godav`

**Accion:**
1. Conexion SSH al VPS
2. `git fetch + checkout + reset --hard` para actualizar el codigo
3. `docker-compose down` + `docker system prune -af` (limpieza)
4. `docker-compose build --no-cache` (rebuild completo)
5. `docker-compose up -d` (levantar)

---

## 5. Supabase Local

Para desarrollo local, Supabase CLI provee un entorno completo:

**Archivo:** `supabase/config.toml`

| Servicio | Puerto local |
|----------|-------------|
| API (PostgREST) | 54321 |
| Database (PostgreSQL) | 54322 |
| Studio (UI) | 54323 |
| Inbucket (email testing) | 54324 |
| Analytics | 54327 |
| Realtime | 54321 (via API) |

### Comandos Supabase CLI

```bash
# Iniciar servicios locales
supabase start

# Detener servicios
supabase stop

# Ver estado
supabase status

# Aplicar migraciones
supabase db push

# Generar tipos TypeScript desde el schema
supabase gen types typescript --local > src/types/database.types.ts
```

---

## 6. Configuracion de TypeScript

**Archivo:** `tsconfig.json`

- Target: ES2017
- Alias de paths: `@/*` -> `./src/*`
- JSX: preserve (Next.js lo maneja)
- Strict mode: habilitado

El alias `@/` permite importaciones absolutas:
```typescript
import { createClient } from '@/lib/supabase/client'
// en lugar de: ../../lib/supabase/client
```
