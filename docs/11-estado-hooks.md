# 11 - Gestion de Estado, Hooks y Validaciones

---

## 1. Gestion de Estado

El sistema usa diferentes mecanismos de estado segun el tipo de dato:

| Tipo de estado | Herramienta | Uso |
|---------------|-------------|-----|
| Estado del servidor (cache) | TanStack Query v5 | Datos de Supabase, listas, detalles |
| Estado de formularios | React Hook Form | Formularios con validacion |
| Estado de sesion cliente | AuthContext + Supabase | User actual en el browser |
| Estado de UI local | useState / useReducer | Modales, tabs, toggles |
| Estado de realtime | Supabase + TanStack invalidation | Dashboard stats en vivo |
| Notificaciones | Sonner (toasts) | Feedback de operaciones |

---

## 2. TanStack Query (React Query v5)

TanStack Query gestiona todo el estado del servidor: fetching, caching, sincronizacion
y actualizaciones optimistas.

### Configuracion Global

**Archivo:** `src/app/providers.tsx`

```tsx
const [queryClient] = useState(() => new QueryClient())
// QueryClientProvider envuelve toda la aplicacion
```

### Patron de Queries

Cada modulo define sus queries en el directorio `queries/` o directamente en los hooks:

```typescript
// Ejemplo: useMascotasInfiniteQuery
useInfiniteQuery({
  queryKey: ['mascotas', filtros],
  queryFn: ({ pageParam }) => fetchMascotas({ ...filtros, page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})
```

### Patron de Mutations

Las mutaciones llaman a Server Actions y luego invalidan el cache:

```typescript
const mutation = useMutation({
  mutationFn: (data) => crearMascota(data),  // Server Action
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['mascotas'] })
    toast.success('Mascota creada exitosamente')
  },
  onError: (error) => {
    toast.error(error.message)
  }
})
```

### Query Keys por Modulo

| Modulo | Query Key |
|--------|-----------|
| Dashboard | ['dashboard', 'stats'] |
| Mascotas | ['mascotas', filtros] |
| Mascota individual | ['mascota', id] |
| Adopciones | ['adopciones', filtros] |
| Solicitudes | ['solicitudes', filtros] |
| Citas adopcion | ['citas', 'adopcion', filtros] |
| Citas veterinarias | ['citas', 'veterinarias', filtros] |
| Esterilizaciones | ['esterilizaciones', filtros] |
| Platicas | ['platicas', filtros] |
| Reportes maltrato | ['reportes', filtros] |
| Seguimiento | ['seguimiento', adopcionId] |
| Usuarios | ['usuarios', filtros] |
| Perfil | ['perfil', userId] |

---

## 3. Realtime con Supabase

El dashboard del administrador actualiza sus estadisticas en tiempo real usando
Supabase Realtime (WebSocket sobre PostgreSQL LISTEN/NOTIFY).

### Hook: useDashboardRealtime

**Archivo:** `src/features/admin/hooks/useDashboardRealtime.ts`

Escucha cambios en 6 tablas criticas y cuando detecta cualquier cambio
(INSERT, UPDATE, DELETE), invalida el cache de TanStack Query:

- mascotas
- citas_adopcion
- citas_veterinarias
- perfiles
- documentos
- esterilizaciones

```typescript
supabase
  .channel('dashboard-stats-realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'mascotas' },
    () => queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
  )
  // ... demas tablas
  .subscribe()
```

### Hook: useActividadRealtime

Similar al anterior pero para la lista de actividad reciente del dashboard.

---

## 4. Hooks Personalizados Globales

**Directorio:** `src/hooks/`

| Hook | Descripcion | Parametros |
|------|-------------|-----------|
| useBodyScrollLock | Bloquea el scroll del body (para modales) | isLocked: boolean |
| useInfiniteScroll | Implementa infinite scroll con IntersectionObserver | ref, hasNextPage, fetchNextPage |
| useIsMobile | Detecta si el viewport es movil | — |
| usePagination | Logica de paginacion (pagina actual, total, cambio) | totalItems, itemsPerPage |
| useSoftToast | Toast no intrusivo de duracion corta | — |
| useToast | Gestiona toasts con estado y acciones | — |

---

## 5. Hooks por Feature (Principales)

### Feature: admin

| Hook | Descripcion |
|------|-------------|
| useDashboardStats | Stats del sistema via TanStack Query |
| useDashboardRealtime | Realtime para stats |
| useActividadReciente | Lista de actividad reciente |
| useActividadRealtime | Realtime para actividad |

### Feature: mascotas

| Hook | Descripcion |
|------|-------------|
| useMascotasInfiniteQuery | Feed de mascotas con scroll infinito |
| useMascotaQuery | Datos de una mascota |
| useCreateMascota | Crear mascota (mutation) |
| useUpdateMascota | Actualizar mascota (mutation) |
| useDeleteMascota | Eliminar mascota (mutation) |

### Feature: adopciones

| Hook | Descripcion |
|------|-------------|
| useAdopcionesQuery | Lista de adopciones |
| useProcesoAdopcion | Estado del proceso de adopcion activo |
| useCancelarAdopcion | Cancelar solicitud |
| useSubirDocumento | Subir documento al bucket |

### Feature: citas

| Hook | Descripcion |
|------|-------------|
| useCitas | Lista de citas |
| useAgendarCitaFlow | Flujo completo de agendamiento de cita |
| useCalendarioCitaVeterinaria | Datos para el calendario |
| useCancelarCita | Cancelar una cita |
| useEvaluarCita | Evaluar asistencia e interaccion |
| useHorasOcupadasQuery | Slots de tiempo ya reservados |

---

## 6. AuthContext

**Archivo:** `src/context/AuthContext.tsx`

Provee el usuario actual al arbol de componentes cliente.

```typescript
const { user, loading } = useAuth()
```

**Importante:** Este contexto es solo para UI condicional (mostrar/ocultar botones,
nombres de usuario, etc.). La autorizacion real siempre ocurre server-side
mediante `requireRole()` y `requireSession()`.

---

## 7. Validaciones con Zod

Todos los formularios del sistema tienen schemas de validacion en Zod.

### Estructura de un Schema

```typescript
// Ejemplo: src/features/mascotas/schemas/mascotas-schemas.ts
import { z } from 'zod'

export const mascotaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  sexo: z.enum(['macho', 'hembra']),
  edad: z.string().optional(),
  peso_kg: z.number().positive().optional(),
  // ...
})

export type MascotaForm = z.infer<typeof mascotaSchema>
```

### Validacion en Formularios (cliente)

React Hook Form + hookform/resolvers ejecuta la validacion en tiempo real
mientras el usuario escribe, mostrando errores inline.

### Validacion en Server Actions (servidor)

Las mismas validaciones se ejecutan en el servidor antes de cualquier
operacion de base de datos, garantizando seguridad incluso sin JavaScript.

### Schemas con Tests Unitarios

Los siguientes schemas tienen tests unitarios en Vitest:

| Schema | Archivo de test |
|--------|----------------|
| adopciones schemas | src/features/adopciones/schemas/adopciones-schemas.test.ts |
| mascotas schemas | src/features/mascotas/schemas/mascotas-schemas.test.ts |
| razas schemas | src/features/mascotas/schemas/razas-schemas.test.ts |
| usuarios schemas | src/features/usuarios/schemas/usuarios-schemas.test.ts |

---

## 8. Manejo de Errores

### En el Cliente

- Los errores de mutations de TanStack Query disparan toasts de error via Sonner
- Los errores de validacion de Zod se muestran inline en cada campo del formulario
- Los errores de red se manejan con el estado `isError` de TanStack Query

### En el Servidor

- Los Server Actions retornan objetos `{ success, error, data }` estructurados
- Las API Routes responden con codigos HTTP apropiados (400, 401, 403, 500)
- Los errores inesperados son capturados y logueados via `src/lib/logger.ts`

### Paginas de Error de Next.js

- `error.tsx` en el App Router maneja errores de renderizado de Server Components
- `loading.tsx` muestra skeletons mientras se cargan datos
