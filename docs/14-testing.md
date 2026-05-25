# 14 - Testing

---

## 1. Framework de Testing

| Herramienta | Version | Uso |
|-----------|---------|-----|
| Vitest | 3.2.x | Framework de tests unitarios |
| @testing-library/react | 16.3.x | Testing de componentes React |
| @testing-library/jest-dom | 6.9.x | Matchers adicionales para DOM |
| Playwright | 1.55.x | Testing E2E (configurado, pendiente de implementacion) |
| Storybook + addon-a11y | 9.1.x | Testing visual y de accesibilidad |
| @storybook/addon-vitest | 9.1.x | Integracion Vitest con Storybook |

---

## 2. Configuracion de Vitest

**Archivo:** `vitest.config.ts`

- Environment: jsdom (simula el DOM del navegador)
- Globals: habilitados (describe, it, expect sin importar)
- Setup: `vitest.setup.ts` (configura jest-dom matchers)
- Coverage: @vitest/coverage-v8

---

## 3. Tests Existentes

El sistema cuenta con **5 suites de tests** enfocadas en la validacion de schemas Zod:

| Archivo | Descripcion |
|---------|-------------|
| src/features/adopciones/schemas/adopciones-schemas.test.ts | Valida schemas de adopciones |
| src/features/mascotas/schemas/mascotas-schemas.test.ts | Valida schemas de mascotas |
| src/features/mascotas/schemas/razas-schemas.test.ts | Valida schemas de razas |
| src/features/usuarios/schemas/usuarios-schemas.test.ts | Valida schemas de usuarios |
| src/utils/validateEmail.test.ts | Valida la funcion validateEmail |

---

## 4. Ejecutar los Tests

```bash
# Modo watch (desarrollo)
npm run test

# Ejecucion unica (CI)
npm run test:run

# Con cobertura
npx vitest run --coverage
```

---

## 5. Storybook

**Storybook** documenta y prueba visualmente los componentes UI del Design System.

**Version:** 9.1.x con addon Next.js Vite

### Levantar Storybook

```bash
npm run storybook
# Disponible en http://localhost:6006
```

### Build estatico de Storybook

```bash
npm run build-storybook
# Genera directorio storybook-static/
```

### Componentes documentados en Storybook

| Componente | Historia |
|-----------|---------|
| Button | Variantes: primary, secondary, ghost, destructive |
| Badge | Variantes de color y estado |
| StatusBadge | Estados del sistema |
| ChatBubble | Variantes de mensaje |
| EmptyState | Estados de contenido vacio |
| Pagination | Controles de paginacion |
| Stepper | Indicador de progreso |
| Table | Tabla con datos de ejemplo |
| Tabs | Navegacion por pestanas |
| Card | Contenedor de tarjeta |

### Addon de Accesibilidad (a11y)

Cada historia en Storybook se puede analizar automaticamente en busca de problemas
de accesibilidad con el addon `@storybook/addon-a11y`.

---

## 6. Cobertura de Tests Actual

| Area | Estado |
|------|--------|
| Schemas de validacion Zod | Parcialmente cubierto (5 suites) |
| Componentes React | Sin cobertura de tests unitarios |
| Server Actions | Sin cobertura |
| API Routes | Sin cobertura |
| Hooks personalizados | Sin cobertura |
| Utils | Una utilidad cubierta (validateEmail) |
| Flujos E2E | Configurado (Playwright) pero no implementado |

---

## 7. Oportunidades de Mejora en Testing

Las siguientes areas tienen mayor valor de ser cubiertas:

1. **Server Actions criticas:** crear mascota, aprobar adopcion, cambiar estado
2. **Hooks de TanStack Query:** validar que queries e invalidaciones funcionen
3. **Middleware:** validar logica de redireccion segun rol y estado de sesion
4. **Flujos E2E (Playwright):** flujo completo de adopcion, login, registro
5. **Componentes de formulario:** validar comportamiento de errores Zod en formularios
