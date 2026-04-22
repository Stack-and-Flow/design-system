# Flujo del Contributor — Stack-and-Flow Design System

Este documento explica el proceso completo para contribuir un componente al design system, desde que tomas una tarea hasta que el PR está mergeado. Está pensado para seguirse en orden.

---

## Visión general

```
GitHub Project → Research → Issue (spec) → opencode + gentle-ai → PR → Review → Merge
```

El flujo tiene dos mitades:

- **Tu trabajo** (Research + Spec): entender el componente, definir su API y documentarla en la issue.
- **Trabajo asistido por IA** (Implementación + Revisión visual): el agente implementa siguiendo tu spec, tú validas en cada checkpoint.

La IA nunca toma decisiones de diseño por ti. Tú defines qué construir; ella ejecuta cómo construirlo.

---

## Paso 1 — Tomar una tarea

Todas las tareas viven en el [GitHub Projects Board](https://github.com/orgs/Stack-and-Flow/projects/1).

1. Elige una tarea con estado **Ready** o **Backlog**.
2. Asígnatela a ti mismo.
3. Muévela a **In Progress**.

Cada tarea tiene una issue asociada. Esa issue es tu punto de partida y también el contrato que el agente usará para implementar.

---

## Paso 2 — Research

Antes de escribir una sola línea de código o completar la issue, investiga el componente.

**Qué investigar:**

- **Referencias visuales** — Busca el componente en [HeroUI](https://heroui.com), [Radix UI](https://radix-ui.com), [shadcn/ui](https://ui.shadcn.com) y [MDN](https://developer.mozilla.org). Anota cómo resuelven la API, qué props exponen y cómo gestionan accesibilidad.
- **Nivel atómico** — Decide si es un `atom`, `molecule` u `organism` según [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/). Los átomos son los bloques más pequeños (Button, Badge, Input). Las moléculas combinan átomos (SearchBar = Input + Button). Los organismos son secciones completas.
- **Props y variantes** — Lista todas las props que necesita. Identifica qué varía visualmente (variantes CVA) y qué es comportamiento (lógica en el hook).
- **Estados** — Enumera todos los estados interactivos: default, hover, focus, active/pressed, disabled, loading, error. Todos los estados deben estar implementados — sin excepciones.
- **Accesibilidad** — Consulta [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) para el patrón correspondiente. Anota roles, atributos `aria-*` y comportamiento de teclado.

No hagas research a medias. El agente implementa exactamente lo que hay en la issue — si la spec está incompleta, el componente estará incompleto.

---

## Paso 3 — Documentar la spec en la issue

Con el research hecho, abre la issue de GitHub y rellena la sección **Specification** usando la plantilla `component.yml`.

La spec debe incluir:

| Campo | Qué poner |
|---|---|
| **Component name** | Nombre en PascalCase |
| **Atomic tier** | atom / molecule / organism |
| **Props** | Nombre, tipo TypeScript, default, required/optional |
| **CVA variants** | Nombre de la variant key + valores posibles |
| **States** | Lista de estados con descripción visual |
| **Accessibility** | Roles ARIA, atributos, comportamiento de teclado |
| **Reference URL** | URL del componente de referencia (HeroUI, Radix, etc.) |
| **Design notes** | Cualquier detalle visual o de interacción específico del sistema |

> **Regla de oro:** si no está en la issue, el agente no lo implementará. Si lo inventa, lo rechazarás en el checkpoint de Plan.

---

## Paso 4 — Configurar el entorno local

Si aún no tienes el entorno listo:

```bash
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system
nvm use
pnpm install
pnpm run storybook
```

Crea tu rama antes de empezar:

```bash
git checkout -b feat/nombre-componente
```

Nomenclatura: `feat/`, `fix/`, `chore/`, `docs/` según el tipo de cambio.

---

## Paso 5 — Iniciar el flujo con gentle-ai

Abre el directorio del proyecto en [opencode](https://opencode.ai/). El archivo `.atl/AGENTS.md` se inyecta automáticamente — el agente ya conoce la arquitectura, los tokens y las reglas del proyecto sin configuración manual.

Para activar el flujo, comparte la URL de la issue:

```
Implementa este componente: https://github.com/Stack-and-Flow/design-system/issues/XXX
```

El agente cargará la skill `component-contributor` y seguirá las 5 fases descritas a continuación.

---

## Las 5 fases del flujo

### Fase 1 — Lectura de spec

El agente extrae de la issue:

- Nombre del componente y nivel atómico
- Props completas con tipos
- Variantes CVA y sus valores
- Estados interactivos
- Requisitos de accesibilidad
- URL de referencia

**Si algo es ambiguo, el agente te pregunta antes de continuar.** No inventa comportamiento. Si ves que asume algo que no definiste, corrígelo aquí — es más barato que corregirlo después.

El agente también declara qué módulos de tokens necesita (colores, espaciado/tipografía, efectos) según el tipo de componente. Solo carga los módulos relevantes.

---

### Fase 2 — Plan

Antes de escribir código, el agente presenta un plan completo:

```
## Implementation Plan

Component: Button
Tier: atoms
Directory: src/components/atoms/button/

Files to create:
1. types.ts — 4 props, 2 CVA variants (variant, size)
2. useButton.ts — click handler, aria-disabled, className
3. Button.tsx — presentational, consumes hook
4. Button.stories.tsx — 5 stories: Default, Disabled, Outlined, Small, Large
5. index.ts — re-exports

Design decisions:
- Tokens: gradient-btn-primary, glow-btn-primary, spacing-md, radius-pill
- CVA variants: variant (default, outlined), size (sm, md, lg)
- Radix: no — native <button>
- Dark mode: paired light/dark tokens

Accessibility:
- aria-disabled instead of disabled attribute
- Keyboard: Enter and Space activate
```

**Este es tu checkpoint más importante.** Revisa el plan con atención:

- ¿Las props son las que definiste?
- ¿Las variantes tienen sentido?
- ¿Los tokens son los correctos?
- ¿La accesibilidad cubre lo que investigaste?

Confirma el plan o pide ajustes. Una vez que lo apruebas, el agente empieza a escribir código.

---

### Fase 3 — Implementación

El agente crea los 5 archivos en este orden fijo:

```
types.ts → useComponentName.ts → ComponentName.tsx → ComponentName.stories.tsx → index.ts
```

**¿Por qué ese orden?** Porque los tipos son el contrato que todo lo demás consume. Si los tipos cambian, cambia todo. Definirlos primero evita reescribir.

| Archivo | Responsabilidad |
|---|---|
| `types.ts` | Todas las props tipadas + todas las variantes CVA. Nunca `interface`, nunca `any`. |
| `useComponentName.ts` | Toda la lógica: estado, efectos, handlers, cálculo de className. Sin JSX. |
| `ComponentName.tsx` | Solo JSX. Consume el hook. Sin lógica, sin estado, sin CVA. |
| `ComponentName.stories.tsx` | Stories en inglés: Default, Disabled + una por variante clave. |
| `index.ts` | Re-exportaciones públicas. |

---

### Fase 4 — Explicación (inline)

Después de cada archivo, el agente explica sus decisiones:

```
### Why this file looks like this

- CVA en types.ts, no en el hook: porque las variantes son datos de presentación,
  no lógica. El hook solo las consume.
- bg-color-primary en lugar de bg-red-500: porque los tokens abstractos permiten
  cambiar el tema sin tocar los componentes.
- aria-disabled en vez de disabled: porque el atributo HTML disabled elimina el
  elemento del tab order, rompiendo la navegación por teclado.
```

**No te saltes estas explicaciones.** Son la capa de aprendizaje del flujo — la diferencia entre copiar código y entender por qué está escrito así.

---

### Fase 5 — Revisión visual

Una vez completados los 5 archivos, el agente ejecuta una revisión visual obligatoria antes de declarar el componente terminado.

**Qué verifica:**

**Estados** — Todos los estados interactivos implementados: base, hover, focus, active/pressed, disabled.

**Glow y sombras** — Botón primario: glow siempre activo (4 capas). Botón secundario: glow siempre activo (3 capas). Cards y nav: glow solo en hover.

**Transiciones** — Nunca `transition: all`. Propiedades específicas enumeradas. Duraciones correctas por tipo de componente (250ms botones, 300ms cards, 150ms dropdowns).

**Accesibilidad visual** — Focus ring via `box-shadow`, nunca `outline` desnudo. Disabled via `opacity: 0.4`, nunca sustitución de color. Touch target mínimo `44×44px`. Contraste en light mode: mínimo `#cc0030` para rojo sobre blanco.

**Niveles de severidad:**

| Nivel | Significado | Bloquea el PR |
|---|---|---|
| **CRITICAL** | Fallo de accesibilidad | ✅ Sí |
| **MAJOR** | Regla compositiva rota | ✅ Sí |
| **MINOR** | Inconsistencia con la spec | Debe corregirse |
| **SUGGESTION** | Mejora opcional | No |

Si hay fallos CRITICAL o MAJOR, se corrigen antes de abrir el PR. Sin excepciones.

---

## Paso 6 — Abrir el PR

Con el componente implementado y la revisión visual pasada, abre el PR contra `main`.

**Checklist antes de pedir revisión:**

**Estructura**
- [ ] Arquitectura de 5 archivos completa y en el directorio correcto
- [ ] Sin `interface` (solo `type`), sin `any`
- [ ] Storybook con `args`, `controls` y `description` en inglés

**Tokens y theming**
- [ ] Solo tokens de `theme.css` — sin valores hardcodeados
- [ ] Dark mode con clases `light/dark:` pareadas

**Estados visuales**
- [ ] Hover, focus, active y disabled implementados
- [ ] Focus ring via `box-shadow`, no `outline`
- [ ] Disabled via `opacity: 0.4`, sin sustitución de color
- [ ] Sin `transition: all`
- [ ] Touch target mínimo `44×44px`

**Accesibilidad**
- [ ] Atributos ARIA de la spec implementados
- [ ] `prefers-reduced-motion` si hay transforms

**Git**
- [ ] Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)

---

## Paso 7 — Code review

El PR pasa por el mismo proceso de revisión independientemente de si fue asistido por IA o escrito manualmente.

- CI debe pasar: Biome (lint/format), TypeScript strict, tests, build de Storybook, a11y (axe WCAG AA).
- Al menos un maintainer debe aprobar antes del merge.
- "Lo generó la IA" no es una justificación válida para saltarse el checklist. Eres responsable de cada línea en tu PR.

---

## Reglas que la IA no puede saltarse

Si el agente propone cualquiera de estas cosas, recházalo y redirigelo:

- Modificar `src/styles/theme.css` sin tu aprobación explícita
- Añadir dependencias npm/pnpm sin discutirlo
- Reemplazar la arquitectura de 5 archivos por un archivo único
- Escribir stories en español o sin controls/descripción
- Usar `interface` en lugar de `type`, o introducir `any`
- Hardcodear colores, espaciados o fuentes

---

## Links de referencia

| Recurso | URL |
|---|---|
| GitHub Projects Board | [Stack-and-Flow Projects](https://github.com/orgs/Stack-and-Flow/projects/1) |
| Storybook (producción) | [sf-design-system.netlify.app](https://sf-design-system.netlify.app/) |
| Guidelines completas | [`docs/GUIDELINES.md`](./GUIDELINES.md) |
| Referencia visual | [`docs/DESIGN.md`](./DESIGN.md) |
| Quick Start | [`docs/QUICK_START.md`](./QUICK_START.md) |
| Gobernanza | [`docs/GOVERNANCE.md`](./GOVERNANCE.md) |
| opencode | [opencode.ai](https://opencode.ai/) |
| WAI-ARIA Authoring Practices | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) |
