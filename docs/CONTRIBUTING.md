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

## Regla de idioma para documentación

La documentación del repo es bilingüe por pares:

- `*.md` base: español.
- `*.en.md`: inglés.

Si cambiás una guía, mantené ambos archivos alineados cuando exista el par. No reemplaces el archivo base español por prosa en inglés; el contenido inglés vive en el archivo `.en.md` correspondiente. Storybook, código, comentarios técnicos, identificadores y nombres públicos siguen en inglés.

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

- **Inglés obligatorio**: toda la documentación de Storybook va en inglés, incluidos headings de docs, descripciones, comentarios, nombres de stories y labels.
- **Controls y Args**: DEBES definir `controls` mediante JSDoc en `types.ts` y establecer `args` por defecto en `.stories.tsx`.
- **Descripción en Docs**: DEBES incluir un bloque JSDoc encima de `const meta` con esta estructura:
  - `## Description` obligatorio.
  - `## Dependencies` solo si usa otros componentes o primitives externas.
  - `## Usage Guide` solo si la utilización es compleja.
- **Docs por story**: cada `export const StoryName` necesita JSDoc útil que explique el escenario y por qué importa. No uses texto de relleno que solo repite el nombre de la story.
- **Sin stories redundantes**: cada story debe demostrar un estado, eje de variante, restricción de composición, comportamiento de accesibilidad o contexto de integración distinto.
- **Sin story genérica `DarkMode`**: usa el toolbar dark-mode de Storybook para cobertura normal de tema. Añadí una story dark-mode dedicada solo para scope dark local, herencia de tema en portales o una regresión específica que el toolbar no pueda expresar, y documentá esa razón en JSDoc.
- **Sin `parameters.docs.description.component`**: la documentación del componente vive en JSDoc encima de `const meta`.
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
- Si la tarea viene de una issue, usa: `{type}/{issue-number}-{slug}` (por ejemplo `feat/123-button`).
- Si además trabajás con worktree, usa el sibling worktree correspondiente: `../design-system-{type}-{issue-number}-{slug}`.
- Para el flujo completo de naming, START WORK y END WORK, consulta [`CONTRIBUTOR-FLOW.md`](./CONTRIBUTOR-FLOW.md).

### Commits

Seguimos estrictamente **Conventional Commits**. El hook `commit-msg` ejecuta `commitlint` automáticamente y rechaza cualquier commit que no respete el formato.

Formato obligatorio:

```text
<type>(<scope opcional>): <descripción>
```

Ejemplos válidos:

```text
feat(button): add loading state
fix(calendar): correct keyboard navigation
chore(infra): update lint tooling
docs: update contribution guide
```

Tipos frecuentes:

- `feat:` para nuevas funcionalidades o componentes.
- `fix:` para corrección de bugs.
- `chore:` para herramientas, dependencias, etc.
- `docs:` para actualizaciones de documentación.
- `refactor:` para cambios de código que no corrigen un bug ni añaden funcionalidad.
- `style:` para formato, punto y coma omitidos, etc.
- `test:` para añadir o corregir tests.

Antes de crear un commit, puedes validar un mensaje manualmente:

```bash
echo "feat(button): add loading state" | pnpm exec commitlint
```

### Proceso de Pull Request

1. Antes de implementar desde una issue, verificá que la spec esté definida, que la issue tenga el label `status:approved` y que no esté asignada a otra persona; recién ahí corré **START WORK**: verificar assignees, asignar la issue, moverla a `In progress` y registrar branch/worktree.
2. Sube tu rama y abre un PR contra `main`.
3. Usa un título de PR con el mismo formato Conventional Commit, por ejemplo `feat(button): add loading state`.
4. Puedes pedir revisión automática a Copilot hasta que esté listo para revisión humana.
5. El PR DEBE pasar todos los checks de CI, incluidos tests, build de Storybook, accesibilidad y escaneos de seguridad.
6. El PR DEBE ser revisado por al menos un maintainer antes de hacer merge.
7. Marca la tarea como `Done` solo mediante **END WORK** después de PR merged o aprobación explícita del maintainer/usuario.

### Checklist del PR

Antes de pedir revisión, verifica:

- [ ] El componente sigue la arquitectura de 6 archivos perfectamente.
- [ ] No se usa `interface` (solo `type`). Sin `any`.
- [ ] Storybook contiene `args`, `controls` y un bloque JSDoc encima de `const meta`.
- [ ] `## Description` está presente; `## Dependencies` y `## Usage Guide` se usan solo cuando aplican.
- [ ] Los componentes interactivos tienen tests en `.test.tsx`.
- [ ] La review pre-PR del componente está pasada o documentada.
- [ ] Se usan tokens de `theme.css` (sin colores ni espaciados hardcodeados).
- [ ] Se implementan atributos ARIA en elementos interactivos.
- [ ] Se usan Conventional Commits en mensajes de commit y título del PR.
- [ ] Los checks de seguridad pasan o los falsos positivos están documentados en el PR.
- [ ] Estados visuales implementados: hover, focus, active/pressed, disabled.
- [ ] Focus visible vía utilidad compartida `focus-ring` (`outline: 2px solid var(--color-primary)`, offset `2px`) — nunca `outline: none` sin `focus-visible:focus-ring` o equivalente.
- [ ] Disabled via `opacity: 0.4` — sin sustitución de color.
- [ ] Sin `transition: all` — propiedades específicas enumeradas.
- [ ] Altura visual alineada con la escala semántica que aplique (`control` para acciones, `form-field` para campos); `touch-target-min` (`44px`) reservado para superficies touch-first o wrappers de hit area. Variantes compactas/densas documentadas pueden ser menores si conservan accesibilidad por teclado/focus.
- [ ] Limpieza MCP hecha antes de commit/review: `rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output`.

### Checks de seguridad

Los pull requests ejecutan audit de dependencias y escaneo de secretos antes del merge. Consulta [SECURITY.md](./SECURITY.md) para ver la política, los pasos de remediación y el manejo de falsos positivos.

---

## Trabajar con agentes IA

### ¿Está permitida la IA?

Sí. Los contributors pueden usar herramientas asistidas por IA (GitHub Copilot, opencode/gentle-ai, Cursor, etc.) en este proyecto.

Sin embargo, dos reglas son innegociables:

1. **El resultado DEBE cumplir todos los estándares del proyecto** — independientemente de cómo se haya generado. Si la IA produjo código que incumple GUIDELINES.md, corrígelo antes de abrir un PR.
2. **Eres responsable** de cada línea en tu PR, generada por IA o no. "Lo escribió la IA" no es una razón válida para saltarse el checklist del PR.

---

### Usar gentle-ai (opencode)

Si usas [opencode](https://opencode.ai/), este proyecto incluye `AGENTS.md` — un archivo de contexto que se inyecta automáticamente en todos los agentes al abrir el proyecto.

Los agentes ya conocerán:

- La arquitectura de 6 archivos y dónde corresponde cada pieza de lógica
- Qué tokens de diseño usar (y qué valores hardcodeados evitar)
- Las reglas de Storybook y la estructura requerida de stories
- La lista completa de anti-patrones que provocan rechazo de PR

**Para activarlo**: simplemente abre el directorio del proyecto en opencode. No se requiere configuración manual — el contexto se carga automáticamente.

Las skills compartidas del equipo viven en `skills/`. El directorio `.atl/` es estado local generado por gentle-ai — registry/cache — y debe permanecer ignorado porque puede mezclar skills del proyecto con skills personales del usuario.

---

### Flujo IA para componentes

Al usar gentle-ai (opencode), el agente sigue `component-contributor`. El flujo completo y canónico está en [`CONTRIBUTOR-FLOW.md`](./CONTRIBUTOR-FLOW.md).

Resumen de fases:

1. **Research** — investigas referencias, API, estados, accesibilidad y diseño.
2. **Spec proposal** — usas `component-spec-proposer` para convertir la tarea y referencia en una spec validada en la issue.
3. **Approval gate** — una vez escrita la spec, esperas el label `status:approved` en la issue; sin ese label no hay START WORK ni implementación bajo ningún concepto.
4. **Assignee gate** — antes de cualquier acción sobre una issue linkeada, verificas assignees; si está asignada a otra persona, hace falta permiso explícito antes de reasignarla.
5. **START WORK** — después del label `status:approved` y el assignee gate, asignas la issue, la mueves a `In progress` y registras branch/worktree.
6. **Spec intake** — con START WORK ya completado, `component-contributor` lee `## Validated component spec` y el `## Cataloging decision` inmediatamente siguiente sin inventar comportamiento.
7. **Review de spec** — el agente critica gaps, riesgos e inconsistencias antes de planificar.
8. **Prefase visual** — el agente alinea tokens, superficie, estados, focus, transición y dark mode antes del plan.
9. **Plan** — revisas y apruebas archivos, variantes, tests, stories y accesibilidad.
10. **Implementación** — el agente crea los 6 archivos y explica decisiones.
11. **Visual review** — se corrigen issues CRITICAL o MAJOR antes de continuar.
12. **Review pre-PR** — `components-auditor` valida arquitectura, tests, Storybook, tokens, visual y accesibilidad antes de abrir PR.
13. **END WORK** — al cerrar, la tarea pasa a `Done` solo con PR merged o aprobación explícita, más evidencia de validación.

> Para activar el flujo completo, primero pedí la spec con `component-spec-proposer`; después de validarla, esperá `status:approved`, verificá que la issue no esté asignada a otra persona, compartí la URL de la issue y decí "implementa este componente".

---

### Lo que la IA NO debe hacer

Si usas una herramienta de IA, no le permitas:

- Modificar los tokens de `src/styles/theme.css` sin tu aprobación explícita
- Añadir nuevas dependencias `npm` o `pnpm` sin discutirlo
- Saltarse la estructura de 6 archivos en favor de un enfoque de un solo archivo "más simple"
- Escribir stories sin args, controls o un bloque JSDoc encima de `const meta`
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
