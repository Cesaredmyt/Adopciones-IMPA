# 13 - Design System y UX/UI

---

## 1. Design System IMPA

El sistema cuenta con un **Design System propio** documentado en `DESIGN_SYSTEM.md`.
Esta basado en Tailwind CSS v4 con tokens personalizados y primitivos de UI con Radix.

> Estado actual: Fase 1 completada (tokens + primitivos).

---

## 2. Tokens de Color

### Paleta de Marca (Verde IMPA)

| Token | Valor | Uso |
|-------|-------|-----|
| impa-50 a impa-900 | Escala de verdes | Variantes de la paleta principal |
| impa-500 | #17cf17 | Color primario de marca |
| impa-600 | #11a611 | CTAs, estados activos |
| impa-cta | Gradiente verde | Botones hero/principal |

### Superficies Cool (Admin / Dashboard)

| Token | Descripcion |
|-------|-------------|
| impa-bg | Fondo principal de la app (#f6f8f6) |
| impa-bg-elev | Fondo elevado |
| impa-surface | Superficie de tarjetas |
| impa-surface-2 | Superficie secundaria |
| impa-surface-3 | Superficie terciaria |
| impa-tinted | Superficie con tinte de marca |

### Superficies Warm (Vista Publica)

| Token | Descripcion |
|-------|-------------|
| impa-cream | Fondo calido para landing (#faf5ef) |
| impa-cream-2 | Cream secundario |
| impa-cream-3 | Cream terciario |

### Accent (Amarillo)

| Token | Descripcion |
|-------|-------------|
| impa-accent | Amarillo #f5c842 para callouts |
| impa-accent-soft | Version suave |
| impa-accent-strong | Version intensa |
| impa-accent-ink | Para texto sobre accent |

### Texto

| Token | Descripcion |
|-------|-------------|
| impa-text | Texto principal |
| impa-text-strong | Texto prominente |
| impa-muted | Texto secundario |
| impa-subtle | Texto terciario |
| impa-quiet | Texto decorativo muy suave |

### Bordes

| Token | Descripcion |
|-------|-------------|
| impa-line | Borde estandar |
| impa-line-strong | Borde prominente |
| impa-line-faint | Borde muy suave |

### Feedback (Semanticos)

| Token | Uso |
|-------|-----|
| impa-success | Exito (con -soft e -ink) |
| impa-warning | Advertencia |
| impa-danger | Error / peligro |
| impa-info | Informacion |

---

## 3. Sombras

| Token | Uso |
|-------|-----|
| shadow-impa-xs a shadow-impa-xl | Jerarquia de sombras |
| shadow-impa-glow | Resplandor verde de marca |
| shadow-impa-accent-glow | Resplandor amarillo |

---

## 4. Border Radius

| Contexto | Valor |
|---------|-------|
| Inputs / chips | rounded-lg (8px) o rounded-xl (12px) |
| Cards / modales / paneles | rounded-2xl (16px) |
| Pills, badges, paginacion, avatares | rounded-full |

---

## 5. Animaciones

### Easings personalizados
- ease-impa, ease-impa-out, ease-impa-in

### Duraciones
- impa-duration-fast: 140ms
- impa-duration: 220ms
- impa-duration-slow: 320ms

### Keyframes disponibles
- animate-fade-in
- animate-fade-up
- animate-fade-slide
- animate-scale-in
- animate-floating
- heartbeat
- soft-bounce
- impa-shimmer
- impa-pulse-ring
- stagger-item

---

## 6. Fondos Compuestos

| Token | Uso |
|-------|-----|
| bg-impa-mesh | Hero verde (default landing) |
| bg-impa-mesh-warm | Hero cream (galeria publica, secciones suaves) |
| bg-impa-cta | Gradiente CTA verde |

---

## 7. Componentes UI del Design System

### Componentes Primitivos (src/components/ui/)

| Componente | Descripcion |
|-----------|-------------|
| Button | Boton con variantes (primary, secondary, ghost, destructive) |
| Input | Campo de texto con estilos IMPA |
| Select | Selector dropdown |
| Textarea | Area de texto |
| Badge | Etiqueta de estado con colores semanticos |
| StatusBadge | Badge especifico para estados del sistema |
| Card | Contenedor de tarjeta |
| Dialog / Modal | Ventana modal |
| Stepper | Indicador de pasos del proceso |
| Table | Tabla de datos con paginacion |
| Tabs | Navegacion por pestanas |
| Pagination | Control de paginacion |
| Skeleton | Estados de carga |
| EmptyState | Vista de estado vacio |
| ChatBubble | Burbuja de mensaje |
| Calendar | Selector de fecha |
| Checkbox | Casilla de verificacion |
| Label | Etiqueta de campo |
| Popover | Contenido emergente |

### Componentes de Formulario IMPA (src/components/form/)

Wrappers opinionados de los primitivos con estilos IMPA integrados:

| Componente | Descripcion |
|-----------|-------------|
| IMPAInput | Input con label, error y estilos IMPA |
| IMPASelect | Select con opciones tipadas |
| IMPASwitch | Toggle switch |
| IMPATextarea | Area de texto |
| IMPAPhotoInput | Input de foto con preview |
| IMPARazaCombobox | Combobox de busqueda de razas |
| FormGrid | Grid de dos columnas para formularios |
| FormRow | Fila de formulario con espaciado |
| FormSection | Seccion de formulario con titulo |

---

## 8. Layout y Navegacion

### Headers

| Componente | Uso |
|-----------|-----|
| Header | Header general con deteccion de scroll |
| HeaderSmart | Header que oculta al hacer scroll hacia abajo |
| HeaderUsr | Header del dashboard usuario |
| HeaderAd | Header del dashboard administrador |

### Shells de Layout

| Componente | Uso |
|-----------|-----|
| PageShell | Shell de pagina publica con layout estandar |
| AdminShell | Shell del dashboard administrador con sidebar |
| DashboardFooter | Footer de dashboard |

---

## 9. Filosofia de Diseno

### Reglas de la Paleta

- Nunca usar colores Tailwind genericos (red-600, amber-500) si existe un token IMPA equivalente
- El verde impa-500 es el primario
- El gradiente impa-cta solo para botones hero/principal
- El accent amarillo solo para callouts visuales, no botones primarios

### Accesibilidad

- Los componentes base usan **Radix UI** que garantiza accesibilidad ARIA out-of-the-box
- Storybook tiene instalado `@storybook/addon-a11y` para pruebas de accesibilidad en componentes
- Los colores de feedback (success, warning, danger) tienen suficiente contraste

### Responsividad

El sistema esta disenado para ser usable en desktop y tablet.
La deteccion de mobile se hace con el hook `useIsMobile` basado en CSS media queries.
