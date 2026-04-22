---
name: bootstrapping
description: >
  Guides an external project through adopting Stack-and-Flow as their design system base.
  Covers: installing the package, importing the CSS, configuring Tailwind v4 to consume the tokens,
  and customizing the token layer (colors, typography, spacing) to match their brand.
  Scope: token customization only — component architecture and structure are not modified.
  Trigger: When an external project wants to use Stack-and-Flow as a base and customize its tokens.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- An external project wants to install `@stack-and-flow/design-system` and use it as a foundation
- A team wants to customize the brand colors, typography, or spacing while keeping all components
- Someone says "use your design system for my project", "customize the tokens", "white-label this", or similar

> **Scope boundary**: This skill covers token customization ONLY.
> It does NOT cover: adding new components, modifying existing component code, changing the atomic structure, or forking the repository.
> If a team needs structural changes, they should fork — this skill is for adoption, not modification.

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-apply`:

- **Change name**: the SDD change being applied
- **Tasks assigned**: which setup/customization tasks to execute
- **Target project context**: stack, framework, existing CSS setup
- **Artifact store mode**: `engram | openspec | hybrid | none`

When delegated: skip Phase 0 and start from Phase 1.
Return in the SDD return envelope format:

```markdown
## Bootstrapping Progress

**Change**: {change-name}
**Tasks completed**: {list}
**Files created/modified**: {table: file | action | what was done}
**Deviations**: {list or "None"}
**Issues found**: {list or "None"}
**Status**: {N}/{total} tasks complete. Ready for verify / Blocked by X
```

---

## Phase 0 — Project Discovery

Before writing any configuration, understand the target project:

Ask (or read from context) the following:

1. **Framework** — Next.js / Vite / Remix / other? (affects CSS import location)
2. **Tailwind version** — must be v4; if v3, explain the migration requirement before proceeding
3. **Existing CSS setup** — do they have a global CSS file? Where?
4. **Package manager** — npm / pnpm / yarn / bun?
5. **Brand tokens to customize**:
   - Primary brand color (the main action color — replaces `#ff0036`)
   - Secondary/accent color (if any)
   - Background canvas color (replaces `#060C13`)
   - Font family (replaces Space Grotesk)
   - Any specific spacing or radius overrides?

If any information is missing, ask before proceeding. Do NOT assume brand values.

---

## Phase 1 — Installation

### Step 1.1 — Install the package

```bash
# pnpm
pnpm add @stack-and-flow/design-system

# npm
npm install @stack-and-flow/design-system

# yarn
yarn add @stack-and-flow/design-system
```

### Step 1.2 — Verify peer dependencies are installed

The consumer project must have these installed:

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "tailwindcss": ">=4.0.0"
}
```

If any are missing, install them before proceeding.

### Step 1.3 — Import the CSS

Import the design system styles **once** at the root of the application.

**Next.js (App Router)** — `app/layout.tsx`:
```typescript
import '@stack-and-flow/design-system/styles'
```

**Next.js (Pages Router)** — `pages/_app.tsx`:
```typescript
import '@stack-and-flow/design-system/styles'
```

**Vite** — `src/main.tsx`:
```typescript
import '@stack-and-flow/design-system/styles'
```

**Remix** — `app/root.tsx` (in the `links` export):
```typescript
import stylesHref from '@stack-and-flow/design-system/styles?url'

export const links = () => [
  { rel: 'stylesheet', href: stylesHref },
]
```

---

## Phase 2 — Tailwind v4 Configuration

Tailwind v4 uses CSS-first configuration. The design system's tokens are already declared in the imported CSS file. No `tailwind.config.js` is needed.

### Step 2.1 — Verify Tailwind v4 CSS entry

The project's main CSS file must include the Tailwind v4 directives:

```css
@import "tailwindcss";
```

If the project is still using Tailwind v3 (`@tailwind base; @tailwind components; @tailwind utilities;`), they must migrate to v4 first. Provide the migration path:

```css
/* Tailwind v3 — remove these */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Tailwind v4 — replace with this */
@import "tailwindcss";
```

### Step 2.2 — Verify content scanning

Tailwind v4 auto-detects content. No `content` array needed.
If the project uses a custom `@source` directive, ensure it includes the design system node_modules:

```css
@source "../../node_modules/@stack-and-flow/design-system/dist";
```

---

## Phase 3 — Token Customization

This is the core of the bootstrapping process. The consumer overrides only the tokens they want to change. All other tokens inherit from the design system defaults.

### Step 3.1 — Create the brand override file

Create `src/styles/brand.css` (or equivalent) in the consumer project:

```css
@import "tailwindcss";
@import "@stack-and-flow/design-system/styles";

@theme {
  /* Override only the tokens you want to change */
  /* All other tokens inherit from the design system */
}
```

### Step 3.2 — Color token overrides

Replace the brand color system with the consumer's brand:

```css
@theme {
  /* === BRAND COLORS ===
   * Replace with your primary brand color.
   * Used for: primary buttons, active states, focus rings, brand accents.
   * Light mode minimum for text: 4.5:1 contrast on white (WCAG AA).
   */
  --color-brand-primary: #your-primary-color;
  --color-brand-primary-hover: #your-primary-hover;  /* slightly lighter/brighter */
  --color-brand-primary-active: #your-primary-active; /* slightly darker */

  /* Light mode brand — must pass WCAG AA on white background */
  --color-brand-primary-light: #your-light-mode-primary;

  /* === CANVAS & SURFACE ===
   * The background system. Keep the hierarchy: canvas < surface < raised < overlay.
   */
  --color-canvas: #your-darkest-background;      /* page background */
  --color-surface-dark: #your-card-background;   /* card / panel background */
  --color-surface-raised-dark: #your-elevated;   /* elevated surface */
  --color-border-dark: #your-border-color;       /* default border */

  /* === TYPOGRAPHY ===
   * Override the font family.
   */
  --font-sans: 'Your Font Name', system-ui, sans-serif;
  --font-mono: 'Your Mono Font', ui-monospace, monospace; /* optional */
}
```

### Step 3.3 — Typography scale overrides (optional)

Only override if the consumer's design system requires a different type scale:

```css
@theme {
  /* Font size scale — only override what differs */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
}
```

### Step 3.4 — Spacing overrides (optional)

Stack-and-Flow uses a standard 4px base grid. Only override if the consumer uses a different base:

```css
@theme {
  /* Component-level spacing */
  --spacing-component-xs: 0.25rem;  /* 4px */
  --spacing-component-sm: 0.5rem;   /* 8px */
  --spacing-component-md: 1rem;     /* 16px */
  --spacing-component-lg: 1.5rem;   /* 24px */
  --spacing-component-xl: 2rem;     /* 32px */
}
```

### Step 3.5 — Border radius overrides (optional)

```css
@theme {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 9999px;
}
```

---

## Phase 4 — Verification

After configuration, verify the setup is working correctly.

### Step 4.1 — Import a component and verify rendering

```typescript
import Button from '@stack-and-flow/design-system'
// or named import
import { Button } from '@stack-and-flow/design-system'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-canvas p-8">
      <Button variant="primary">Test Button</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  )
}
```

Expected result:
- Canvas background uses the consumer's `--color-canvas` override
- Button uses the consumer's `--color-brand-primary` override
- Tailwind utilities (`bg-canvas`, `text-brand-primary`) resolve correctly

### Step 4.2 — Verify focus ring uses brand color

Click into the Button using keyboard Tab. The focus ring should appear in the consumer's brand color, not the default Stack-and-Flow red.

If focus ring still shows the original red:
- Check that the `@import "@stack-and-flow/design-system/styles"` comes BEFORE the `@theme` override block
- CSS custom properties cascade — the override must come AFTER the base declaration

### Step 4.3 — Verify dark/light mode

If the consumer project supports dark mode:
- Test in both modes — components should adapt using the overridden token values
- If tokens are not adapting, verify the dark mode selector matches (`.dark` class vs. `@media prefers-color-scheme`)

---

## Phase 5 — Handoff Notes

After setup is complete, provide the consumer with these guidelines:

```markdown
## Using Stack-and-Flow in Your Project

### Token customization
- Edit `src/styles/brand.css` to change any token
- Only override what you need — everything else inherits from the design system
- Token reference: [link to Stack-and-Flow Storybook]

### Importing components
- Import from `@stack-and-flow/design-system`
- Import types: `import type { ButtonProps } from '@stack-and-flow/design-system'`

### What you should NOT do
- Do NOT modify files in `node_modules/@stack-and-flow/design-system/`
- Do NOT copy component source files into your project — use the package
- Do NOT override component class names with `!important` — customize via tokens
- If a component doesn't support a use case, open an issue in the Stack-and-Flow repo

### Updating the design system
- Run `pnpm update @stack-and-flow/design-system` to get the latest version
- Check the CHANGELOG for breaking changes before updating
- Token names are part of the public API — breaking changes will be in major versions only
```

---

## Rules

- NEVER suggest forking or copying component source files — this defeats the purpose of a distributable library
- NEVER modify the design system package itself — only the consumer's override layer
- ALWAYS verify Tailwind v4 is being used — v3 is incompatible with the `@theme` token system
- ALWAYS check CSS import order — overrides MUST come after the base import
- ALWAYS flag WCAG AA contrast issues when the consumer provides a brand color — it is your responsibility to warn them if their color fails accessibility on the backgrounds they will use
- When delegated from SDD, use the SDD return envelope — do not return a free-form report
