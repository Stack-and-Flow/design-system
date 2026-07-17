# Flujo del Contributor — Stack-and-Flow Design System

Este es el documento canónico para contribuir componentes al design system. `CONTRIBUTING.md` explica el setup general; este archivo define el flujo operativo de componentes y los checkpoints que debe seguir cualquier contributor, con o sin IA.

---

## Resumen rápido

```text
Project task → Research → Spec proposal skill → Cataloging validator → Validated issue spec → esperar `status:approved` → verificar assignee → START WORK → Spec review → Visual preflight → Plan → Implementación → Visual review → Pre-PR component review → PR → Review → Merge → END WORK
```

La regla central: **la IA ejecuta, el contributor decide**. La spec, los criterios visuales y la aprobación de checkpoints son responsabilidad humana. Después de escribir la spec validada en la tarea, la implementación queda bloqueada hasta que la issue asociada tenga el label `status:approved` y no esté asignada a otra persona.

---

## Fuentes de verdad

| Tema                            | Fuente                                             |
| ------------------------------- | -------------------------------------------------- |
| Setup del repo                  | [`CONTRIBUTING.md`](./CONTRIBUTING.md)             |
| Arquitectura y reglas de código | [`GUIDELINES.md`](./GUIDELINES.md)                 |
| Tokens y lenguaje visual        | [`DESIGN.md`](./DESIGN.md), `src/styles/theme.css` |
| Estados visuales por componente | [`COMPONENTS.md`](./COMPONENTS.md)                 |
| Catalogación y recatalogación V1 | [`COMPONENT-CATALOGING.md`](./COMPONENT-CATALOGING.md) |
| Toma y propuesta de specs       | `skills/component-spec-proposer/SKILL.md`     |
| Validación de catalogación de specs | `skills/component-spec-cataloging-validator/SKILL.md` |
| Flujo detallado con IA          | `skills/component-contributor/SKILL.md`       |
| Auditoría pre-PR                | `skills/components-auditor/SKILL.md`          |

Si hay contradicción, el orden de autoridad es: `GUIDELINES.md` / `DESIGN.md` para código visual, `skills/*` para ejecución asistida por agentes, y este documento para el flujo humano.

---

## Paso 1 — Tomar una tarea

1. Elegí una tarea en el [GitHub Projects Board](https://github.com/orgs/Stack-and-Flow/projects/1).
2. Verificá que tenga issue asociada. La issue es el contrato de implementación.
3. Antes de tomar una issue linkeada, verificá los assignees. Si ya está asignada a otra persona, frená y pedí permiso explícito antes de reasignártela o tomarla.
4. No corras **START WORK** todavía si la spec no está definida y aprobada. El contributor puede investigar y proponer la spec, pero no puede arrancar implementación.
5. Si el usuario pidió trabajo offline/no-network, no mutés GitHub: dejá registrado el follow-up necesario. No empieces implementación hasta verificar que la issue tenga el label `status:approved` y que el assignee gate esté satisfecho.

---

## Paso 2 — Research

Antes de pedir implementación, investigá el componente.

Checklist mínimo:

- Referencias: Radix UI primitives, MDN o WAI-ARIA APG según aplique.
- Tier de catálogo: consultá [`COMPONENT-CATALOGING.md`](./COMPONENT-CATALOGING.md) para decidir `primitives`, `atoms`, `molecules` u `organisms` y documentar follow-ups V1.
- Props: nombre, tipo, default, required/optional.
- Variantes CVA: keys y valores.
- Estados: base, hover, focus, active/pressed, disabled, loading, error, empty si aplica.
- Accesibilidad: roles, `aria-*`, teclado, focus management, touch target.
- Diseño: superficie, color, spacing, radius, shadow/glow, transiciones, dark mode.

No hagas research a medias. Si la issue está incompleta, el componente sale incompleto.

---

## Paso 3 — Tomar y validar la spec con `component-spec-proposer`

Antes de implementar, usá la skill `component-spec-proposer` para convertir la issue en una spec validada. Hay dos variantes válidas de intake: capture-first y reference-component-first; ambas terminan en el mismo gate de aprobación.

| Variante | Cuándo aplica | Qué registra la issue |
| -------- | ------------- | --------------------- |
| A — capture-first | Maintainer/usuario captura una idea de componente desde una conversación o necesidad de producto, aunque todavía no exista una referencia externa. | Contexto conocido, constraints, unknowns, tier esperado y cualquier referencia o patrón faltante. |
| B — reference-component-first | El usuario trae una URL de HeroUI, Radix, MDN, WAI-ARIA APG u otro componente de referencia. | Comportamiento de referencia y cómo se adapta a Stack-and-Flow; no se copia a ciegas. |

Convergencia obligatoria:

```text
issue capturada o referencia → spec propuesta → assumptions/preguntas → validación de catalogación → validación humana → `## Validated component spec` en la issue → esperar label `status:approved` → START WORK → component-contributor
```

Antes de pedir aprobación humana o escribir `## Validated component spec`, corré `component-spec-cataloging-validator`. Ese gate contrasta la propuesta contra [`COMPONENT-CATALOGING.md`](./COMPONENT-CATALOGING.md), inspecciona el catálogo actual y devuelve `## Draft cataloging decision` con reuse, extracción, split, child issue candidates y target issue, o `## Cataloging blockers/questions` si no puede completar la validación. Si hay blockers/questions, no se pide aprobación todavía. Si hacen falta child issues, `component-child-issues` se usa después, solo con la decisión final validada.

Cuando se escribe en la issue, `## Cataloging decision` debe quedar inmediatamente después de `## Validated component spec` en el mismo comentario o actualización, para que el contrato de implementación y la decisión de catálogo se revisen juntos. Ese heading exacto se reserva para la versión final aprobada y no debe contener blockers/questions sin resolver.

`status:approved` es un **label de la issue**. El Project Status `In progress` pertenece a **START WORK**, no a la fase de propuesta de spec.

Prompt capture-first:

```text
Prepará la spec para este componente usando component-spec-proposer.

Issue: {issue_url}
Intake: capture-first desde esta conversación/necesidad de producto.
Contexto conocido: {context}
Referencia: pendiente o desconocida

No implementes todavía. Proponé la spec, listá assumptions/preguntas, marcá referencias o patrones faltantes, corré `component-spec-cataloging-validator` y esperá mi aprobación de la spec y `## Draft cataloging decision` antes de escribir en GitHub. Si hay `## Cataloging blockers/questions`, no pidas aprobación todavía.
```

Prompt reference-component-first:

```text
Prepará la spec para este componente usando component-spec-proposer.

Issue: {issue_url}
Intake: reference-component-first
Referencia: {reference_url}

No implementes todavía. Adaptá la referencia a Stack-and-Flow, proponé la spec, listá assumptions a validar, corré `component-spec-cataloging-validator` y esperá mi aprobación de la spec y `## Draft cataloging decision` antes de escribir en GitHub. Si hay `## Cataloging blockers/questions`, no pidas aprobación todavía.
```

La skill debe:

1. Leer la issue y, si existe, la referencia.
2. Proponer una spec usando la plantilla de `component-spec-proposer`.
3. Listar assumptions a validar, incluyendo referencias o patrones faltantes en capture-first.
4. Pasar la propuesta por `component-spec-cataloging-validator` antes de aprobación humana.
5. Incluir `## Draft cataloging decision` cuando la validación pase, con `### Child issue candidates` determinístico cuando aplique; si hay blockers/questions, mostrar `## Cataloging blockers/questions` y frenar.
6. Esperar aprobación humana de la spec propuesta y de `## Draft cataloging decision`.
7. Recién después de esa aprobación, escribir `## Validated component spec` y el `## Cataloging decision` validado inmediatamente después en el mismo comentario o actualización de la issue.
8. Dejar la tarea esperando aprobación: no moverla a `In progress` desde `component-spec-proposer`.
9. Indicar el siguiente paso: esperar el label de issue `status:approved` y verificar que la issue esté sin assignee o asignada al contributor/usuario antes de arrancar `component-contributor`.

No uses `component-contributor` para implementar hasta que la spec esté validada, la issue tenga el label `status:approved` y el assignee gate haya pasado.

---

## Paso 4 — Documentar la spec en la issue

La spec validada debe quedar en la issue como contrato verificable.

| Campo              | Qué debe decir                                             |
| ------------------ | ---------------------------------------------------------- |
| Component name     | PascalCase                                                 |
| Catalog tier       | primitive / atom / molecule / organism                     |
| Props              | Nombre, tipo TypeScript, default, required/optional        |
| CVA variants       | Variant keys y valores posibles                            |
| States             | Descripción visual y de comportamiento por estado          |
| Accessibility      | Roles, atributos, teclado, focus, reduced motion si aplica |
| Intake source / Reference | capture-first o reference-component-first; URL o patrón fuente si existe |
| Design notes       | Decisiones visuales específicas del sistema                |
| Story requirements | Default, Disabled, variantes clave, edge cases             |

> Regla de oro: si no está en la issue, el agente no debería inventarlo.

---

## Paso 5 — Esperar `status:approved` y correr START WORK

Después de documentar la spec, el contributor debe esperar aprobación explícita de maintainer/project lead. La señal operativa es el label exacto de GitHub `status:approved` en la issue asociada; no es un comentario libre ni reemplaza el campo Project Status, que sigue usando `Todo`, `In progress` y `Done`.

Reglas:

- No crear rama de implementación, plan ni código antes de `status:approved`.
- Antes de cualquier acción sobre una issue linkeada, verificá assignees. Si está asignada a otra persona, frená y avisá que hace falta permiso explícito antes de reasignártela.
- No mover el Project item a `In progress` desde la fase de spec proposal.
- Cuando el label `status:approved` esté presente y el assignee gate pase, corré **START WORK**: asignate la issue, mové el Project item a `In progress`, confirmá Team/Category y registrá branch/worktree.
- Si falta el label `status:approved`, frená y pedí aprobación; no lo reemplaces por aprobación implícita en chat.

---

## Paso 6 — Crear rama, worktree sibling y preparar entorno

Si la tarea viene de una issue, usá naming derivado de issue:

```text
branch:   {type}/{issue-number}-{slug}
worktree: ../design-system-{type}-{issue-number}-{slug}
```

Ejemplos:

```text
feat/123-button
fix/128-modal-focus-trap
../design-system-feat-123-button
```

Preferí worktrees sibling del repo. Evitá `/tmp` salvo que se pida explícitamente.

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feat/123-button
pnpm install
pnpm run storybook
```

Si usás worktree:

```bash
git worktree add -b feat/123-button ../design-system-feat-123-button HEAD
```

Usá una rama por unidad de trabajo: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.

---

## Paso 7 — Iniciar el flujo de implementación con IA

En opencode/gentle-ai, compartí la URL de la issue:

Prompt sugerido:

```text
Implementá este componente usando component-contributor.

Issue: {issue_url}

Usá la sección `## Validated component spec` y el `## Cataloging decision` inmediatamente siguiente en el mismo comentario/actualización como contrato. Antes de leer la spec en detalle, planificar o escribir código, verificá que la issue tenga el label `status:approved` y que no esté asignada a otra persona; si falta el label o el assignee gate falla, frená. Ejecutá START WORK antes del intake de implementación. No inventes props ni comportamiento fuera de la spec o de la decisión de catálogo. Pausá en los checkpoints de spec review, visual preflight y plan antes de escribir código.
```

El agente debe cargar `component-contributor`, comprobar el label `status:approved`, verificar assignees, correr START WORK y recién después consumir la spec validada por `component-spec-proposer`. Si salta una fase, frenalo.

---

## Las 8 fases de implementación del componente

### Fase 1 — Lectura de spec validada

Antes de esta fase, el agente ya debe haber verificado el label `status:approved`, confirmado que la issue no está asignada a otra persona sin permiso explícito y completado START WORK. Luego lee `## Validated component spec` y el `## Cataloging decision` inmediatamente siguiente en el mismo comentario/actualización, y extrae componente, tier, props, variantes, estados, accesibilidad, referencia, notas de diseño, reuse/extracción y child candidates.

Si el tier es `primitive`, solo puede avanzar cuando `## Cataloging decision` aprueba explícitamente soporte/ruta primitive; si no, debe frenar y deferir a la issue de inventario/recatalogación V1. No se implementa silenciosamente como `atom`.

Salida esperada:

- resumen de la spec;
- resumen de la decisión de catálogo, reuse/extracción y child candidates;
- evidencia del label `status:approved`, assignee gate y START WORK;
- preguntas si algo es ambiguo o si hay conflicto spec/catálogo;
- módulos de referencia/tokens que va a cargar.

**Checkpoint humano:** no avances si el agente inventa props, estados o comportamiento que no estén en la spec validada. Si aparece una decisión nueva, volvé a spec proposal o actualizá la issue antes de implementar.

Prompt sugerido si hay inconsistencias:

```text
Detené la implementación. Detecté una decisión que no está en `## Validated component spec`:

- {decision_or_gap}

Volvé a modo spec: proponé cómo actualizar la spec, listá assumptions y esperá mi aprobación antes de seguir.
```

---

### Fase 2 — Review de especificación

Antes de planificar, el agente critica la spec.

Debe reportar:

- gaps de accesibilidad;
- stories faltantes;
- variantes o props ambiguas;
- riesgos de arquitectura;
- mejoras propuestas.

**Checkpoint humano:** aceptá la spec, ajustala o pedí cambios. Este es el último momento barato para corregir alcance.

Prompt sugerido:

```text
Revisá críticamente la spec validada antes de planificar.

Buscá gaps de accesibilidad, stories faltantes, variantes ambiguas, riesgos de arquitectura y mejoras concretas. No escribas código. Devolvé: gaps, riesgos, mejoras y si está listo para avanzar.
```

---

### Fase 3 — Prefase visual

Antes del plan, el agente carga y aplica:

- `docs/DESIGN.md`;
- `docs/COMPONENTS.md` si aplica;
- `src/styles/theme.css`;
- módulos de tokens relevantes.

Debe definir:

- patrón de superficie;
- tokens de texto, fondo, borde, radius, spacing, glow/focus;
- estados visuales;
- dark mode;
- transiciones permitidas;
- touch target y reduced motion.

**Checkpoint humano:** confirmá que el componente ya está alineado visualmente antes de escribir código.

Prompt sugerido:

```text
Ejecutá la prefase visual antes del plan.

Cargá `docs/DESIGN.md`, `docs/COMPONENTS.md` si aplica y `src/styles/theme.css`. Definí superficie, tokens, estados visuales, focus, disabled, dark mode, transiciones y reduced motion. No escribas código todavía.
```

---

### Fase 4 — Plan

El agente presenta un plan antes de tocar archivos.

Debe incluir:

- directorio y tier;
- 6 archivos a crear/modificar;
- CVA variants;
- lógica del hook;
- stories previstas;
- tests previstos;
- decisiones visuales;
- accesibilidad.

Arquitectura obligatoria:

```text
types.ts → useComponentName.ts → ComponentName.tsx → ComponentName.test.tsx → ComponentName.stories.tsx → index.ts
```

**Checkpoint humano:** aprobá el plan o pedí ajustes. No se implementa sin aprobación.

Prompt sugerido:

```text
Presentá el implementation plan para {component_name} antes de escribir código.

Incluí tier, directorio, 6 archivos, CVA variants, hook logic, stories, tests, decisiones visuales y accesibilidad. Esperá mi aprobación para implementar.
```

---

### Fase 5 — Implementación + explicación

El agente implementa el patrón de 6 archivos y explica cada decisión al terminar cada archivo.

| Archivo                     | Responsabilidad                                             |
| --------------------------- | ----------------------------------------------------------- |
| `types.ts`                  | Props, tipos públicos, CVA variants, JSDoc controls         |
| `useComponentName.ts`       | Toda la lógica, handlers, estado, refs, className calculada |
| `ComponentName.tsx`         | Solo JSX presentacional, consume el hook                    |
| `ComponentName.test.tsx`    | Tests de hook y comportamiento del componente               |
| `ComponentName.stories.tsx` | Storybook docs, args, variantes, estados                    |
| `index.ts`                  | Re-exports públicos                                         |

Reglas duras:

- `type`, nunca `interface`.
- Sin `any`.
- Sin CVA fuera de `types.ts`.
- Sin lógica en `.tsx` presentacional.
- Sin valores hardcodeados si existe token.
- Sin `play` functions: las interacciones se testean en `.test.tsx`.

Prompt sugerido:

```text
Implementá el componente según el plan aprobado.

Creá los archivos en este orden: `types.ts`, `use{ComponentName}.ts`, `{ComponentName}.tsx`, `{ComponentName}.test.tsx`, `{ComponentName}.stories.tsx`, `index.ts`.

Después de cada archivo, explicá las decisiones importantes y no avances si aparece un bloqueo o una decisión no cubierta por la spec.
```

---

### Fase 6 — Visual review

Con los archivos completos, el agente revisa visualmente antes de declarar terminado.

Debe verificar:

- base, hover, focus, active/pressed, disabled;
- focus visible con la utilidad compartida `focus-ring` (`outline: 2px solid var(--color-primary)`, offset `2px`), nunca `outline: none` sin reponerla;
- altura visual alineada con la escala semántica que aplique (`control` para acciones, `form-field` para campos), y `touch-target-min` (`44px`) solo para superficies touch-first o wrappers de hit area; las variantes compactas/densas documentadas pueden ser menores si conservan accesibilidad por teclado y focus;
- contraste en light/dark;
- transiciones específicas, nunca `transition-all`;
- no animar propiedades de layout;
- reduced motion si hay transforms o animaciones.

CRITICAL y MAJOR bloquean. Se corrigen antes de continuar.

Prompt sugerido:

```text
Ejecutá la visual review de {component_name}.

Revisá base, hover, focus, active, disabled, glow/shadow, transiciones, contraste, touch target y reduced motion. Clasificá hallazgos como CRITICAL, MAJOR, MINOR o SUGGESTION y corregí CRITICAL/MAJOR antes de continuar.
```

---

### Fase 7 — Review del componente antes del PR

Antes de abrir PR, corré una auditoría explícita con `components-auditor`.

Debe revisar:

- arquitectura 6-file;
- responsabilidades por archivo;
- TypeScript strict;
- CVA en `types.ts`;
- tokens y theme;
- stories y docs header;
- tests;
- accesibilidad;
- visual states.

Formato esperado:

```markdown
## Pre-PR Component Review — ComponentName

**Verdict**: PASS / PASS WITH WARNINGS / BLOCKED

### Blocking issues

- None

### Warnings

- None

### Evidence

- `npm test -- --run src/components/.../ComponentName.test.tsx`: passed
- `npm run build`: passed
- Storybook/manual visual check: passed or documented
```

No abras PR con issues CRITICAL o MAJOR.

Prompt sugerido:

```text
Auditá este componente usando components-auditor antes de abrir PR.

Componente: {component_name}
Ruta: src/components/{tier}/{kebab_name}/

Revisá arquitectura, responsabilidades por archivo, CVA, TypeScript, stories, tests, tokens, visual states y accesibilidad. Devolvé PASS / PASS WITH WARNINGS / BLOCKED con evidencia.
```

---

### Fase 8 — PR

El PR debe linkear la issue y contener evidencia.

Checklist mínimo:

- [ ] `Closes #NNN` en la descripción.
- [ ] Título del PR en formato Conventional Commit: `<type>(<scope opcional>): <descripción>`.
- [ ] Commits en formato Conventional Commit válido para `commitlint`.
- [ ] Tests relevantes pasan.
- [ ] Build o checks requeridos pasan.
- [ ] Pre-PR component review incluido o resumido.
- [ ] Storybook docs tiene un bloque JSDoc encima de `const meta`.
- [ ] `## Description` presente.
- [ ] `## Dependencies` solo si aplica.
- [ ] `## Usage Guide` solo si aplica.
- [ ] Antes de commit/review corriste limpieza MCP:
  `rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output`.

Prompt sugerido:

```text
Prepará el PR para {component_name}.

Linkeá `Closes #{issue_number}`. Incluí resumen, tabla de cambios, evidencia de tests/build, resultado de la pre-PR component review y notas visuales si aplica. No abras el PR si la review está BLOCKED.
```

### Fase 9 — END WORK

Cerrá la tarea en GitHub Project solo cuando haya evidencia de cierre real:

- PR merged verificado; o
- aprobación explícita del maintainer/usuario para cerrar sin PR.

Checklist mínimo:

- [ ] evidencia de validación comentada en la issue;
- [ ] merged PR o aprobación explícita registrada;
- [ ] Project status movido a `Done`;
- [ ] follow-ups documentados si quedan pendientes.

Si estás offline/no-network, no intentes mutar GitHub: dejá `END WORK` como follow-up pendiente.

---

## Criterio Storybook actual

El bloque JSDoc encima de `const meta` debe usar esta estructura:

```markdown
## Description

What the component does and when to use it.

## Dependencies

Only when it uses other design-system components or external primitives.

## Usage Guide

Only when composition or usage has non-obvious constraints.
```

Todo el contenido del bloque JSDoc debe estar en inglés, incluidos headings, texto descriptivo y listas.

Cada bloque JSDoc de story encima de `export const StoryName` debe explicar el escenario y por qué importa: estado, eje de variante, restricción de composición, comportamiento de accesibilidad o contexto de integración. No aceptes descripciones de relleno que solo repiten el nombre de la story.

Usá el toolbar dark-mode de Storybook para cobertura normal de tema. No añadas una story genérica `DarkMode` salvo que demuestre scope dark local, herencia de tema en portales o una regresión específica que el toolbar no pueda expresar; el JSDoc de la story debe explicitar esa razón.

---

## Reglas que la IA no puede saltarse

Si el agente propone cualquiera de estas cosas, rechazalo:

- modificar `src/styles/theme.css` sin aprobación explícita;
- añadir dependencias sin discutirlo;
- usar una arquitectura de archivo único;
- omitir tests `.test.tsx`;
- meter interacciones en `play` functions en lugar de tests;
- escribir stories sin args, controles, bloque JSDoc encima de `const meta` o JSDoc útil encima de cada story export;
- añadir stories redundantes que dupliquen controles, args, otra story o la cobertura normal del toolbar dark-mode;
- usar `description.component` en `parameters.docs`;
- usar `interface` o `any`;
- hardcodear colores, spacing o fuentes;
- abrir PR sin review pre-PR;
- dejar artefactos MCP antes de commit/review.

---

## Links de referencia

| Recurso               | URL                                                                          |
| --------------------- | ---------------------------------------------------------------------------- |
| GitHub Projects Board | [Stack-and-Flow Projects](https://github.com/orgs/Stack-and-Flow/projects/1) |
| Storybook producción  | [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)        |
| Guidelines            | [`docs/GUIDELINES.md`](./GUIDELINES.md)                                      |
| Diseño                | [`docs/DESIGN.md`](./DESIGN.md)                                              |
| Componentes           | [`docs/COMPONENTS.md`](./COMPONENTS.md)                                      |
| Quick Start           | [`docs/QUICK_START.md`](./QUICK_START.md)                                    |
| Gobernanza            | [`docs/GOVERNANCE.md`](./GOVERNANCE.md)                                      |
| WAI-ARIA APG          | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/)                      |
