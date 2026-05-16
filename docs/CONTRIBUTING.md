# Contribuir al Design System Stack-and-Flow

¡Gracias por tu interés en contribuir! Este documento explica los pasos y el flujo de trabajo para contribuir a nuestro design system.

## Requisitos previos

Es **obligatorio** tener instalado:

- [Node.js](https://nodejs.org/) (usa la versión especificada en `.nvmrc`)
- [nvm](https://github.com/nvm-sh/nvm) o [nvm-windows](https://github.com/coreybutler/nvm-windows) para gestionar versiones de Node.
- [pnpm](https://pnpm.io/installation) como gestor de paquetes.

## Configuración local

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/Stack-and-Flow/design-system.git
   cd design-system
   ```
2. **Establece la versión correcta de Node**:
   ```bash
   nvm use
   ```
3. **Instala las dependencias**:
   ```bash
   pnpm install
   ```
4. **Inicia Storybook**:
   ```bash
   pnpm run storybook
   ```

### Nota sobre fuentes

El design system usa **Space Grotesk Variable**, cargada vía `@fontsource-variable/space-grotesk`. Se incluye como dependencia npm normal y estará disponible automáticamente después de `pnpm install`.

---

## Cómo crear un nuevo componente

El flujo canónico para componentes está en [`CONTRIBUTOR-FLOW.md`](./CONTRIBUTOR-FLOW.md). Este documento solo resume las reglas principales.

Todo componente DEBE seguir estrictamente la arquitectura Atomic Design + Container/Presentational (detallada en [`GUIDELINES.md`](./GUIDELINES.md)).

1. **Determina el nivel correcto**: Decide si es un `atom`, `molecule` u `organism`.
2. **Crea la estructura**: Si creas un átomo `Button`, la estructura DEBE ser exactamente:
   ```text
   src/components/atoms/button/
   ├── types.ts             # Tipos, props públicas, JSDoc controls y variantes CVA
   ├── useButton.ts         # Capa Container: lógica, estado, refs, handlers
   ├── Button.tsx           # Capa Presentacional: solo JSX
   ├── Button.test.tsx      # Tests de hook y comportamiento
   ├── Button.stories.tsx   # Documentación Storybook
   └── index.ts             # Re-exportaciones
   ```
3. **Implementa en orden**: `types.ts` → hook → componente → tests → stories → `index.ts`.
4. **Revisa antes del PR**: ejecuta la review pre-PR del componente definida en `CONTRIBUTOR-FLOW.md`.

---

## Reglas de documentación en Storybook

Storybook es nuestra única fuente de verdad. Todo componente DEBE estar completamente documentado.

- **Inglés por defecto**: Stories, descripciones, comentarios y labels van en inglés, excepto los headings canónicos de docs.
- **Controls y Args**: DEBES definir `controls` mediante JSDoc en `types.ts` y establecer `args` por defecto en `.stories.tsx`.
- **Descripción en Docs**: DEBES incluir `parameters.docs.description.component` con esta estructura:
  - `## Descripción` obligatorio.
  - `## Dependencies` solo si usa otros componentes o primitives externas.
  - `## Guía de uso` solo si la utilización es compleja.
- **Sin `play` functions**: Las interacciones se testean en `ComponentName.test.tsx`, no en stories.

---

## Tests de componentes

Las stories son documentación viva, no la suite de tests. Los tests de interacción y comportamiento viven en `ComponentName.test.tsx`.

Antes de abrir un PR, verifica:

- [ ] El hook está testeado con `renderHook` cuando contiene lógica.
- [ ] El componente está testeado con `render` / `screen` / `userEvent`.
- [ ] Hay cobertura de ARIA, teclado, disabled y estados relevantes.
- [ ] No se testean strings internos de clases CSS como contrato principal.
- [ ] `npm test -- --run src/components/.../ComponentName.test.tsx` pasa.

---

## Flujo de trabajo con Git

### Estrategia de ramas

- `main` es la rama base. Todos los PRs apuntan a `main`.
- Nomenclatura de ramas: `feat/nombre-componente`, `fix/nombre-bug`, `chore/nombre-tarea`.

### Commits

Seguimos estrictamente **Conventional Commits**:

- `feat:` para nuevas funcionalidades o componentes.
- `fix:` para corrección de bugs.
- `chore:` para herramientas, dependencias, etc.
- `docs:` para actualizaciones de documentación.
- `refactor:` para cambios de código que no corrigen un bug ni añaden funcionalidad.
- `style:` para formato, punto y coma omitidos, etc.
- `test:` para añadir o corregir tests.

### Proceso de Pull Request

1. Sube tu rama y abre un PR contra `main`.
2. Puedes pedir revisión automática a copilot hasta que esté listo para revisión humana.
3. El PR DEBE pasar todos los checks de CI (formato/linting de Biome, checks de TypeScript estricto).
4. El PR DEBE ser revisado por al menos un maintainer antes de hacer merge.

### Checklist del PR

Antes de pedir revisión, verifica:

- [ ] El componente sigue la arquitectura de 6 archivos perfectamente.
- [ ] No se usa `interface` (solo `type`). Sin `any`.
- [ ] Storybook contiene `args`, `controls` y `parameters.docs.description.component`.
- [ ] `## Descripción` está presente; `## Dependencies` y `## Guía de uso` se usan solo cuando aplican.
- [ ] Los componentes interactivos tienen tests en `.test.tsx`.
- [ ] La review pre-PR del componente está pasada o documentada.
- [ ] Se usan tokens de `theme.css` (sin colores ni espaciados hardcodeados).
- [ ] Se implementan atributos ARIA en elementos interactivos.
- [ ] Se usan Conventional Commits.
- [ ] Estados visuales implementados: hover, focus, active/pressed, disabled.
- [ ] Focus ring via `box-shadow` — nunca `outline` sin alternativa visible.
- [ ] Disabled via `opacity: 0.4` — sin sustitución de color.
- [ ] Sin `transition: all` — propiedades específicas enumeradas.
- [ ] Touch target mínimo `44×44px` en elementos interactivos.

---

## Trabajar con agentes IA

### ¿Está permitida la IA?

Sí. Los contributors pueden usar herramientas asistidas por IA (GitHub Copilot, opencode/gentle-ai, Cursor, etc.) en este proyecto.

Sin embargo, dos reglas son innegociables:

1. **El resultado DEBE cumplir todos los estándares del proyecto** — independientemente de cómo se haya generado. Si la IA produjo código que incumple GUIDELINES.md, corrígelo antes de abrir un PR.
2. **Eres responsable** de cada línea en tu PR, generada por IA o no. "Lo escribió la IA" no es una razón válida para saltarse el checklist del PR.

---

### Usar gentle-ai (opencode)

Si usas [opencode](https://opencode.ai/), este proyecto incluye `.atl/AGENTS.md` — un archivo de contexto que se inyecta automáticamente en todos los agentes al abrir el proyecto.

Los agentes ya conocerán:

- La arquitectura de 6 archivos y dónde corresponde cada pieza de lógica
- Qué tokens de diseño usar (y qué valores hardcodeados evitar)
- Las reglas de Storybook y la estructura requerida de stories
- La lista completa de anti-patrones que provocan rechazo de PR

**Para activarlo**: simplemente abre el directorio del proyecto en opencode. No se requiere configuración manual — el contexto se carga automáticamente.

---

### Flujo IA para componentes

Al usar gentle-ai (opencode), el agente sigue `component-contributor`. El flujo completo y canónico está en [`CONTRIBUTOR-FLOW.md`](./CONTRIBUTOR-FLOW.md).

Resumen de fases:

1. **Research** — investigas referencias, API, estados, accesibilidad y diseño.
2. **Spec proposal** — usas `component-spec-proposer` para convertir la tarea y referencia en una spec validada en la issue.
3. **Spec intake** — `component-contributor` lee la sección `## Validated component spec` sin inventar comportamiento.
4. **Review de spec** — el agente critica gaps, riesgos e inconsistencias antes de planificar.
5. **Prefase visual** — el agente alinea tokens, superficie, estados, focus, transición y dark mode antes del plan.
6. **Plan** — revisas y apruebas archivos, variantes, tests, stories y accesibilidad.
7. **Implementación** — el agente crea los 6 archivos y explica decisiones.
8. **Visual review** — se corrigen issues CRITICAL o MAJOR antes de continuar.
9. **Review pre-PR** — `components-auditor` valida arquitectura, tests, Storybook, tokens, visual y accesibilidad antes de abrir PR.

> Para activar el flujo completo, primero pedí la spec con `component-spec-proposer`; después de validarla, comparte la URL de la issue y di "implementa este componente".

---

### Lo que la IA NO debe hacer

Si usas una herramienta de IA, no le permitas:

- Modificar los tokens de `src/styles/theme.css` sin tu aprobación explícita
- Añadir nuevas dependencias `npm` o `pnpm` sin discutirlo
- Saltarse la estructura de 6 archivos en favor de un enfoque de un solo archivo "más simple"
- Escribir stories sin args, controls o `parameters.docs.description.component`
- Usar `interface` en lugar de `type`, o introducir tipos `any`

Si la IA propone alguna de estas cosas, recházala y redirigela al patrón correcto.

---

### Revisión de código generado por IA

El código generado por IA pasa por el **mismo proceso de revisión exacto** que el código escrito por humanos. Sin excepciones.

Antes de pedir revisión en un PR asistido por IA:

- Repasa el checklist del PR como lo harías con cualquier contribución
- Ejecuta la review pre-PR del componente y documenta la evidencia
- Corrige todo issue CRITICAL o MAJOR antes de pedir revisión
- Si se incumple una guía, el PR será rechazado independientemente del autor

---

## Reportar bugs y proponer funcionalidades

- **Bugs**: Abre un issue usando la plantilla de reporte de bugs. Incluye pasos para reproducir, comportamiento esperado y capturas si aplica.
- **Proponer componentes**: Antes de escribir código, propón el componente en el [GitHub Projects Board](https://github.com/orgs/Stack-and-Flow/projects/1) o abre un issue de Feature Request para discutir la API y los requisitos con el Project Lead.

---

## Links útiles

- **Demo de Storybook**: [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)
- **GitHub Projects (Kanban)**: [Project Board](https://github.com/orgs/Stack-and-Flow/projects/1)
- **Guidelines**: [GUIDELINES.md](./GUIDELINES.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Gobernanza**: [GOVERNANCE.md](./GOVERNANCE.md)
