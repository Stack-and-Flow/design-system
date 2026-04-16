# Skill Registry — Stack-and-Flow Design System

## Project Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `component-contributor` | Implementing a component from a GitHub issue spec | [SKILL.md](skills/component-contributor/SKILL.md) |
| `visual-review` | Reviewing component visual quality, auditing states, checking hover/focus/active/disabled, verifying glow/blur/gradient/transition rules | [SKILL.md](skills/visual-review/SKILL.md) |

## Compact Rules

### component-contributor
Load when: contributor shares a GitHub issue URL or spec and asks to implement a component.

Workflow: **Read spec → Plan (confirm with contributor) → Implement 5 files → Explain each decision**

File order: `types.ts` → `useComponentName.ts` → `ComponentName.tsx` → `ComponentName.stories.tsx` → `index.ts`

Non-negotiables:
- CVA variants ONLY in `types.ts`
- Logic ONLY in `useComponentName.ts`
- JSX ONLY in `ComponentName.tsx`
- Tokens from `theme.css` only — no hardcoded values
- `type` always, never `interface`, never `any`
- Explain every decision after each file — contributor must understand, not just copy
- Background canvas is `#060C13` (blue-slate) — NEVER pure black `#000000`
- Cards use `color-surface-dark` (`#0B131E`) + border `color-border-dark` (`#172230`)
- Focus ring: `focus-visible:shadow-[var(--glow-focus-dark)]` — NEVER `outline`
- Disabled: `disabled:opacity-40` — NEVER color substitution
- Transitions: enumerate properties — NEVER `transition-all`
- `backdrop-filter: blur` ONLY on floating elements (navbar, modal, sidebar)
- Gradient borders via `::before` pseudo-element — NEVER `border-image`
- Stories: `Default` args must NOT hardcode props that override `defaultVariants`

### visual-review
Load when: reviewing a component's visual implementation, auditing interactive states, writing new variants, verifying accessibility of interactive elements.

Workflow: **Read COMPONENTS.md → Check all 6 protocol sections → Report issues by severity**

Severity levels: CRITICAL (a11y failure) → MAJOR (compositional violation) → MINOR (spec inconsistency) → SUGGESTION

Non-negotiables:
- Focus ring ALWAYS via `box-shadow`, never `outline`
- Disabled state ALWAYS via `opacity: 0.4`, never color substitution
- `backdrop-filter: blur` ONLY on floating elements (navbar, modals, sidebar)
- Gradient borders ALWAYS via `::before` pseudo-element, never `border-image`
- NEVER `transition: all` — enumerate specific properties
- Button Primary glow: exactly 4 layers at rest, amplified on hover
- Verify token values in `theme.css` before flagging a raw value as wrong
