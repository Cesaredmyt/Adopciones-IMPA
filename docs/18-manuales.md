# 18 - Manuales Tecnico y de Usuario

---

# PARTE A: Manual Tecnico

## 1. Convenciones del Codigo

### Nombrado

| Contexto | Convencion | Ejemplo |
|----------|-----------|---------|
| Componentes React | PascalCase | MascotaCard.tsx |
| Hooks | camelCase con "use" | useMascotasQuery.ts |
| Server Actions | camelCase descriptivo | crearMascota.ts |
| Schemas Zod | camelCase + Schema | mascotaSchema |
| Tipos TypeScript | PascalCase | MascotaRow |
| Utilidades | camelCase | formatAge.ts |
| Archivos de queries | camelCase | mascotas-queries.ts |
| Constantes | UPPER_SNAKE_CASE | ROLES |

### Estructura de un Server Action

Los Server Actions siguen una estructura consistente:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole, ROLES } from '@/lib/auth/requireRole'

export async function crearMascota(data: MascotaInsert) {
  // 1. Validar sesion y rol
  const { user } = await requireRole({
    allow: [ROLES.admin],
    fallback: '/dashboards/usuario'
  })

  // 2. Crear cliente Supabase de servidor
  const supabase = await createClient()

  // 3. Validar datos con Zod (opcional si ya se valido en el cliente)

  // 4. Operacion en BD
  const { data: mascota, error } = await supabase
    .from('mascotas')
    .insert(data)
    .select()
    .single()

  // 5. Manejar error
  if (error) throw new Error(error.message)

  // 6. Retornar resultado
  return mascota
}
```

### Estructura de un Hook de Mutation

```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { crearMascota } from '../actions/mascotas-actions'

export function useCreateMascota() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MascotaInsert) => crearMascota(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mascotas'] })
      toast.success('Mascota registrada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}
```

---

## 2. Agregar un Nuevo Modulo

Para agregar un nuevo modulo al sistema, seguir estos pasos:

### Paso 1: Crear la estructura del feature

```
src/features/[nombre-modulo]/
  actions/
    [nombre-modulo]-actions.ts
  components/
    client/
      [Nombre]Table.tsx
      [Nombre]Form.tsx
  hooks/
    use[Nombre]Query.ts
    use[Nombre]Mutation.ts
  queries/
    [nombre-modulo]-queries.ts
  schemas/
    [nombre-modulo]-schemas.ts
    [nombre-modulo]-schemas.test.ts
  types/
    [nombre-modulo].ts
```

### Paso 2: Crear la tabla en Supabase

1. Definir el schema SQL con la tabla, enums, indices y politicas RLS
2. Ejecutar en el SQL Editor de Supabase
3. Agregar la tabla al archivo `src/lib/supabase/database.ts` (si se generan tipos)

### Paso 3: Crear las rutas de pagina

1. Agregar pagina en `src/app/dashboards/administrador/[modulo]/page.tsx`
2. Agregar pagina en `src/app/dashboards/usuario/[modulo]/page.tsx` (si aplica)
3. Proteger con `requireRole()` en el layout o la pagina

### Paso 4: Agregar enlace en la navegacion

Actualizar el menu de navegacion del dashboard en los componentes de layout.

### Paso 5: Agregar emails si el modulo los requiere

1. Crear template en `src/app/api/email/templates/[nombre-evento].ts`
2. Crear ruta en `src/app/api/email/[nombre-evento]/route.ts`
3. Llamar al endpoint desde el Server Action correspondiente

---

## 3. Enviar un Email Manualmente

Para enviar un email desde un Server Action:

```typescript
// En el Server Action, despues de la operacion exitosa:
await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/[tipo-evento]`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-internal-secret': process.env.INTERNAL_API_SECRET!
  },
  body: JSON.stringify({
    email: destinatario,
    nombre: nombreUsuario,
    // ...datos especificos del template
  })
})
```

---

## 4. Agregar una Politica RLS

Ejemplo para proteger una nueva tabla:

```sql
-- Habilitar RLS
ALTER TABLE nueva_tabla ENABLE ROW LEVEL SECURITY;

-- Admin tiene todo acceso
CREATE POLICY "nueva_tabla_admin_all" ON nueva_tabla
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol_id = 1
    )
  );

-- Usuario solo lee sus registros
CREATE POLICY "nueva_tabla_usuario_read" ON nueva_tabla
  FOR SELECT
  USING (usuario_id = auth.uid());
```

---

# PARTE B: Manual de Usuario

## 1. Como Registrarse

1. Ve a la pagina principal del sistema
2. Haz clic en "Registrarse"
3. Ingresa tu nombre completo, email y contrasena
4. Acepta los terminos y condiciones
5. Haz clic en "Crear cuenta"
6. Revisa tu correo y haz clic en el enlace de verificacion
7. Tu cuenta esta lista. Inicia sesion para acceder

---

## 2. Como Ver las Mascotas Disponibles

1. Desde tu dashboard, ve a "Mascotas"
2. Usa los filtros para buscar por especie, tamano o raza
3. Haz clic en una mascota para ver su ficha completa
4. Si te interesa, haz clic en "Solicitar adopcion"

---

## 3. Como Solicitar la Adopcion de una Mascota

1. Encuentra la mascota que te interesa en el catalogo
2. Haz clic en "Solicitar adopcion"
3. Llena el formulario con:
   - Por que quieres adoptar esta mascota
   - Tu experiencia con mascotas
   - Descripcion de tu hogar y espacio disponible
   - Si tienes otras mascotas actualmente
   - Tu plan de cuidados y presupuesto estimado
4. Acepta los compromisos de cuidado y seguimiento
5. Envia la solicitud
6. Recibiras un email de confirmacion con tu numero de solicitud

---

## 4. Como Subir tus Documentos

Una vez que tu solicitud sea aprobada, el sistema te pedira documentos:

1. En tu dashboard, ve a "Mi Adopcion"
2. La seccion de documentos estara activa
3. Sube los documentos solicitados (INE, comprobante de domicilio, etc.)
4. El formato aceptado es PDF o imagen (JPG, PNG)
5. Espera la revision del administrador (te llegara email con el resultado)

---

## 5. Como Solicitar una Esterilizacion

Solo disponible para mascotas que ya hayas adoptado:

1. Ve a "Esterilizaciones" en tu dashboard
2. Haz clic en "Nueva solicitud"
3. Selecciona la mascota
4. Ingresa el peso aproximado y cualquier observacion
5. Envia la solicitud
6. El administrador la revisara y te notificara por email

---

## 6. Como Reportar un Caso de Maltrato

No necesitas sesion para reportar:

1. Ve a la pagina principal y haz clic en "Reportar maltrato"
2. (Opcional) Ingresa tu nombre y datos de contacto
3. Describe el incidente: asunto, descripcion, direccion, fecha
4. Selecciona la gravedad del caso
5. Sube fotos como evidencia si las tienes
6. Envia el reporte
7. Guarda el folio que te aparece en pantalla para dar seguimiento

### Como dar seguimiento a tu reporte

1. Ve a la pagina de seguimiento de reportes
2. Ingresa tu folio (formato: REP-01000)
3. Ingresa tu email o telefono de contacto
4. Podras ver el estado actual del caso

---

## 7. Como Solicitar una Platica de Concientizacion

1. En tu dashboard, ve a "Platicas"
2. Haz clic en "Solicitar platica"
3. Ingresa:
   - Tipo de lugar (escuela, empresa, colonia, etc.)
   - Nombre y direccion del lugar
   - Numero estimado de asistentes
   - Fecha tentativa deseada
   - Datos de contacto
4. Envia la solicitud
5. El equipo de IMPA revisara y te contactara para confirmar

---

## 8. Como Ver el Seguimiento de tu Adopcion

1. En tu dashboard, ve a "Seguimiento"
2. Podras ver todas las visitas de seguimiento programadas y realizadas
3. Cada visita incluye fotos del estado actual de tu mascota y recomendaciones
