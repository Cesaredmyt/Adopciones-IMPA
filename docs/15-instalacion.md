# 15 - Instalacion y Configuracion Local

---

## Prerequisitos

| Herramienta | Version minima | Instalacion |
|-----------|---------------|-------------|
| Node.js | 20.x LTS | nodejs.org |
| npm | 10.x | (incluido con Node.js) |
| Git | 2.x | git-scm.com |
| Supabase CLI | 2.x | supabase.com/docs/guides/cli |
| Docker Desktop | 4.x (opcional) | docker.com |

---

## 1. Clonar el Repositorio

```bash
git clone https://github.com/[organizacion]/adopciones-impa.git
cd adopciones-impa
```

---

## 2. Instalar Dependencias

```bash
npm install
```

---

## 3. Configurar Variables de Entorno

Crea el archivo `.env.local` en la raiz del proyecto:

```bash
# En Windows
copy .env.example .env.local

# En Mac/Linux
cp .env.example .env.local
```

Completa los valores en `.env.local` (ver seccion de Variables de Entorno
en [12-infraestructura.md](./12-infraestructura.md)).

### Variables minimas para desarrollo

Para desarrollo local sin funcionalidad de email ni rate limiting, solo
necesitas las variables de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=[tu-url-supabase]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
NEXT_PUBLIC_SITE_URL=http://localhost:3000
INTERNAL_API_SECRET=[cualquier-secreto-para-desarrollo]
```

---

## 4. Configurar Supabase

### Opcion A: Usar Supabase Cloud (recomendado)

1. Crea una cuenta en supabase.com
2. Crea un nuevo proyecto
3. Copia las credenciales (URL, anon key, service role key) a `.env.local`
4. En el SQL Editor del dashboard, ejecuta los schemas:
   - `esterilizaciones-schema.sql`
   - `platicas-schema.sql`
   - `reportes-maltrato-schema.sql`
5. Crea manualmente las tablas restantes o ejecuta los SQL de las migraciones

### Opcion B: Usar Supabase Local

```bash
# Iniciar Supabase local (requiere Docker)
supabase start

# Ver credenciales locales
supabase status

# Copiar las credenciales locales a .env.local
```

---

## 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicacion estara disponible en: http://localhost:3000

---

## 6. Crear el Primer Usuario Administrador

1. Registrate en http://localhost:3000/register
2. Verifica tu email (en desarrollo local puedes ver los emails en Supabase Studio -> Inbucket)
3. En el SQL Editor de Supabase, ejecuta:

```sql
-- Cambiar rol del usuario a administrador (rol_id = 1)
UPDATE public.perfiles
SET rol_id = 1
WHERE email = 'tu-email@ejemplo.com';
```

4. Cierra sesion y vuelve a iniciar sesion para refrescar la cookie de rol

---

## 7. Correr Tests

```bash
# Modo watch
npm run test

# Ejecucion unica
npm run test:run
```

---

## 8. Levantar Storybook

```bash
npm run storybook
# http://localhost:6006
```

---

## 9. Build de Produccion

```bash
# Build de Next.js
npm run build

# Iniciar en modo produccion
npm run start
```

---

## 10. Levantar con Docker (local)

```bash
# Construir imagen
docker-compose build

# Levantar
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down
```

> Asegurate de que `.env.local` existe y tiene todas las variables antes de correr Docker.

---

## 11. Datos Iniciales (Seed)

El archivo `supabase/seed.sql` contiene datos iniciales de prueba.

```bash
# Con Supabase local
supabase db reset  # Aplica migrations + seed

# O manualmente en el SQL Editor
# Pega el contenido de supabase/seed.sql
```

---

## 12. Comandos de Desarrollo Utiles

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Ejecutar linting
npm run lint

# Generar tipos desde Supabase (requiere Supabase CLI)
supabase gen types typescript --linked > src/types/database.types.ts

# Ver el schema de la base de datos
supabase db dump --schema public
```
