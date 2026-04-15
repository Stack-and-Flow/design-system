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

Todo componente DEBE seguir estrictamente la arquitectura Atomic Design + Container/Presentational (detallada en [`GUIDELINES.md`](./GUIDELINES.md)).

1. **Determina el nivel correcto**: Decide si es un `atom`, `molecule` u `organism`.
2. **Crea la estructura**: Si creas un átomo `Button`, la estructura DEBE ser exactamente:
   ```text
   src/components/atoms/button/
   ├── Button.tsx           # Capa Presentacional
   ├── useButton.ts         # Capa Container (lógica y CVA)
   ├── types.ts             # Tipos y variantes CVA
   ├── index.ts             # Re-exportaciones
   └── Button.stories.tsx   # Documentación Storybook
   ```
3. **Implementa**:
   - Escribe las variantes en `types.ts`.
   - Escribe la lógica en `useButton.ts`.
   - Consume la lógica en `Button.tsx`.
4. **Exporta**: Re-exporta correctamente en `index.ts`.

---

## Reglas de documentación en Storybook

Storybook es nuestra única fuente de verdad. Todo componente DEBE estar completamente documentado.

- **Solo en inglés**: Todas las stories, descripciones y comentarios DEBEN estar escritos en inglés.
- **Controls y Args**: DEBES definir `controls` mediante JSDoc en `types.ts` y establecer `args` por defecto en el archivo `.stories.tsx`.
- **Descripción en Docs**: DEBES incluir un `parameters.docs.description.component` que describa qué hace el componente y cuándo usarlo.

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
- [ ] El componente sigue la arquitectura de 5 archivos perfectamente.
- [ ] No se usa `interface` (solo `type`). Sin `any`.
- [ ] Storybook contiene `args`, `controls` y `description`.
- [ ] Se usan tokens de `theme.css` (sin colores ni espaciados hardcodeados).
- [ ] Se implementan atributos ARIA en elementos interactivos.
- [ ] Se usan Conventional Commits.

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
- La arquitectura de 5 archivos y dónde corresponde cada pieza de lógica
- Qué tokens de diseño usar (y qué valores hardcodeados evitar)
- Las reglas de Storybook y la estructura requerida de stories
- La lista completa de anti-patrones que provocan rechazo de PR

**Para activarlo**: simplemente abre el directorio del proyecto en opencode. No se requiere configuración manual — el contexto se carga automáticamente.

---

### Flujo IA para componentes

Al usar IA para crear un componente, sigue este flujo adaptado:

1. **Research** — Pide a la IA que revise `src/components/` y confirme que el componente no existe. Identifica el nivel atómico correcto.
2. **Scaffold** — Ejecuta `compilot-cli` para generar la estructura de 5 archivos, o pide a la IA que la replique exactamente.
3. **Spec primero** — Define `types.ts` primero: props, variantes CVA y controles JSDoc. Deja que la IA ayude, pero revisa cada tipo.
4. **Implementa** — Pide a la IA que implemente el hook y el componente siguiendo estrictamente GUIDELINES.md. Referencia el archivo explícitamente.
5. **Revisa** — Abre manualmente cada archivo generado y verifícalo contra el checklist del PR. No omitas este paso.
6. **Documenta** — Verifica que el archivo `.stories.tsx` tenga stories `Default`, `Disabled` y específicas de variantes con `args`, controls y descripción en inglés.

---

### Lo que la IA NO debe hacer

Si usas una herramienta de IA, no le permitas:

- Modificar los tokens de `src/styles/theme.css` sin tu aprobación explícita
- Añadir nuevas dependencias `npm` o `pnpm` sin discutirlo
- Saltarse la estructura de 5 archivos en favor de un enfoque de un solo archivo "más simple"
- Escribir stories de Storybook en español o sin controls y descripciones adecuados
- Usar `interface` en lugar de `type`, o introducir tipos `any`

Si la IA propone alguna de estas cosas, recházala y redirigela al patrón correcto.

---

### Revisión de código generado por IA

El código generado por IA pasa por el **mismo proceso de revisión exacto** que el código escrito por humanos. Sin excepciones.

Antes de pedir revisión en un PR asistido por IA:
- Repasa el checklist del PR como lo harías con cualquier contribución
- Corrige toda violación antes de pedir revisión — los revisores no aceptarán problemas generados por IA como "aceptables"
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
- **Quick Start**: [docs/QUICK_START.md](./docs/QUICK_START.md)
- **Gobernanza**: [GOVERNANCE.md](./GOVERNANCE.md)
