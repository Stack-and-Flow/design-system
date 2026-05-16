# Storybook Stories Reference

Canonical conventions for `*.stories.tsx` in this repository.

## Purpose

Use this reference BEFORE writing or reviewing stories. Do not improvise Storybook conventions from generic defaults.

## Non-negotiable rules

- Use `autodocs`.
- Do **not** define manual `argTypes` in `meta` or individual stories unless there is a documented exception.
- Use `@storybook/addon-actions` with `action(...)` for event args.
- Never use inline no-op handlers like `() => undefined` in story args.
- Use Tailwind token utility classes from `@theme` or reusable semantic classes from the style system; do **not** use `[var(--token)]` or direct `var()` in stories.
- HARD RULE: keep all Storybook documentation in English, including docs headings, descriptions, comments, story names, and arg labels.
- Component-level docs must be written as a JSDoc block immediately above `const meta`; do **not** put component docs in `parameters.docs.description.component`.
- The JSDoc block must use this English story header structure:
  - `## Description` — required for every component; describe what it does and when to use it.
  - `## Dependencies` — include only when the story/component uses other design-system components or external primitives; list each dependency and why it is used.
  - `## Usage Guide` — include only when usage is complex; explain composition, constraints, or non-obvious behavior.
- `Default` story args must not override the component `defaultVariants`.
- Interactive components must include `Disabled` and interaction-focused stories as appropriate.
- NO `play` functions — interaction testing belongs in `ComponentName.test.tsx`.

## Recommended structure

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Component } from "./Component";

/**
 * ## Description
 * Concise English description of the component.
 *
 * ## Dependencies
 * Uses `OtherComponent` to compose the example because ...
 *
 * ## Usage Guide
 * Use this component when ... Avoid ...
 */
const meta: Meta<typeof Component> = {
  title: "Atoms/Component",
  component: Component,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: "Example",
    onClick: action("click"),
  },
};
```

## Review checklist

- Does the story rely on autodocs instead of custom `argTypes`?
- Are actions wired with `action(...)`?
- Are token utilities / semantic style-system classes used instead of `[var(--token)]` or direct `var()` bypasses?
- Is the component-level docs JSDoc block immediately above `const meta`?
- Does the JSDoc block include required `## Description`?
- Are `## Dependencies` and `## Usage Guide` included only when applicable?
- Does `meta.parameters.docs` avoid `description.component`?
- Are examples aligned with the canonical component API and public docs style?
- Does each story demonstrate one axis clearly?

## Notes

- If a future project decision changes the official actions helper or autodocs policy, update this reference FIRST, then update the affected skills.
