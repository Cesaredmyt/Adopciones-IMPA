# 08 - Storage y Gestion de Archivos

---

## 1. Proveedor de Storage

El sistema utiliza **Supabase Storage** para almacenar todos los archivos del sistema.
Supabase Storage es compatible con el protocolo S3 y sirve archivos via CDN publico.

**URL base de acceso:**
`https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]`

---

## 2. Buckets Configurados

| Bucket | ID | Publico | Limite de tamano | Tipos permitidos |
|--------|-----|---------|-----------------|-----------------|
| adopciones | adopciones | Si | 5 MB | Sin restriccion |
| documentos_adopcion | documentos_adopcion | Si | Sin limite | Sin restriccion |
| logos | logos | Si | Sin limite | Sin restriccion |
| mascotas-imagenes | mascotas-imagenes | Si | Sin limite | Sin restriccion |
| mascotas-qr | mascotas-qr | Si | Sin limite | Sin restriccion |
| reportes-maltrato | reportes-maltrato | Si | Sin limite | Sin restriccion |
| seguimineto | seguimineto | Si | Sin limite | Sin restriccion |

> Nota: El bucket "seguimineto" tiene un error tipografico (falta la "g"). El nombre correcto deberia ser "seguimiento".

---

## 3. Uso por Modulo

| Modulo | Bucket | Tipo de archivo | Descripcion |
|--------|--------|----------------|-------------|
| Mascotas (foto) | mascotas-imagenes | Imagen (JPG, PNG, WebP) | Foto principal de la mascota |
| Mascotas (QR) | mascotas-qr | Imagen PNG | Codigo QR generado automaticamente |
| Adopciones (hogar) | adopciones | Imagen (JPG, PNG) | Fotos del hogar del adoptante |
| Documentos | documentos_adopcion | PDF / Imagen | INE, comprobante de domicilio, etc. |
| Reportes maltrato | reportes-maltrato | Imagen / Video | Evidencias fotograficas del incidente |
| Seguimiento | seguimineto | Imagen (JPG, PNG) | Fotos del animal en su nuevo hogar |
| Logos | logos | Imagen (SVG, PNG) | Logos institucionales |

---

## 4. Implementacion de Subida de Archivos

### Subida de imagen de mascota

**Archivo:** `src/features/mascotas/utils/` (uploadMascotaArchivos)

La subida de imagen se realiza desde el cliente con el cliente browser de Supabase.
Se genera un nombre unico con `uuid` para evitar colisiones:

```
mascotas-imagenes/
  [uuid].jpg
  [uuid].png
```

### Generacion y subida de QR

**Archivo:** `src/features/mascotas/utils/` (uploadMascotaQR)

1. Se genera el QR como imagen PNG usando la libreria `qrcode`
2. El QR contiene la URL publica `/mascota/[id]`
3. Se sube al bucket `mascotas-qr` con el nombre `[mascota_id].png`
4. La URL se guarda en `mascotas.qr_code`

### Subida de documentos de adopcion

**Archivo:** `src/lib/supabase/upload-adopciones.ts`

Subida de documentos del proceso de adopcion al bucket `documentos_adopcion`.
La URL se guarda en la tabla `documentos`.

### Subida de evidencias de reporte

**Archivo:** `src/features/reportes-maltrato/utils/` (uploadEvidence)

Las evidencias se suben al bucket `reportes-maltrato`.
El bucket permite subida publica (incluso sin sesion) para reportes anonimos.

---

## 5. Politicas de Seguridad de Storage

### Bucket: mascotas-imagenes, mascotas-qr (lectura publica)

Todos los buckets estan configurados como **publicos**, lo que significa que
cualquier persona con la URL puede ver el archivo. Esto es intencional para
que las fichas de mascotas sean accesibles publicamente via QR.

### Bucket: reportes-maltrato (RLS explicita)

Este bucket tiene politicas RLS explicitas adicionales:

- **INSERT:** Cualquier visitante (anonimo o autenticado) puede subir evidencias
- **SELECT:** Cualquier visitante puede ver las evidencias
- **DELETE:** Solo usuarios con rol_id = 1 (admin) pueden eliminar

### Bucket: documentos_adopcion

Los documentos de adopcion son publicados como URL en la tabla `documentos`.
El acceso logico se controla via RLS en la tabla, no en el bucket directamente.

---

## 6. Limpieza de Archivos

Cuando una mascota es eliminada, el sistema llama a funciones de limpieza:

- `deleteMascotaImagen()` — Elimina la imagen del bucket `mascotas-imagenes`
- `deleteMascotaQR()` — Elimina el QR del bucket `mascotas-qr`

**Archivos:** `src/features/mascotas/actions/`

---

## 7. Notas de Configuracion

### Limite de tamano en Server Actions

`next.config.mjs` configura un limite de **5 MB** para el body de Server Actions:

```
experimental.serverActions.bodySizeLimit = "5mb"
```

Esto aplica a las subidas de archivos via Server Actions.
Para archivos mas grandes, se usa subida directa al cliente de Supabase.

### Imagenes remotas de Supabase en Next.js

`next.config.mjs` configura los patrones de imagenes remotas permitidos:

```
remotePatterns: [
  {
    protocol: "https",
    hostname: "**.supabase.co",
    pathname: "/storage/v1/object/public/**"
  }
]
```

Esto permite usar el componente `<Image>` de Next.js con URLs de Supabase Storage.
La optimizacion de imagenes esta deshabilitada (`unoptimized: true`) para
compatibilidad con el output standalone de Docker.
