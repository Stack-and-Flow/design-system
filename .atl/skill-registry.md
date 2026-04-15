# Skill Registry — Stack-and-Flow Design System

## Project Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `component-contributor` | Implementing a component from a GitHub issue spec | [SKILL.md](skills/component-contributor/SKILL.md) |

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
