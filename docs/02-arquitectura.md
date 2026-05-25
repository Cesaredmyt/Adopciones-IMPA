# 02 - Arquitectura General y Stack Tecnologico

## 1. Arquitectura General

El sistema sigue una arquitectura full-stack monolitica con separacion de capas, implementada sobre Next.js 15 con App Router. No existe un backend separado: el servidor y el cliente coexisten en la misma aplicacion Next.js.

```
CLIENTE (Browser)
React 19 + TailwindCSS v4 + TanStack Query + React Hook Form
Componentes Client ("use client") con estado reactivo

         |  HTTP / Server Actions / RSC
         v

SERVIDOR (Next.js 15)
App Router | Server Components | Server Actions
API Routes | Middleware        | requireRole/requireSession

         |  PostgreSQL + Auth + Storage + Realtime
         v

SUPABASE
PostgreSQL 17 | Supabase Auth | Storage | Realtime
Row Level Security (RLS) | Edge Functions
```

### Capas del sistema

| Capa | Tecnologia | Responsabilidad |
|------|-----------|----------------|
| Presentacion | React 19 + Tailwind v4 | Renderizado de UI, interacciones del usuario |
| Estado cliente | TanStack Query v5 + SWR | Cache de datos del servidor, sincronizacion |
| Formularios | React Hook Form + Zod | Validacion y control de formularios |
| Servidor (HTTP) | Next.js 15 API Routes | Endpoints REST, webhooks, operaciones seguras |
| Servidor (SSR) | Next.js Server Components + Server Actions | Renderizado en servidor, mutaciones seguras |
| Seguridad | Middleware + requireRole | Autenticacion y autorizacion en cada request |
| Persistencia | Supabase PostgreSQL | Base de datos relacional con RLS |
| Autenticacion | Supabase Auth | JWT, sesiones, email verification |
| Almacenamiento | Supabase Storage | Imagenes, documentos, evidencias |
| Tiempo real | Supabase Realtime | Actualizaciones en vivo del dashboard |
| Email | Nodemailer + Resend API | Notificaciones automaticas |

---

## 2. Stack Tecnologico Completo

### Frontend

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Next.js | 15.5.9 | Framework full-stack con App Router |
| React | 19.1.0 | Libreria de UI |
| TypeScript | ^5.x | Tipado estatico |
| Tailwind CSS | v4 | Estilos utilitarios + Design System IMPA |
| Framer Motion | 12.x | Animaciones |
| Lucide React | 0.544.0 | Iconografia |
| TanStack Query | 5.90.x | Gestion de estado del servidor y cache |
| SWR | 2.3.x | Fetching de datos reactivo (usos puntuales) |
| React Hook Form | 7.66.x | Gestion de formularios |
| Zod | 4.1.x | Validacion de schemas |
| Sonner | 2.0.x | Notificaciones toast |
| date-fns | 4.1.x | Manipulacion de fechas |

### Componentes UI

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Radix UI | Varios | Primitivos de UI accesibles (Dialog, Select, Popover, Label) |
| class-variance-authority | 0.7.x | Variantes de componentes |
| clsx + tailwind-merge | Varios | Combinacion de clases CSS |
| cmdk | 1.1.x | Componente Command/Combobox |
| react-datepicker | 8.9.x | Selector de fechas |
| react-day-picker | 9.11.x | Calendario de dias |
| FullCalendar | 6.1.x | Calendario avanzado (citas veterinarias) |
| react-big-calendar | 1.19.x | Calendario de citas de adopcion |

### Backend / Servidor

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Next.js API Routes | 15.5.9 | Endpoints REST internos |
| Next.js Server Actions | 15.5.9 | Mutaciones server-side seguras |
| Nodemailer | 7.0.x | Envio de emails via SMTP Gmail |
| Resend API | — | Proveedor de email alternativo/principal |
| @upstash/ratelimit | 2.0.x | Rate limiting distribuido (sliding window) |
| @upstash/redis | 1.38.x | Backend Redis para rate limiting |
| uuid | 13.0.x | Generacion de IDs unicos |

### Base de datos e Infraestructura

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Supabase | Cloud | PostgreSQL 17 + Auth + Storage + Realtime |
| @supabase/ssr | 0.7.x | Cliente Supabase SSR (server-side) |
| @supabase/supabase-js | 2.81.x | Cliente Supabase general |
| PostgreSQL | 17 | Motor de base de datos |

### Generacion de Contenido

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| @react-pdf/renderer | 4.3.x | Generacion de certificados PDF |
| qrcode | 1.5.x | Generacion de codigos QR para mascotas |

### Testing y Calidad

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Vitest | 3.2.x | Framework de testing (unitario) |
| @testing-library/react | 16.3.x | Testing de componentes React |
| Playwright | 1.55.x | Testing E2E (configurado, no implementado) |
| Storybook | 9.1.x | Documentacion visual de componentes |
| @storybook/addon-a11y | 9.1.x | Pruebas de accesibilidad en Storybook |

### Contenedorizacion y CI/CD

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Docker | — | Contenedor de aplicacion (multi-stage build) |
| Node.js | 20 Alpine | Runtime de produccion |
| GitHub Actions | — | CI: tests automatizados + build de validacion |

---

## 3. Patrones de Arquitectura Utilizados

### Vertical Slice Architecture (Feature-based)

El codigo esta organizado por dominio funcional en lugar de por tipo de archivo.
Cada feature en src/features/ contiene todo lo necesario para su funcionamiento:

```
src/features/adopciones/
  actions/      # Server Actions y operaciones server-side
  components/   # Componentes React especificos del modulo
    client/     # Componentes que usan "use client"
    server/     # Componentes de solo servidor
  hooks/        # Custom hooks de React (queries/mutations)
  queries/      # Definiciones de TanStack Query
  schemas/      # Esquemas Zod de validacion
  mappers/      # Transformacion de datos DB -> UI
  types/        # Definiciones de tipos TypeScript
  utils/        # Utilidades especificas del modulo
```

### Server-First con Hydration Selectiva

- Los layouts son Server Components que validan la sesion y el rol.
- Las paginas comienzan como Server Components y montan Client Components cuando necesitan interactividad.
- Las mutaciones usan Server Actions para operaciones que requieren privilegios de servidor.
- El estado del cliente (UI optimista, cache) se gestiona con TanStack Query.

### API Gateway Pattern (Interno)

Todas las operaciones sensibles (autenticacion, emails, documentos, webhooks) pasan por
API Routes en src/app/api/ que actuan como gateway con:
- Validacion de secretos internos (INTERNAL_API_SECRET)
- Rate limiting por IP y usuario (Upstash Redis)
- Sanitizacion de inputs
- Manejo centralizado de errores

---

## 4. Flujo de Datos General

1. El usuario hace una peticion HTTP al servidor de Next.js.
2. El middleware valida la sesion JWT con Supabase y la cookie de rol (impa-role).
3. Si la ruta es protegida y no hay sesion, se redirige a /login.
4. El layout del dashboard llama a requireRole() como segunda validacion server-side.
5. Los Server Components obtienen datos iniciales via Server Actions o queries directas a Supabase.
6. El HTML renderizado llega al navegador con los datos incluidos (SSR).
7. TanStack Query toma el control en el cliente para actualizaciones subsecuentes.
8. Supabase Realtime mantiene el dashboard actualizado via WebSocket (postgres_changes).
