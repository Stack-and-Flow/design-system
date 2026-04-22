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

## Tests de interacción en Storybook

Todo componente interactivo (buttons, inputs, selects, etc.) DEBE incluir tests de interacción usando `play` functions en sus stories.

### ¿Cómo escribir tests?

Usa `@storybook/test` directamente en tus `.stories.tsx`:

```tsx
import { expect, userEvent, within } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Interactive: Story = {
  args: {
    children: 'Click me'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /click me/i });
    
    // Verifica que el botón se renderiza
    await expect(button).toBeInTheDocument();
    
    // Simula un click
    await userEvent.click(button);
    
    // Verifica el resultado esperado
    await expect(button).toHaveClass('your-expected-class');
  }
};
```

### Panel de Interactions en Storybook

El addon `@storybook/addon-interactions` está habilitado. Cuando ejecutas `pnpm storybook`, verás un **panel "Interactions"** en la parte inferior para cualquier story con `play` function. Este panel te muestra paso a paso cada aserción y acción del test.

### Ejecutar tests desde la terminal

```bash
# Ejecutar todos los tests de Storybook
pnpm test-storybook

# Ejecutar tests en modo watch
pnpm test-storybook --watch
```

Los tests usan Playwright bajo el capó y ejecutan las `play` functions en un navegador real.

### Checklist de tests

Antes de abrir un PR, verifica:
- [ ] Los componentes interactivos tienen `play` functions con tests básicos
- [ ] Los tests verifican renderizado, interacciones (click, hover, type) y accesibilidad
- [ ] `pnpm test-storybook` pasa sin errores (o documenta los fallos conocidos)

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
- [ ] Los componentes interactivos tienen tests de interacción con `play` functions.
- [ ] `pnpm test-storybook` pasa sin errores críticos.
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
- La arquitectura de 5 archivos y dónde corresponde cada pieza de lógica
- Qué tokens de diseño usar (y qué valores hardcodeados evitar)
- Las reglas de Storybook y la estructura requerida de stories
- La lista completa de anti-patrones que provocan rechazo de PR

**Para activarlo**: simplemente abre el directorio del proyecto en opencode. No se requiere configuración manual — el contexto se carga automáticamente.

---

### Flujo IA para componentes

Al usar gentle-ai (opencode) para crear un componente, el agente sigue la skill `component-contributor` que cubre el flujo completo en 5 fases. Como contributor, tu trabajo es guiar cada checkpoint:

1. **Research** — Antes de pedir implementación, investiga el componente: referencias (HeroUI, Radix, MDN), props necesarias, variantes, estados y requisitos de accesibilidad. Documenta todo en la issue usando la plantilla `component.yml`.

2. **Spec** — Comparte la URL de la issue o pega su contenido en el agente. El agente leerá y extraerá la spec completa. Si algo es ambiguo, **te preguntará antes de continuar** — nunca inventa comportamiento.

3. **Plan** — El agente presentará un plan detallado: archivos a crear, tokens a usar, variantes CVA, decisiones de Radix y accesibilidad. **Revisa el plan y confirma** antes de que empiece a escribir código. Este es tu mejor momento para corregir el rumbo.

4. **Implementación** — El agente crea los 5 archivos en orden (`types.ts` → hook → componente → stories → `index.ts`) y explica cada decisión al terminar cada archivo. No saltes las explicaciones — son la capa de aprendizaje del flujo.

5. **Revisión visual** — Una vez completados los 5 archivos, el agente ejecuta una revisión visual obligatoria: verifica estados (hover, focus, active, disabled), corrección del glow, transiciones, contraste y touch targets. Cualquier fallo CRITICAL o MAJOR debe resolverse antes de abrir el PR.

> Para activar el flujo completo, simplemente comparte la URL de la issue y di "implementa este componente". La skill se carga automáticamente.

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
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Gobernanza**: [GOVERNANCE.md](./GOVERNANCE.md)
