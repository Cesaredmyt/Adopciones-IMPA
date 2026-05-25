# 19 - Riesgos Tecnicos, Deuda Tecnica y Mejoras Futuras

---

## 1. Riesgos Tecnicos Identificados

### CRITICO — Credenciales hardcodeadas en Edge Function

| Campo | Detalle |
|-------|---------|
| Archivo | supabase/functions/send-email/index.ts (lineas 8-11) |
| Severidad | CRITICA |
| Tipo | Exposicion de credenciales |
| Descripcion | Las credenciales de EmailJS (serviceID, templateID, publicKey) estan escritas directamente en el codigo fuente en texto plano |
| Riesgo | Si el repositorio es publico o se comparte, cualquier persona puede usar las credenciales para enviar emails a nombre de la organizacion o agotar la cuota del servicio |
| Solucion | Mover las credenciales a variables de entorno de Supabase Functions: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY |

---

### ALTO — Build ignora errores de TypeScript y ESLint

| Campo | Detalle |
|-------|---------|
| Archivo | next.config.mjs |
| Severidad | ALTA |
| Descripcion | typescript.ignoreBuildErrors = true y eslint.ignoreDuringBuilds = true permiten que el build de produccion complete incluso con errores de tipos y reglas de linting |
| Riesgo | Se pueden desplegar builds con bugs de tipo que en tiempo de ejecucion causan errores |
| Solucion | Remover estas opciones progresivamente: primero corregir los errores de TS/ESLint existentes y luego eliminar las flags |

---

### ALTO — Migraciones de BD ausentes del repositorio

| Campo | Detalle |
|-------|---------|
| Severidad | ALTA |
| Descripcion | La carpeta supabase/migrations/ esta vacia. Solo existen 3 archivos SQL en la raiz del proyecto |
| Riesgo | Si se pierde el proyecto de Supabase (eliminacion accidental, cambio de plan, etc.), no hay forma de recrear la base de datos completa desde el repositorio |
| Solucion | Generar migrations completas con: supabase db dump --schema public > supabase/migrations/0001_schema_completo.sql y agregarlas al repositorio |

---

### MEDIO — docker-compose sin restart policy ni healthcheck

| Campo | Detalle |
|-------|---------|
| Archivo | docker-compose.yml |
| Severidad | MEDIA |
| Descripcion | El contenedor no tiene restart: unless-stopped ni healthcheck configurado |
| Riesgo | Si el contenedor falla, no se reinicia automaticamente hasta intervencion manual |
| Solucion | Agregar al servicio: restart: unless-stopped y un healthcheck basico |

---

### MEDIO — Buckets de Storage sin restriccion de tipos MIME

| Campo | Detalle |
|-------|---------|
| Severidad | MEDIA |
| Descripcion | Todos los buckets tienen allowed_mime_types = null (sin restriccion) |
| Riesgo | Se podrian subir archivos de tipos no esperados (ejecutables, scripts) |
| Solucion | Configurar tipos MIME permitidos segun el bucket: imagenes para mascotas y seguimiento, PDF/imagenes para documentos |

---

### MEDIO — Buckets sin limite de tamano (excepto adopciones)

| Campo | Detalle |
|-------|---------|
| Severidad | MEDIA |
| Descripcion | Solo el bucket "adopciones" tiene limite de 5 MB. Los demas no tienen limite |
| Riesgo | Usuarios podrian subir archivos muy grandes agotando el storage o aumentando costos |
| Solucion | Configurar limites apropiados: 5-10 MB para imagenes, 15-20 MB para documentos PDF |

---

### BAJA — Nombre incorrecto del bucket "seguimineto"

| Campo | Detalle |
|-------|---------|
| Severidad | BAJA |
| Descripcion | El bucket se llama "seguimineto" (falta la "g", deberia ser "seguimiento") |
| Riesgo | Bajo. El sistema funciona, pero el nombre es confuso para futuros desarrolladores |
| Solucion | Crear nuevo bucket "seguimiento" correctamente escrito, migrar archivos existentes y actualizar referencias en el codigo |

---

## 2. Deuda Tecnica

### ALTA — types de base de datos incompletos

**Archivo:** src/lib/supabase/database.ts

Solo define el tipo "perfiles". El resto de las tablas (mascotas, adopciones, citas, etc.)
no tienen tipos TypeScript generados. Esto significa que las queries no tienen
inferencia de tipos automatica de Supabase.

**Solucion:** Generar tipos automaticamente con el CLI:
```bash
supabase gen types typescript --linked > src/types/database.types.ts
```
Y usar el tipo generado como parametro del cliente de Supabase.

---

### ALTA — Cobertura de tests insuficiente

Solo 5 archivos de test para un proyecto de 300+ archivos.
Las suites actuales cubren unicamente schemas Zod y una utilidad.
No hay tests para Server Actions, hooks, componentes, flujos de autenticacion ni E2E.

---

### MEDIA — Sistema dual de email sin consolidar

El sistema usa dos proveedores de email simultaneamente:
- Nodemailer + Gmail (en API Routes)
- Resend API (presente pero no dominante)
- EmailJS (en la Edge Function)

No hay una fuente unica de verdad para el envio de emails. Esto dificulta
el debugging y el monitoreo.

**Solucion:** Definir un unico proveedor (recomendado: Resend) y eliminar los demas.

---

### MEDIA — Tablas de Better Auth sin documentar ni limpiar

Las tablas account, session, user, verification pertenecen al schema de Better Auth
y estan presentes en la BD pero no son utilizadas por el flujo principal del sistema.
Ocupan espacio y pueden causar confusion.

**Solucion:** Si no se usa Better Auth: eliminar las tablas. Si se planea usarlo en el futuro: documentarlo como sistema alternativo de auth.

---

### BAJA — Componente GlobeCAAM referencia marca diferente

El archivo src/components/GlobeCAAM.tsx referencia la marca CAAM
(Centro de Atencion Animal de Morelia), diferente a IMPA.
Es un vestigio de un proyecto anterior.

---

## 3. Mejoras Futuras Recomendadas

### Corto Plazo (inmediato)

| Mejora | Prioridad | Impacto |
|--------|----------|---------|
| Mover credenciales EmailJS a variables de entorno | CRITICA | Seguridad |
| Agregar migrations al repositorio | ALTA | Recuperabilidad |
| Remover ignoreBuildErrors de next.config.mjs | ALTA | Calidad de codigo |
| Configurar limites MIME y tamano en buckets | ALTA | Seguridad |
| Generar tipos de DB con Supabase CLI | ALTA | Developer Experience |
| Corregir nombre del bucket "seguimineto" | MEDIA | Mantenibilidad |

### Mediano Plazo

| Mejora | Descripcion |
|--------|-------------|
| Ampliar cobertura de tests | Agregar tests para Server Actions, hooks criticos y flujos E2E con Playwright |
| Consolidar sistema de email | Migrar todo a Resend (un solo proveedor) |
| Notificaciones en tiempo real al usuario | Usar Supabase Realtime tambien en el dashboard del usuario |
| Panel de historial medico | Interfaz completa para gestionar la tabla historial_medico |
| Configurar restart policy en Docker | restart: unless-stopped + healthcheck en docker-compose.yml |
| Eliminar tablas de Better Auth | Limpiar tablas no utilizadas de la BD |

### Largo Plazo

| Mejora | Descripcion |
|--------|-------------|
| Aplicacion movil | App para adoptantes con notificaciones push |
| Mapa de incidentes | Visualizacion geografica de reportes de maltrato en Morelia |
| Portal de voluntarios | Modulo para gestionar voluntarios de IMPA |
| Integracion con veterinarias | Conexion con clinicas veterinarias externas |
| Estadisticas avanzadas | Reportes graficos de adopciones, esterilizaciones, etc. |
| Chat en tiempo real | Comunicacion directa adoptante-administrador |
| Sistema de donaciones completo | Integracion activa con MercadoPago para donaciones |
| Acceso offline (PWA) | Capacidades de Progressive Web App para uso sin internet |

---

## 4. Notas para el Equipo de Desarrollo

### Antes de hacer un deploy

1. Verificar que todas las variables de entorno esten configuradas
2. Asegurar que no hay errores en los tests: npm run test:run
3. Verificar que el build compila: npm run build
4. Revisar que las migrations esten aplicadas en la BD de produccion

### Convenciones de ramas Git

- main: rama estable de produccion
- godav: rama de desarrollo activo (equivalente a develop)
- feature/[nombre]: ramas de features individuales
- fix/[nombre]: ramas de correcciones

### Agregar nueva variable de entorno

1. Agregar al archivo .env.local
2. Documentar en docs/12-infraestructura.md (seccion Variables de Entorno)
3. Agregar al workflow tests.yml si es necesaria para el CI
4. Si es publica (NEXT_PUBLIC_*), agregar tambien al template .env.example
