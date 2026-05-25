# Documentacion Tecnica y Funcional
## Sistema de Adopciones y Gestion Animal — IMPA

**Instituto Municipal de Proteccion Animal**
Morelia, Michoacan, Mexico

---

## Indice General

| Seccion | Archivo | Contenido |
|---------|---------|-----------|
| 01 | [01-introduccion.md](./01-introduccion.md) | Portada, introduccion, objetivo, problematica, alcance |
| 02 | [02-arquitectura.md](./02-arquitectura.md) | Arquitectura general, stack tecnologico, patrones |
| 03 | [03-estructura.md](./03-estructura.md) | Estructura de directorios, rutas, features |
| 04 | [04-autenticacion.md](./04-autenticacion.md) | Auth, roles (admin/usuario), middleware, rate limiting |
| 05 | [05-modulos.md](./05-modulos.md) | 12 modulos funcionales detallados |
| 06 | [06-api-endpoints.md](./06-api-endpoints.md) | 37+ endpoints de API + templates de email |
| 07 | [07-base-de-datos.md](./07-base-de-datos.md) | 22 tablas, enums, triggers, RLS completa |
| 08 | [08-storage.md](./08-storage.md) | 7 buckets de Supabase Storage |
| 09 | [09-emails-certificados.md](./09-emails-certificados.md) | 20+ emails automaticos, PDF, QR |
| 10 | [10-seguridad.md](./10-seguridad.md) | Modelo de seguridad multicapa |
| 11 | [11-estado-hooks.md](./11-estado-hooks.md) | TanStack Query, hooks, Realtime, Zod |
| 12 | [12-infraestructura.md](./12-infraestructura.md) | Docker, CI/CD, variables de entorno |
| 13 | [13-design-system.md](./13-design-system.md) | Tokens, paleta, componentes UI |
| 14 | [14-testing.md](./14-testing.md) | Vitest, Storybook, cobertura |
| 15 | [15-instalacion.md](./15-instalacion.md) | Instalacion y configuracion local |
| 16 | [16-diagramas.md](./16-diagramas.md) | Diagramas de arquitectura, flujos, ER |
| 17 | [17-casos-uso.md](./17-casos-uso.md) | Casos de uso e historias de usuario |
| 18 | [18-manuales.md](./18-manuales.md) | Manual tecnico y manual de usuario |
| 19 | [19-riesgos-mejoras.md](./19-riesgos-mejoras.md) | Riesgos, deuda tecnica, mejoras futuras |
| 20 | [20-conclusiones-anexos.md](./20-conclusiones-anexos.md) | Conclusiones, glosario, resumen ejecutivo |

---

## Estadisticas del Sistema

| Metrica | Valor |
|---------|-------|
| Archivos TypeScript/TSX | 300+ |
| Modulos funcionales | 15 |
| Endpoints API | 37+ |
| Templates de email | 20+ |
| Tablas en base de datos | 22 |
| Buckets de Storage | 7 |
| Custom Hooks | 50+ |
| Componentes React | 150+ |

---

## Como usar esta documentacion

- **Nuevo desarrollador:** Empieza por 01, 02, 03, 15 (introduccion, arquitectura, estructura, instalacion)
- **Auditoria de seguridad:** Lee 04, 07, 10 (autenticacion, base de datos, seguridad)
- **Entender un modulo:** Lee 05 (modulos) y 06 (API endpoints)
- **Entender el estado del servidor:** Lee 11 (estado y hooks)
- **Despliegue:** Lee 12 (infraestructura y CI/CD)
- **Reportar un bug:** Revisa 19 (riesgos y deuda tecnica)

---

Version del sistema: 0.1.0
Fecha de documentacion: Mayo 2026
