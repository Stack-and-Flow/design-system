# Agent Context — Stack-and-Flow Design System

This file is read automatically by opencode/gentle-ai and injected as context for all agents.
Every rule here is **mandatory** — no exceptions.

---

## 1. Project Context

**Stack-and-Flow Design System** is an open-source, educational React component library built with strict architectural conventions. It is published as `@stack-and-flow/design-system`.

| Key | Value |
|-----|-------|
| Package | `@stack-and-flow/design-system` |
| Repo | https://github.com/Stack-and-Flow/design-system |
| Storybook | https://sf-design-system.netlify.app/ |
| Architecture doc | [`GUIDELINES.md`](../GUIDELINES.md) |
| Contributor guide | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |

**Stack**: React 19 · TypeScript strict · Tailwind v4 `@theme` · Radix UI · CVA · Storybook 8 · Biome · Lefthook · Vite · pnpm

**Available tooling**:
- `compilot-cli` — scaffolds the 5-file component structure automatically
- `pnpm run storybook` — starts Storybook with hot reload

---

## 2. Architecture Rules

### Atomic Design tiers

| Tier | What belongs here | Examples |
|------|------------------|---------|
| `atoms` | Single-purpose, no internal component deps | `Button`, `Badge`, `Input` |
| `molecules` | Composed of atoms, forms a functional unit | `Modal`, `SearchBar` |
| `organisms` | Complex sections composed of molecules + atoms | `Header`, `Sidebar` |

### 5-File Structure (STRICT — never deviate)

Every component lives in `src/components/{tier}/{kebab-name}/` with EXACTLY these files:

| File | Layer | Rule |
|------|-------|------|
| `ComponentName.tsx` | Presentational | ONLY JSX. Consumes the hook. Zero logic. |
| `useComponentName.ts` | Container / Hook | ALL logic, state, effects, CVA class calls. |
| `types.ts` | Types & Variants | `type` definitions + `cva` variants. JSDoc for controls. |
| `index.ts` | Public API | Re-exports component and types. |
| `ComponentName.stories.tsx` | Storybook docs | Stories, args, controls, description. |

**Where logic lives**:
- **CVA variants** → ONLY in `types.ts`
- **State, refs, effects, event handlers, aria computation** → ONLY in `useComponentName.ts`
- **JSX rendering** → ONLY in `ComponentName.tsx`

---

## 3. Code Standards

### TypeScript

- `type` ALWAYS — NEVER `interface`
- NEVER `any` — use `unknown` or narrow properly
- Component definition: `const Foo: FC<FooProps> = ({ ...props }) => { ... }`
- Export: `export default Component` in `.tsx`, re-export via `index.ts`

```typescript
// ✅ Correct
export type ButtonProps = { variant?: 'primary' | 'ghost' };
const Button: FC<ButtonProps> = ({ ...props }) => { ... };
export default Button;

// ❌ Wrong
export interface ButtonProps { variant?: string }
const Button = ({ variant }: any) => { ... };
```

### Tailwind & Tokens

- **MANDATORY**: Use CSS custom property tokens from `src/styles/theme.css` via Tailwind classes
- **NEVER** hardcode colors, spacing, or fonts — no `#hex`, no `16px`, no arbitrary `p-[14px]`
- Correct classes: `text-text-dark`, `bg-secondary`, `gap-sm`, `fs-h1`, `font-secondary-bold`
- NEVER modify `theme.css` without explicit user confirmation

### Exports

```typescript
// index.ts — always this pattern
import ComponentName from './ComponentName';
export * from './types';
export default ComponentName;
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Directories | `kebab-case` | `date-picker/` |
| Component files | `PascalCase` | `DatePicker.tsx` |
| Hook files | `camelCase` + `use` prefix | `useDatePicker.ts` |
| Types | `PascalCase` | `DatePickerProps` |
| CVA variants | `camelCase` + `Variants` suffix | `datePickerVariants` |

---

## 4. Storybook Rules

- **English ONLY** — stories, descriptions, comments, args labels
- **Mandatory controls**: JSDoc comments in `types.ts` drive the controls panel (`/** @control select */`)
- **Mandatory description**: every story file MUST include:
  ```typescript
  parameters: {
    docs: {
      description: {
        component: 'Concise English description of what the component does and when to use it.'
      }
    }
  }
  ```
- **Mandatory args**: define default `args` for the base `Default` story
- **Stories to always include**: `Default`, `Disabled`, and one story per important variant
- **NO DOM manipulation in module scope** — use Storybook decorators if DOM access is needed

---

## 5. Accessibility

- **Dynamic aria props**: NEVER hardcode `aria-label` values. Expose them as component props so consumers can translate/customize
- **Explicit roles**: Add `role` when semantic HTML doesn't convey the intent (e.g., `role="status"` on Badge, `role="switch"` on toggleable)
- **Focus**: all interactive elements must be keyboard-navigable with `focus-visible` styles (handled globally)
- **ARIA attributes required**: `aria-expanded`, `aria-pressed`, `aria-hidden`, `aria-disabled` — whichever applies per element

---

## 6. AI Workflow

When working in this project, agents MUST follow this workflow:

**Before creating a component**:
1. Check `src/components/` — verify the component does not already exist
2. Identify the correct atomic tier (atoms / molecules / organisms)
3. Use `compilot-cli` as the scaffold reference — or replicate its exact 5-file output

**During implementation**:
- Follow GUIDELINES.md rules without exception
- Use only tokens from `theme.css` — never invent or hardcode values
- Do NOT create files outside the 5-file structure
- Do NOT modify `theme.css` without explicit user confirmation
- Do NOT add new npm/pnpm dependencies without explicit user confirmation

**For Storybook**:
- Always include `Default`, `Disabled`, and one story per key prop variant
- Always set proper `args` and JSDoc-driven controls
- Always write descriptions in English

**Commits**:
- Always use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`

---

## 7. Anti-Patterns (NEVER do these)

The following will cause immediate PR rejection and must NEVER appear in agent-generated code:

| Anti-pattern | Why it's wrong |
|-------------|----------------|
| Logic in `ComponentName.tsx` | Violates Container/Presentational split |
| `cva` in `.tsx` or `useHook.ts` | CVA belongs exclusively in `types.ts` |
| `export interface` | This project uses `type` exclusively |
| `any` type | Type safety is non-negotiable |
| Hardcoded `#hex`, `px`, `rem` in classes | Breaks token system |
| Arbitrary Tailwind values (`p-[14px]`, `text-[#000]`) | Same as above |
| Spanish in code, comments, or stories | English only |
| DOM APIs in module scope of stories | Breaks Storybook SSR |
| Multiple components in one file | One component = one directory |
| Missing Storybook controls or description | Docs are mandatory, not optional |
| Modifying `theme.css` without confirmation | Tokens are a design decision |
| Adding dependencies without confirmation | Package changes need team approval |
