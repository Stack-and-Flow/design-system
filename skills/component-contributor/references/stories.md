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
- Custom fractional spacing tokens declared in `theme.css` must use Tailwind v4 dash utility names (`p-0-75`, `p-1-25`, `min-w-4-5`), not dotted custom-token names (`p-0.75`, `p-1.25`, `min-w-4.5`). Built-in half-step utilities such as `p-0.5`, `gap-1.5`, and `px-2.5` stay valid.
- HARD RULE: keep all Storybook documentation in English, including docs headings, descriptions, comments, story names, and arg labels.
- Component-level docs must be written as a JSDoc block immediately above `const meta`; do **not** put component docs in `parameters.docs.description.component`.
- The component-level JSDoc block must use this English story header structure:
  - `## Description` — required for every component; describe what it does and when to use it.
  - `## Dependencies` — include only when the story/component uses other design-system components or external primitives; list each dependency and why it is used.
  - `## Usage Guide` — include only when usage is complex; explain composition, constraints, or non-obvious behavior.
- Story-level docs must be written as a useful JSDoc block immediately above each `export const StoryName`; do **not** render documentation cards, panels, helper text blocks, or usage notes inside the story canvas.
- Each story must earn its place: demonstrate a distinct state, variant axis, composition constraint, accessibility behavior, or integration context. Do not add stories that duplicate coverage already provided by controls, args, or another story.
- Do **not** add a generic `DarkMode` story just to show the component in dark theme. Storybook already provides global dark/light switching via the toolbar.
- A dedicated dark-mode story is allowed only when it demonstrates behavior the global theme toggle cannot express, such as local dark-scope rendering, portal theme inheritance, or a theme-specific bug/regression case. State that reason in the story JSDoc.
- Story render functions and decorators are examples only: they may provide layout needed to demonstrate the component, but not narrative documentation UI.
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

/**
 * Demonstrates the component with its built-in default variants so consumers can compare other stories against the baseline API.
 */
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
- Do custom fractional spacing utilities use dash names from `theme.css` (`0-75`, `1-25`, `4-5`) instead of dotted custom-token names?
- Is the component-level docs JSDoc block immediately above `const meta`?
- Does the component-level JSDoc block include required `## Description`?
- Are `## Dependencies` and `## Usage Guide` included only when applicable?
- Does each story JSDoc explain the scenario and why it matters instead of restating the story name or saying only "Shows the component"?
- Is every story necessary, with no duplicate coverage that controls, args, the global dark-mode toolbar, or another story already provide?
- Are generic theme-only `DarkMode` stories absent unless they document a local scope, portal inheritance, or regression case that the toolbar cannot express?
- Are documentation cards, panels, helper text blocks, and usage notes absent from the story canvas?
- Does `meta.parameters.docs` avoid `description.component`?
- Are examples aligned with the canonical component API and public docs style?
- Does each story demonstrate one axis clearly?
- Do public props in `types.ts` document runtime defaults with `@default`, matching hook/component defaults and CVA `defaultVariants`?

## Notes

- If a future project decision changes the official actions helper or autodocs policy, update this reference FIRST, then update the affected skills.
