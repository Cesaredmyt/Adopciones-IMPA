# 01 — Introduccion, Objetivo y Alcance

---

## 1. Portada

| Campo | Valor |
|-------|-------|
| **Nombre del sistema** | Sistema de Adopciones y Gestion Animal IMPA |
| **Nombre de la institucion** | Instituto Municipal de Proteccion Animal (IMPA) |
| **Ubicacion** | Morelia, Michoacan, Mexico |
| **Version** | 0.1.0 |
| **Fecha de documentacion** | Mayo 2026 |
| **Estado del sistema** | Desarrollo local (entorno de desarrollo) |
| **Framework principal** | Next.js 15 + React 19 + TypeScript |
| **Base de datos** | Supabase (PostgreSQL 17) |

---

## 2. Introduccion

El **Sistema de Adopciones y Gestion Animal IMPA** es una plataforma web integral desarrollada para el Instituto Municipal de Proteccion Animal de Morelia, Michoacan. Su proposito es digitalizar, organizar y agilizar todos los procesos que involucran el bienestar y adopcion de animales bajo el resguardo de la institucion.

El sistema centraliza la gestion de mascotas, solicitudes de adopcion, citas, esterilizaciones, platicas de concientizacion, reportes de maltrato animal y seguimiento post-adopcion en una sola plataforma accesible tanto para el personal administrativo como para ciudadanos adoptantes.

El proyecto esta construido con tecnologias modernas de desarrollo web (Next.js 15, React 19, TypeScript, Supabase) y sigue principios de arquitectura limpia, separacion de responsabilidades y experiencia de usuario moderna.

---

## 3. Objetivo del Sistema

### Objetivo General

Proveer al Instituto Municipal de Proteccion Animal una plataforma digital unificada que gestione de manera eficiente, trazable y segura todos los procesos relacionados con la adopcion responsable de animales y la proteccion animal en el municipio de Morelia.

### Objetivos Especificos

1. **Digitalizar el proceso de adopcion** — Reemplazar formularios en papel por flujos digitales con validacion, seguimiento de estado y comunicacion automatica.

2. **Centralizar la informacion de mascotas** — Mantener un catalogo digital actualizado de todos los animales disponibles para adopcion, con fotos, historial medico y codigo QR unico.

3. **Gestionar citas eficientemente** — Coordinar citas de conocer mascota, citas veterinarias y calendarios de disponibilidad de manera automatizada.

4. **Documentar esterilizaciones** — Registrar y gestionar el programa de esterilizacion de animales antes y despues de la adopcion.

5. **Facilitar platicas de concientizacion** — Administrar solicitudes de platicas educativas en escuelas, empresas y colonias del municipio.

6. **Atender reportes de maltrato** — Ofrecer un canal publico y anonimo para que ciudadanos reporten casos de maltrato animal con seguimiento transparente.

7. **Dar seguimiento post-adopcion** — Asegurar el bienestar del animal adoptado mediante un sistema estructurado de seguimiento con fotos y evaluaciones.

8. **Automatizar comunicaciones** — Enviar notificaciones por correo electronico en cada etapa del proceso sin intervencion manual.

---

## 4. Problematica que Resuelve

Antes del sistema, IMPA enfrentaba los siguientes desafios operativos:

| Problema | Impacto | Solucion aportada |
|---------|---------|------------------|
| Registro de animales en papel o Excel | Perdida de informacion, dificil busqueda | Catalogo digital con fotos, QR y filtros |
| Solicitudes de adopcion sin trazabilidad | No se podia rastrear el estado de cada solicitud | Flujo de estados con historial y notificaciones |
| Coordinacion de citas por llamada | Doble reservacion, olvidos, cancelaciones sin aviso | Calendario digital con disponibilidad en tiempo real |
| Sin historial medico centralizado | Desconocimiento del estado de salud de los animales | Tabla historial_medico vinculada a cada mascota |
| Reportes de maltrato sin canal formal | Sub-registro de casos, sin seguimiento | Formulario publico anonimo con bitacora de cambios |
| Comunicacion manual por correo | Lento, impreciso, dependiente de personal | 20+ plantillas automaticas de email por evento |
| Sin seguimiento post-adopcion | Imposible verificar bienestar del animal adoptado | Modulo de seguimiento con fotos y evaluacion |
| Documentos en fisico | Riesgo de perdida, dificil acceso | Gestion documental digital con almacenamiento en nube |

---

## 5. Alcance del Sistema

### Incluye

- Registro y gestion de mascotas (perros y gatos) con imagenes, codigo QR y ficha publica
- Proceso completo de adopcion: solicitud → documentacion → cita → aprobacion → contrato → seguimiento
- Dashboard administrativo con estadisticas en tiempo real
- Dashboard de usuario con estado de todas sus gestiones
- Gestion de citas de adopcion con calendario y evaluacion de asistencia
- Gestion de citas veterinarias con evidencias fotograficas
- Programa de esterilizaciones con estados (pendiente → programada → completada)
- Platicas de concientizacion (solicitud, aprobacion, finalizacion)
- Reporte de maltrato animal publico y anonimo con bitacora de seguimiento
- Seguimiento post-adopcion con fotos y calificacion de satisfaccion
- Gestion de documentos del proceso de adopcion (INE, comprobante, etc.)
- Sistema de autenticacion con email verificado y recuperacion de contrasena
- Notificaciones por correo electronico en cada evento significativo del sistema
- Generacion de certificados PDF
- Generacion de codigos QR para mascotas
- Control de acceso basado en roles (Administrador / Usuario)

### No Incluye (Version Actual)

- Aplicacion movil nativa
- Integracion activa con plataforma de pagos (modulo de donaciones presente pero documentado separadamente)
- Portal de voluntarios
- Mapa geografico de incidentes de maltrato
- Integracion con servicios veterinarios externos
- Notificaciones push en navegador
- Chat en tiempo real entre adoptante y administrador
