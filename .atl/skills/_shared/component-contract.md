# Stack-and-Flow Component Contract

Use this reference before implementing, auditing, or PR-reviewing a component. It is the single source of truth for component structure, TypeScript, token, Storybook, test, and export rules. Lifecycle skills should point here instead of copying this checklist.

## Required file pattern

Every component directory contains exactly:

1. `types.ts` — CVA variants, component-specific public types, and Storybook control annotations.
2. `useComponentName.ts` — logic, state, refs, event handlers, aria derivation, and `componentVariants(...)` calls.
3. `ComponentName.tsx` — JSX only; consumes the hook; no state, CVA calls, or inline business logic.
4. `ComponentName.test.tsx` — hook tests plus component behavior/accessibility tests.
5. `ComponentName.stories.tsx` — Storybook examples that follow `component-contributor/references/stories.md`.
6. `index.ts` — named component export and type exports only.

No extra component files unless a spec explicitly approves a composition split.

## TypeScript and architecture

- Use `type`, never `interface`.
- Use `import type` / `export type` for types.
- Use named component exports; avoid default component exports.
- Reusable/systemic prop types live in `src/types`; component-local types stay component-specific.
- `types.ts` imports `cva` and `VariantProps` from `class-variance-authority`; all CVA variants and `defaultVariants` live there.
- Every public component prop declared through `types.ts` must have Storybook-facing JSDoc when it is story-exposed, including `@control type` where applicable.
- Every public prop with a runtime default must document the same default with `@default value` in `types.ts`. Runtime defaults include CVA `defaultVariants`, hook/component destructuring defaults, alias/coalesced fallbacks, and boolean fallback chains such as `disabled ?? isDisabled ?? false`.
- Run `node scripts/verify-prop-default-docs.mjs` before handoff; missing `@default` docs are a component contract violation. Prose descriptions are optional unless the public API needs clarification.
- Hooks return explicit typed objects; never `any`.
- No `Array<T>` when `T[]` is equivalent.
- No non-null assertions, `@ts-ignore`, or `@ts-expect-error` without a documented reason.
- Native element props use `ComponentProps<'element'>`; conflicts use `Omit`.
- `cn()` comes from `@/lib/utils`; do not import `clsx` or `twMerge` directly in component files.
- Spread `...rest` onto the native/root element so `data-*`, `aria-*`, and form attrs pass through.

## Token and styling rules

- Read `src/styles/theme.css` before judging or adding tokens.
- No raw hex/rgb/rgba values in component class strings.
- No arbitrary colors (`text-[#...]`, `bg-[#...]`, `border-[#...]`).
- Arbitrary size/typography utilities are allowed only inside `types.ts` CVA definitions for an explicitly documented compact/dense variant.
- Do not use `[var(--token)]` or direct `var()` in component or story source when a Tailwind utility/semantic class exists.
- If a token-backed gradient, `color-mix()`, or multi-layer shadow cannot be expressed as an existing utility, add a semantic class/token in `src/styles/theme.css` or `src/styles/base.css` first.
- Custom fractional spacing tokens declared in `theme.css` use dash names (`p-0-75`, `p-1-25`, `min-w-4-5`), not dotted custom-token names. Built-in half-step utilities such as `p-0.5`, `gap-1.5`, and `px-2.5` remain valid.
- Disabled state uses `opacity-40`, `pointer-events-none`, and cursor treatment; do not substitute grey colors.
- Any component that renders a loading spinner must use `SpinnerCircular` from `spinners-react` for consistency with `Button`; do not implement component-local CSS spinners.

## Storybook and tests

- Story rules live in `.atl/skills/component-contributor/references/stories.md`; load it before writing or reviewing stories.
- Test rules live in `.atl/skills/component-contributor/references/testing.md`; load it before writing or reviewing tests.
- Tests cover hook return values, DOM rendering, ARIA, interactions, disabled states, and keyboard behavior when applicable.
- Mocks are declared before component imports.
- Do not test internal CSS class strings.
- Story `play` functions are forbidden; interactions belong in `.test.tsx`.

## Radix primitives

Only Radix UI primitives are allowed as base primitives. When Radix is used:

- Import as a namespace alias: `import * as XxxPrimitive from '@radix-ui/...'`.
- Use `Portal` for floating content.
- Use `asChild={true}` on triggers when composing with design-system components.
- Prefer `data-[state=open/closed]` attributes for animations over manual state classes.
- Load `.atl/skills/component-contributor/references/radix-patterns.md` before implementing or auditing Radix-based components.

## Visual and accessibility gates

- Visual rules live in `.atl/skills/visual-review/SKILL.md`; load it for state, glow, transition, gradient-border, contrast, and focus checks.
- Comparable action controls use the shared visual `control` scale (`24/32/40/48px`) when applicable. Labeled form fields such as `Input`/`Select` use the semantic `form-field` scale (`48/56/64px`) when label/floating-label layout affects alignment. `touch-target-min` (`44px`) is contextual guidance for touch-first surfaces or hit-area wrappers, not a universal visual height. Compact/dense variants may stay smaller only when explicitly documented, native-control based, keyboard accessible, and focus-visible.
- Focus styling uses the shared `focus-ring` utility (`outline: 2px solid var(--color-primary)`, `outline-offset: 2px`). Use `focus-visible:focus-ring`, `peer-focus-visible:focus-ring`, `group-focus-visible:focus-ring`, or an equivalent wrapper selector; never rely on decorative glow/shadow for focus visibility.
- Motion/transforms respect `prefers-reduced-motion`.

## `index.ts` pattern

```ts
export { ComponentName } from './ComponentName';
export type * from './types';
```

Use `export * from './types'` only when the repo's current TypeScript/build setup requires it; otherwise prefer `export type *` for type-only exports.
