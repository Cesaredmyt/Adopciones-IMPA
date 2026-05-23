# IMPA Design System

Sistema visual unificado de la plataforma IMPA (Instituto Michoacano de Protección Animal).
Inspirado en los diseños de Stitch (Google) — landing, gallery, admin, vet, adopter progress —
y adaptado al stack Next.js + Tailwind v4 + Radix existente.

> **Estado:** Fase 1 completada (tokens + primitivos). Fase 2 (admin shell + dashboards) y
> Fase 3 (vista pública + usuario) consumen esta base.

---

## 1. Tokens

Los tokens se declaran en dos lugares por compatibilidad Tailwind v4 + JS config:

- **`src/styles/globals.css`** — Tailwind v4 `@theme {}` (genera utilidades `bg-*`, `text-*`, etc.)
  y bloque legacy `:root {}` para CSS utilitarias como `.impa-card`, `.impa-chip`.
- **`tailwind.config.ts`** — espejo de los colores y sombras para builds que aún consulten el config JS.

### 1.1 Paleta

| Grupo | Tokens | Uso |
|---|---|---|
| **Brand (verde)** | `impa-50` → `impa-900`, primary `impa-500` (#17cf17), strong `impa-600` (#11a611) | CTAs, links, activos, indicadores. |
| **Superficies cool** | `impa-bg` (#f6f8f6), `impa-bg-elev`, `impa-surface`, `impa-surface-2`, `impa-surface-3`, `impa-tinted` | App, admin, dashboards. |
| **Superficies warm** | `impa-cream` (#faf5ef), `impa-cream-2`, `impa-cream-3` | Vista pública (Adoptions Gallery, hero soft). |
| **Accent cálido** | `impa-accent` (#f5c842), `-soft`, `-strong`, `-ink` | Stat callouts ("+24 esta semana"), chat bubble inferior, badges destacados. |
| **Texto** | `impa-text`, `-text-strong`, `-muted`, `-subtle`, `-quiet` | Jerarquía tipográfica. |
| **Bordes** | `impa-line`, `-line-strong`, `-line-faint` | Separadores, contornos de cards. |
| **Feedback** | `impa-success`, `-warning`, `-danger`, `-info` (cada uno con `-soft`, `-ink`) | Status badges, alerts. |

Reglas:
- **Nunca usar** colores Tailwind genéricos (`red-600`, `amber-500`) si existe un token IMPA equivalente.
  El Badge ya migró a `impa-success-soft`, `impa-warning-soft`, etc.
- El verde `impa-500` es el primario. Solo gradiente `impa-cta` (`bg-impa-cta`) para botones hero/principal.
- El accent amarillo `impa-accent` se reserva para **callouts visuales** (no para botones primarios sistémicos).

### 1.2 Sombras

`shadow-impa-xs` → `shadow-impa-xl`, `shadow-impa-glow` (verde), `shadow-impa-accent-glow` (amarillo).
Mismo lenguaje en todos los componentes — no usar `shadow-md/lg/xl` de Tailwind directamente.

### 1.3 Radius

- Inputs / chips compactos: `rounded-lg` (8px) o `rounded-xl` (12px).
- Cards / modales / paneles: `rounded-2xl` (16px).
- Pills, status badges, paginación activa, avatares: `rounded-full`.

### 1.4 Easings & Animaciones

`ease-impa`, `ease-impa-out`, `ease-impa-in`. Duraciones `--impa-duration-fast` (140ms), `--impa-duration` (220ms), `--impa-duration-slow` (320ms).

Keyframes disponibles: `animate-fade-in`, `animate-fade-up`, `animate-fade-slide`, `animate-scale-in`,
`animate-floating`, `heartbeat`, `soft-bounce`, `impa-shimmer`, `impa-pulse-ring`, `stagger-item`.

### 1.5 Backgrounds compuestos

- `bg-impa-mesh` — hero verde (default landing).
- `bg-impa-mesh-warm` — hero cream/cálido (Adoptions Gallery, secciones públicas suaves).
- `bg-impa-cta` — gradiente CTA verde.
- `bg-impa-accent-cta` — gradiente CTA amarillo.

Utility helpers en `globals.css`:
- `.impa-page-bg` — fondo full-page verde con glow.
- `.impa-page-bg-warm` — fondo full-page cream (vista pública).
- `.impa-hero-mesh`, `.impa-hero-mesh-warm` — fondos hero.
- `.impa-card`, `.impa-card-warm`, `.impa-card-elevated` — superficies de card en CSS plano.
- `.impa-glass` — panel con blur saturado.
- `.impa-chip`, `.impa-accent-chip` — pills compactas.

---

## 2. Primitivos (`src/components/ui/`)

Todos están documentados en Storybook bajo `IMPA / Primitives / *`. Para correr:

```bash
npm run storybook
```

| Componente | Variantes | Uso típico |
|---|---|---|
| **`Button`** | `primary`, `cta`, `accent`, `secondary`, `outline`, `ghost`, `soft`, `danger`, `success`, `link`. Sizes `xs`→`xl`, `icon`, `icon-sm`. Shapes `default`/`pill`. | Todo CTA. Pasar `asChild` no soportado aún (usar `ButtonLink` para Next Link). |
| **`Badge`** | `default`, `brand`, `solid`, `outline`, `accent`, `success`, `warning`, `danger`, `info`, `neutral`, `female`, `male`. Con `dot` indicador. | Status, género, urgencia, contadores. |
| **`Card`** + sub-componentes | `tone`: `default` / `warm` / `tinted` / `accent`. Flags `elevated`, `interactive`. | Toda superficie agrupadora. `tone="warm"` para gallery pública. |
| **`Modal`** | sizes `sm`→`full`. Con/sin title, description, footer. | Modales con header/footer estructurados. |
| **`ModalPremium`** ⚠️ | API simple `{ open, onClose, width, children }`. | Vistas full-bleed (términos, políticas). Mantenido por compatibilidad; preferir `Modal` para casos nuevos. |
| **`Dialog`** (Radix) | shadcn-compatible. | Cuando se necesita el ecosistema Radix (controlled, custom triggers). |
| **`Tabs`** | `pill` (default), `underline`, `segmented`. | Vet → categorías de salud; filtros segmentados; sub-navegación. |
| **`Pagination`** | Pill activa (rounded-full), ellipsis automático. | Listas/tablas. |
| **`Skeleton`** | Primitivo simple con shimmer. | Componer skeletons feature-specific encima. |
| **`EmptyState`** | `default` / `minimal`. | Listados vacíos, sin resultados. |
| **`Stepper`** 🆕 | `horizontal` / `vertical`, `size` sm/md. | Flujo de adopción ("Tu camino"), seguimiento, esterilizaciones. |
| **`ChatBubble`** + **`ChatThread`** 🆕 | Roles `user` / `agent` / `system`. | Chat coordinador↔adoptante en seguimiento post-adopción. |
| **`Table`** + sub-componentes 🆕 | `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell`, `TableEmpty`. Soporta `minWidth` + `stickyHeader`. | Toda tabla admin. Reemplaza `Th`/`Td` locales y header gradient inline. |
| **`StatusBadge`** 🆕 | Map de `estado` (string) → variante de Badge. Soporta: pendiente, aprobada, en_proceso, completado, programada, recibido, en_investigacion, en_quirofano, complicacion, etc. | Estado de dominio (adopciones, citas, esterilizaciones, documentos, reportes) en lugar de pintar cada uno con clases raw. |

### Componentes deprecados

Quedaron como re-exports con `@deprecated` JSDoc. No usar en código nuevo:

- `Button2` → usar `Button`.
- `CAAMInput`, `CAAMSelect`, `CAAMTextarea`, `CAAMSwitch`, `CAAMNumberInput`,
  `CAAMRazaCombobox`, `CAAMPhotoInput`, `CAAMColorSelectorWrapper` →
  usar los `IMPA*` equivalentes.

---

## 3. Forms (`src/components/form/`)

Inputs IMPA-prefijo, todos con el mismo lenguaje (`rounded-xl`, `border-impa-line`, ring focus verde).
No mezclar con `<input className="...">` raw; usar siempre el primitivo correspondiente.

- `IMPAInput`, `IMPANumberInput`, `IMPATextarea`, `IMPASelect`, `IMPASwitch`.
- `IMPAPhotoInput`, `IMPARazaCombobox`, `IMPAColorSelectorWrapper` para casos específicos.
- `FieldLabel`, `FieldWrapper`, `FormSection`, `FormRow`, `FormGrid` para layout de formularios.

---

## 4. Layouts

- **`Header`** — navbar pública (sticky, scroll-aware con backdrop-blur progresivo).
- **`AdminShell`** — sidebar admin (colapsable, mobile drawer, profile menu, breadcrumb).
- **`HeaderUsr`** — header del dashboard de usuario.
- **`PageHead`** — header de página estándar (title + subtitle + right slot).
- **`FooterNewsletter`** — footer público.

---

## 5. Pautas de uso

### Vista pública (landing, gallery, nosotros, reportar maltrato)
- Fondo `.impa-page-bg-warm` o `.impa-hero-mesh-warm` para secciones cálidas tipo gallery.
- Cards `tone="warm"`.
- Botones `variant="cta" shape="pill"` para CTAs principales.

### Admin dashboards
- Fondo `bg-impa-bg` (ya lo aplica `AdminShell`).
- Cards `tone="default"` con `elevated` para KPI/destacados.
- `StatCard` para métricas (ya con sparkline). Mantener.
- Tabs `variant="pill"` para sub-navegación interna.

### Usuario (mis-mascotas, citas, esterilizaciones, seguimiento)
- Misma base que admin pero más emocional: mezclar cards `tone="tinted"` para secciones con foto de mascota.
- `Stepper horizontal` para "Tu camino hacia la adopción".
- `ChatThread` para comunicación con coordinador.

---

## 6. Referencias Stitch

5 designs originales descargados en `.stitch-refs/`:

1. `01-landing.png` — IMPA Institutional Landing Page
2. `02-adoptions.png` — IMPA Pet Adoptions Gallery
3. `03-admin.png` — IMPA Admin Dashboard Overview
4. `04-vet.png` — IMPA Veterinary Management Screen
5. `05-progress.png` — IMPA Adopter Progress Dashboard

Estos screens son la **referencia inspiracional**, no un blueprint a copiar. El sistema implementado
es más rico (sparklines animados, scroll-aware navbar, breadcrumb, search con kbd, hover lifts, etc.).

---

## 7. Roadmap fases siguientes

**Fase 2 — Admin shell + dashboards ✅ COMPLETADA**
- ✅ `<StatCard>` extendido con `tone="accent"` (callout cálido) + `delta` badge (`+12%` / `-5%` estilo Stitch).
- ✅ "Documentos pendientes" usa `tone="accent"` (callout amarillo).
- ✅ `ActivityItem.colorByTipo` y `accentClasses` del dashboard migrados a tokens IMPA (`bg-impa-warning-soft`, `bg-impa-info-soft`, `bg-impa-accent-soft`).
- ✅ Primitivo `<Table>` + sub-componentes en `src/components/ui/Table.tsx`.
- ✅ `<StatusBadge>` central con map para todos los estados de dominio (adopciones, citas, esterilizaciones, documentos, reportes, plásticas).
- ✅ `AdopcionesTable` refactorizada al nuevo Table (ejemplo canónico — 314→232 líneas, sin duplicación Th/Td/EstadoBadge).
- ✅ `AdopcionesKPIs` y `CitasVeterinariasKPIs` migrados a chips tokenizados.
- ✅ `EsterilizacionEstadoBadge` y `CitasVeterinariasEstadoBadge` son thin wrappers de `<StatusBadge>` (preservan API público).
- ✅ `CitasVeterinariasPanelLateral` rediseñado (calendario + próximas citas con StatusBadge, EmptyState).

**Migración gradual pendiente (Fase 2.5 — opcional, no bloqueante):**
- `MascotasTable`, `DocumentosTable`, `CitasVeterinariasTablaAdmin`, etc. — los demás 5+ tables pueden migrar a `<Table>` cuando se toquen. La paleta visual ya es consistente porque `<StatusBadge>` se aplicó vía los wrappers de badge.
- Cuando el backend exponga deltas (week-over-week), pasar `delta={{ label: "+12%", trend: "up" }}` a los `<StatCard>` de StatsGrid.

**Fase 3 — Vista pública + usuario**
- Landing: integrar `bg-impa-mesh-warm` en hero, accent chip para stat banner.
- Adoptions Gallery: pasar a fondo `.impa-page-bg-warm`, cards `tone="warm"`, `Button shape="pill"` en CTAs.
- Adopter Progress: integrar `<Stepper>` horizontal + `<ChatThread>` en `/dashboards/usuario/adopcion`.
- Vet form: `<Tabs variant="pill">` para "Categoría de Salud".

---

## 8. Comandos útiles

```bash
npm run dev          # Next.js dev server
npm run storybook    # Storybook en http://localhost:6006
npm run build        # production build
npm run test         # vitest
```
