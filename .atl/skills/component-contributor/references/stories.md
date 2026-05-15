# Storybook Stories Reference

Canonical conventions for `*.stories.tsx` in this repository.

## Purpose

Use this reference BEFORE writing or reviewing stories. Do not improvise Storybook conventions from generic defaults.

## Non-negotiable rules

- Use `autodocs`.
- Add a file-level JSDoc block before `meta` with `## DESCRIPTION`; include purpose, main use cases, key capabilities, and accessibility notes.
- Add `parameters.docs.description.component` with a concise public-facing summary.
- Add story-level JSDoc before each non-trivial story explaining what prop, variant, state, or behavior the story demonstrates.
- For complex components, include `## DEPENDENCIES` in the file-level JSDoc when other atoms, molecules, Radix primitives, or important utilities shape usage.
- Do **not** define manual `argTypes` in `meta` or individual stories unless there is a documented exception.
- Use `@storybook/addon-actions` with `action(...)` for event args.
- Never use inline no-op handlers like `() => undefined` in story args.
- Use Tailwind token utility classes from `@theme` or reusable semantic classes from the style system; do **not** use `[var(--token)]` or direct `var()` in stories.
- Keep all story text, descriptions, comments, and labels in English.
- `Default` story args must not override the component `defaultVariants`.
- Interactive components must include `Disabled` and interaction-focused stories as appropriate.
- NO `play` functions — interaction testing belongs in `ComponentName.test.tsx`.

## Recommended structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Component } from './Component';

/**
 * ## DESCRIPTION
 * Component is used to solve a specific user-interface problem.
 *
 * - Explain primary use cases.
 * - Explain supported variants, states, or composition slots.
 * - Explain important accessibility behavior.
 *
 * ## DEPENDENCIES
 * - Mention related atoms/molecules/primitives when relevant.
 */
const meta: Meta<typeof Component> = {
  title: 'Atoms/Component',
  component: Component,
  parameters: {
    docs: {
      autodocs: true,
      description: {
        component: 'Concise English description of what this component does and when to use it.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: 'Example',
    onClick: action('click')
  }
};

/**
 * The `variant` prop changes visual hierarchy.
 *
 * Available options:
 * - `default` → Standard presentation.
 * - `secondary` → Supporting presentation.
 */
export const Variant: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      <Component variant='default'>Default</Component>
      <Component variant='secondary'>Secondary</Component>
    </div>
  )
};
```

## Review checklist

- Is there a file-level `## DESCRIPTION` JSDoc block before `meta`?
- Does `parameters.docs.description.component` summarize what the component does and when to use it?
- Do non-trivial stories have JSDoc explaining the demonstrated prop, state, variant, behavior, or accessibility concern?
- Are dependencies documented when the component relies on other components/primitives?
- Does the story rely on autodocs instead of custom `argTypes`?
- Are actions wired with `action(...)`?
- Are token utilities / semantic style-system classes used instead of `[var(--token)]` or direct `var()` bypasses?
- Are examples aligned with the canonical component API and public docs style?
- Does each story demonstrate one axis clearly?

## Notes

- If a future project decision changes the official actions helper or autodocs policy, update this reference FIRST, then update the affected skills.
