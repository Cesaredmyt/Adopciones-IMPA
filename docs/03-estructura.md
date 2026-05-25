# 03 - Estructura del Proyecto

## 1. Vista General de Directorios

```
adopciones-impa/
  .github/
    workflows/
      deploy.yml          # CD: SSH deploy (referencia, no activo en local)
      tests.yml           # CI: vitest + next build
      pr-comment.yml      # Notificacion automatica en PR
      pr-email.yml        # Alerta de nuevo PR
  .storybook/
    main.ts               # Configuracion Storybook con Next.js Vite addon
    preview.ts            # Preview configuration
    vitest.setup.ts       # Setup de Vitest para Storybook
  docs/                   # Documentacion del sistema (este directorio)
  public/                 # Assets estaticos (imagenes, favicon, etc.)
  src/
    app/                  # Next.js App Router - rutas y paginas
    components/           # Componentes compartidos reutilizables
    context/              # Contextos de React globales
    features/             # Modulos funcionales (arquitectura vertical slice)
    hooks/                # Custom hooks globales
    lib/                  # Librerias, utilidades y configuraciones
    scripts/              # Scripts utilitarios
    stories/              # Assets y demos de Storybook
    styles/               # CSS global
    utils/                # Funciones de utilidad generales
    middleware.ts          # Middleware de Next.js (autenticacion/rutas)
  supabase/
    config.toml           # Configuracion local de Supabase
    functions/
      send-email/         # Edge Function para envio de email
  esterilizaciones-schema.sql   # Migration: modulo esterilizaciones
  platicas-schema.sql           # Migration: modulo platicas
  reportes-maltrato-schema.sql  # Migration: modulo reportes maltrato
  Dockerfile              # Imagen Docker multi-stage
  docker-compose.yml      # Orquestacion de contenedor
  next.config.mjs         # Configuracion de Next.js
  tailwind.config.ts      # Configuracion de Tailwind + tokens IMPA
  tsconfig.json           # Configuracion de TypeScript
  vitest.config.ts        # Configuracion de Vitest
  components.json         # Configuracion de shadcn/ui components
  DESIGN_SYSTEM.md        # Documentacion del Design System IMPA
```

---

## 2. Estructura de src/app (App Router)

### Grupos de Rutas

Next.js App Router organiza las rutas en grupos logicos con parentesis. Esto permite
layouts compartidos sin afectar la URL.

#### (auth) — Rutas de Autenticacion

| Ruta | Archivo | Descripcion |
|------|---------|-------------|
| /login | (auth)/login/page.tsx | Formulario de inicio de sesion |
| /register | (auth)/register/page.tsx | Registro de nuevo usuario |
| /recuperacion | (auth)/recuperacion/page.tsx | Solicitud de recuperacion de contrasena |
| /recuperacion/reestablecer_contrasena | .../page.tsx | Formulario de nueva contrasena |
| /verificar-email | (auth)/verificar-email/page.tsx | Instrucciones de verificacion |
| /confirmado | (auth)/confirmado/page.tsx | Confirmacion exitosa de email |
| /pendiente | (auth)/pendiente/page.tsx | Email pendiente de verificacion |

#### (marketing) — Pagina Publica

| Ruta | Archivo | Descripcion |
|------|---------|-------------|
| / | (marketing)/page.tsx | Pagina principal / Landing |

#### dashboards/administrador — Dashboard Admin (rol_id = 1)

| Ruta | Archivo | Descripcion |
|------|---------|-------------|
| /dashboards/administrador | .../page.tsx | Panel principal del administrador |
| /dashboards/administrador/mascotas | .../page.tsx | Gestion de mascotas |
| /dashboards/administrador/gestion_adopciones | .../page.tsx | Gestion de solicitudes de adopcion |
| /dashboards/administrador/gestion_citas | .../page.tsx | Gestion de citas de adopcion |
| /dashboards/administrador/citas-veterinarias | .../page.tsx | Gestion de citas veterinarias |
| /dashboards/administrador/documentos | .../page.tsx | Revision de documentos |
| /dashboards/administrador/esterilizaciones | .../page.tsx | Programa de esterilizaciones |
| /dashboards/administrador/platicas | .../page.tsx | Platicas de concientizacion |
| /dashboards/administrador/reportes-maltrato | .../page.tsx | Atencion a reportes de maltrato |
| /dashboards/administrador/reportes | .../page.tsx | Reportes y estadisticas |
| /dashboards/administrador/seguimiento | .../page.tsx | Seguimiento de adopciones |
| /dashboards/administrador/seguimiento/[id] | .../page.tsx | Detalle de seguimiento especifico |
| /dashboards/administrador/usuarios | .../page.tsx | Gestion de usuarios registrados |

#### dashboards/usuario — Dashboard Usuario (rol_id = 2)

| Ruta | Archivo | Descripcion |
|------|---------|-------------|
| /dashboards/usuario | .../page.tsx | Panel principal del usuario |
| /dashboards/usuario/mascotas | .../page.tsx | Catalogo de mascotas disponibles |
| /dashboards/usuario/mis-mascotas | .../page.tsx | Mis mascotas adoptadas |
| /dashboards/usuario/solicitud | .../page.tsx | Solicitar adopcion |
| /dashboards/usuario/adopcion | .../page.tsx | Estado de mi adopcion |
| /dashboards/usuario/form-adopcion/[solicitudId] | .../page.tsx | Formulario completo de adopcion |
| /dashboards/usuario/citas | .../page.tsx | Mis citas de adopcion |
| /dashboards/usuario/citas-veterinarias | .../page.tsx | Mis citas veterinarias |
| /dashboards/usuario/esterilizaciones | .../page.tsx | Mis solicitudes de esterilizacion |
| /dashboards/usuario/platicas | .../page.tsx | Mis platicas solicitadas |
| /dashboards/usuario/reportar-maltrato | .../page.tsx | Reportar maltrato (autenticado) |
| /dashboards/usuario/seguimiento/[adopcionId] | .../page.tsx | Ver seguimiento de mi adopcion |

#### dashboards — Compartidas

| Ruta | Archivo | Descripcion |
|------|---------|-------------|
| /dashboards/mascotas | .../mascotas/page.tsx | Galeria publica de mascotas |
| /dashboards/citas | .../citas/page.tsx | Vista compartida de citas |
| /dashboards/perfil | .../perfil/page.tsx | Perfil de usuario |

#### Rutas Publicas (sin grupo)

| Ruta | Archivo | Descripcion |
|------|---------|-------------|
| /mascota/[id] | mascota/[id]/page.tsx | Ficha publica de mascota (accesible via QR) |
| /nosotros | nosotros/page.tsx | Pagina "Quienes somos" |
| /reportar-maltrato | reportar-maltrato/page.tsx | Formulario publico de reporte anonimo |
| /reportar-maltrato/seguimiento | .../seguimiento/page.tsx | Seguimiento de reporte por folio |

---

## 3. Estructura de src/features (15 Modulos)

| Feature | Archivos aprox. | Descripcion |
|---------|----------------|-------------|
| admin | ~25 | Dashboard stats, actividad reciente, Realtime |
| adopciones | ~45 | Flujo completo del proceso de adopcion |
| citas | ~77 | Citas de adopcion + citas veterinarias |
| documentos | ~15 | Carga y revision de documentos |
| esterilizaciones | ~25 | Programa de esterilizacion |
| mascotas | ~54 | Catalogo, registro y gestion de mascotas |
| perfil | ~20 | Perfil de usuario, direccion, documentos |
| platicas | ~25 | Platicas de concientizacion |
| reportes-maltrato | ~22 | Reportes de maltrato animal |
| seguimiento | ~20 | Seguimiento post-adopcion |
| solicitudes | ~15 | Solicitudes de adopcion |
| usuarios | ~31 | Gestion administrativa de usuarios |
| ui | ~1 | Componente UI generico compartido |

---

## 4. Estructura de src/components (Compartidos)

```
src/components/
  auth/
    ModalLoginRequired.tsx    # Modal que pide login antes de continuar
    registro-form.tsx         # Formulario de registro reutilizable
  certificados/
    CertificadoModal.tsx      # Modal para mostrar certificado PDF
    CertificadoPDF.tsx        # Componente de certificado PDF (react-pdf)
  form/
    # 18 componentes: inputs IMPA personalizados (CAAMInput, IMPAInput,
    # IMPASelect, IMPASwitch, IMPATextarea, IMPAPhotoInput,
    # IMPARazaCombobox, FormGrid, FormRow, FormSection, etc.)
  layout/
    Header.tsx                # Header con deteccion de scroll
    HeaderSmart.tsx           # Header que oculta/muestra en scroll
    HeaderUsr.tsx             # Header de dashboard usuario
    HeaderAd.tsx              # Header de dashboard administrador
    PageShell.tsx             # Shell de pagina con layout consistente
    AdminShell.tsx            # Shell del dashboard administrador
    DashboardFooter.tsx       # Footer de dashboard
    FooterNewsletter.tsx      # Footer con newsletter
  terminos/
    ModalBienestar.tsx        # Modal de terminos de bienestar animal
    ModalSeguimiento.tsx      # Modal de compromiso de seguimiento
    PoliticaPrivacidadModal.tsx  # Modal de politica de privacidad
    TerminosModal.tsx         # Modal de terminos y condiciones
  ui/
    # 45+ componentes: Badge, Button, Calendar, Card, Checkbox,
    # ChatBubble, Command, Dialog, EmptyState, Form, Input,
    # Label, Modal, Pagination, Popover, Select, Skeleton,
    # StatusBadge, Stepper, Table, Tabs, Textarea,
    # toastConfirm, ModalPremium, UserTableSkeleton
  GlobeIMPA.tsx               # Globo 3D con branding IMPA
  GlobeCAAM.tsx               # Variante de globo CAAM
  GlobeMinimal.tsx            # Version minima del globo
```

---

## 5. Estructura de src/lib (Librerias Compartidas)

```
src/lib/
  auth/
    ratelimit/
      index.ts      # Factory: selecciona Upstash o memory segun entorno
      memory.ts     # Implementacion en memoria (desarrollo local)
      upstash.ts    # Implementacion Upstash Redis (produccion)
      types.ts      # Tipos de rate limiting
    schemas/
      login.ts      # Schema Zod para validar login
      register.ts   # Schema Zod para validar registro
      resetConfirm.ts  # Schema Zod para confirmar reset de contrasena
    tokens/
      index.ts      # Utilidades de tokens de autenticacion
    requireRole.ts  # Guard server-side: valida sesion + rol
    requireSession.ts  # Guard server-side: valida solo sesion
    siteUrl.ts      # Utilidad para URL del sitio segun entorno
  email/
    internalAuth.ts        # Autenticacion de llamadas internas de email
    safeHtml.ts            # Sanitizacion HTML para cuerpos de email
    sendAccountConfirmation.ts  # Email de confirmacion de cuenta
    sendPasswordReset.ts   # Email de recuperacion de contrasena
  supabase/
    admin.ts        # Cliente Supabase con service_role key (operaciones admin)
    client.ts       # Cliente Supabase browser (componentes cliente)
    server.ts       # Cliente Supabase server (Server Components, Actions)
    database.ts     # Tipos de base de datos
    middleware.ts   # Cliente Supabase para middleware de Next.js
    pagination.ts   # Helpers de paginacion
    upload-adopciones.ts  # Subida de archivos del proceso de adopcion
  logger.ts         # Utilidad de logging
  showSoftToast.ts  # Notificaciones toast no intrusivas
  utils.ts          # Utilidades generales (cn, formateo, etc.)
  validations/
    auth.ts         # Validaciones de autenticacion
```
