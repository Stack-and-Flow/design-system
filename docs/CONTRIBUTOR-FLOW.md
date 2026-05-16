# Flujo del Contributor — Stack-and-Flow Design System

Este es el documento canónico para contribuir componentes al design system. `CONTRIBUTING.md` explica el setup general; este archivo define el flujo operativo de componentes y los checkpoints que debe seguir cualquier contributor, con o sin IA.

---

## Resumen rápido

```text
Project task → Research → Spec proposal skill → Validated issue spec → Spec review → Visual preflight → Plan → Implementación → Visual review → Pre-PR component review → PR → Review → Merge
```

La regla central: **la IA ejecuta, el contributor decide**. La spec, los criterios visuales y la aprobación de checkpoints son responsabilidad humana.

---

## Fuentes de verdad

| Tema                            | Fuente                                             |
| ------------------------------- | -------------------------------------------------- |
| Setup del repo                  | [`CONTRIBUTING.md`](./CONTRIBUTING.md)             |
| Arquitectura y reglas de código | [`GUIDELINES.md`](./GUIDELINES.md)                 |
| Tokens y lenguaje visual        | [`DESIGN.md`](./DESIGN.md), `src/styles/theme.css` |
| Estados visuales por componente | [`COMPONENTS.md`](./COMPONENTS.md)                 |
| Toma y validación de specs      | `.atl/skills/component-spec-proposer/SKILL.md`     |
| Flujo detallado con IA          | `.atl/skills/component-contributor/SKILL.md`       |
| Auditoría pre-PR                | `.atl/skills/components-auditor/SKILL.md`          |

Si hay contradicción, el orden de autoridad es: `GUIDELINES.md` / `DESIGN.md` para código visual, `.atl/skills/*` para ejecución asistida por agentes, y este documento para el flujo humano.

---

## Paso 1 — Tomar una tarea

1. Elegí una tarea en el [GitHub Projects Board](https://github.com/orgs/Stack-and-Flow/projects/1).
2. Asignátela.
3. Movela a **In Progress**.
4. Verificá que tenga issue asociada. La issue es el contrato de implementación.

---

## Paso 2 — Research

Antes de pedir implementación, investigá el componente.

Checklist mínimo:

- Referencias: HeroUI, Radix UI, shadcn/ui, MDN o WAI-ARIA APG según aplique.
- Nivel atómico: `atom`, `molecule` u `organism`.
- Props: nombre, tipo, default, required/optional.
- Variantes CVA: keys y valores.
- Estados: base, hover, focus, active/pressed, disabled, loading, error, empty si aplica.
- Accesibilidad: roles, `aria-*`, teclado, focus management, touch target.
- Diseño: superficie, color, spacing, radius, shadow/glow, transiciones, dark mode.

No hagas research a medias. Si la issue está incompleta, el componente sale incompleto.

---

## Paso 3 — Tomar y validar la spec con `component-spec-proposer`

Antes de implementar, usá la skill `component-spec-proposer` para convertir la tarea y su referencia en una spec validada.

Cuándo usarla:

- La issue tiene una referencia HeroUI, Radix, MDN, APG o similar.
- La tarea todavía es vaga o tiene decisiones abiertas.
- Necesitás preparar la issue antes de pasar a implementación.

Prompt sugerido:

```text
Prepará la spec para este componente usando component-spec-proposer.

Issue: {issue_url}
Referencia: {reference_url}

No implementes todavía. Primero proponé la spec, listá assumptions a validar y esperá mi aprobación antes de escribir en GitHub.
```

La skill debe:

1. Leer la issue y la referencia.
2. Proponer una spec usando la plantilla de `component-spec-proposer`.
3. Listar assumptions a validar.
4. Esperar aprobación humana.
5. Recién después de la aprobación, escribir `## Validated component spec` en la issue.
6. Actualizar el Project item a `In progress` cuando corresponda.
7. Indicar el siguiente paso: arrancar `component-contributor`.

No uses `component-contributor` para implementar hasta que la spec esté validada.

---

## Paso 4 — Documentar la spec en la issue

La spec validada debe quedar en la issue como contrato verificable.

| Campo              | Qué debe decir                                             |
| ------------------ | ---------------------------------------------------------- |
| Component name     | PascalCase                                                 |
| Atomic tier        | atom / molecule / organism                                 |
| Props              | Nombre, tipo TypeScript, default, required/optional        |
| CVA variants       | Variant keys y valores posibles                            |
| States             | Descripción visual y de comportamiento por estado          |
| Accessibility      | Roles, atributos, teclado, focus, reduced motion si aplica |
| Reference URL      | HeroUI, Radix, MDN, APG, etc.                              |
| Design notes       | Decisiones visuales específicas del sistema                |
| Story requirements | Default, Disabled, variantes clave, edge cases             |

> Regla de oro: si no está en la issue, el agente no debería inventarlo.

---

## Paso 5 — Crear rama y preparar entorno

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feat/nombre-componente
pnpm install
pnpm run storybook
```

Usá una rama por unidad de trabajo: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.

---

## Paso 6 — Iniciar el flujo de implementación con IA

En opencode/gentle-ai, compartí la URL de la issue:

Prompt sugerido:

```text
Implementá este componente usando component-contributor.

Issue: {issue_url}

Usá la sección `## Validated component spec` como contrato. No inventes props ni comportamiento fuera de la spec. Pausá en los checkpoints de spec review, visual preflight y plan antes de escribir código.
```

El agente debe cargar `component-contributor` y consumir la spec validada por `component-spec-proposer`. Si salta una fase, frenalo.

---

## Las 8 fases de implementación del componente

### Fase 1 — Lectura de spec validada

El agente lee la sección `## Validated component spec` de la issue y extrae componente, tier, props, variantes, estados, accesibilidad, referencia y notas de diseño.

Salida esperada:

- resumen de la spec;
- preguntas si algo es ambiguo;
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
- focus visible con `box-shadow`, nunca `outline` desnudo;
- touch target mínimo `44×44px`;
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
- [ ] Conventional commit.
- [ ] Tests relevantes pasan.
- [ ] Build o checks requeridos pasan.
- [ ] Pre-PR component review incluido o resumido.
- [ ] Storybook docs tiene `parameters.docs.description.component`.
- [ ] `## Descripción` presente.
- [ ] `## Dependencies` solo si aplica.
- [ ] `## Guía de uso` solo si aplica.

Prompt sugerido:

```text
Prepará el PR para {component_name}.

Linkeá `Closes #{issue_number}`. Incluí resumen, tabla de cambios, evidencia de tests/build, resultado de la pre-PR component review y notas visuales si aplica. No abras el PR si la review está BLOCKED.
```

---

## Criterio Storybook actual

`parameters.docs.description.component` debe usar esta estructura:

```markdown
## Descripción

Qué hace el componente y cuándo usarlo.

## Dependencies

Solo si usa otros componentes del design system o primitives externas.

## Guía de uso

Solo si la composición o uso tiene restricciones no obvias.
```

El contenido sigue en inglés por defecto; los headings anteriores son la convención canónica.

---

## Reglas que la IA no puede saltarse

Si el agente propone cualquiera de estas cosas, rechazalo:

- modificar `src/styles/theme.css` sin aprobación explícita;
- añadir dependencias sin discutirlo;
- usar una arquitectura de archivo único;
- omitir tests `.test.tsx`;
- meter interacciones en `play` functions en lugar de tests;
- escribir stories sin args, controles o docs description;
- usar `interface` o `any`;
- hardcodear colores, spacing o fuentes;
- abrir PR sin review pre-PR.

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
