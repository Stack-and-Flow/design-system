# Component Spec Template

Use this exact structure for proposals and for the final GitHub issue comment.
Keep headings ASCII-safe.

The `## Validated component spec` heading below is the final GitHub comment heading only. Before human approval, present the same spec body under `## Component Spec Proposal: {ComponentName}` and omit the final-only validated heading.

```markdown
## Validated component spec

### Component

- Name:
- Catalog tier: primitive / atom / molecule / organism
- Directory: src/components/{primitives|atoms|molecules|organisms}/{kebab-name}/
- Intake source: capture-first / reference-component-first
- Reference URL or pattern source:

### Scope

This component is responsible for:

- ...

Out of scope:

- ...

### API props

| Prop      | Type      | Required | Default | Description                      |
| --------- | --------- | -------- | ------- | -------------------------------- |
| children  | ReactNode | no       | -       | Visible content, when applicable |
| className | string    | no       | -       | External class extension         |

### CVA variants

| Variant | Values     | Default | Notes                                 |
| ------- | ---------- | ------- | ------------------------------------- |
| variant | default    | default | Visual style                          |
| size    | sm, md, lg | md      | Spacing and text scale, if applicable |

### States

- default:
- hover:
- focus:
- active:
- disabled:
- loading:
- error:
- empty:

### Accessibility contract

For non-interactive display components, state: `Native/static semantics only; custom keyboard, focus, and state announcements are not applicable.`

For interactive or composite components, complete:

- Pattern reference: native / Radix / WAI-ARIA APG pattern name
- Roles: root, trigger, popup/list, option/item, label/description/error when applicable
- Accessible name: visible label, `aria-label`, or `aria-labelledby` source
- ARIA relationships: `aria-controls`, `aria-expanded`, `aria-activedescendant`, `aria-describedby`, `aria-invalid`, etc. when applicable
- Keyboard matrix:
  - Tab / Shift+Tab:
  - Enter / Space:
  - Arrow keys:
  - Escape:
  - Home / End / typeahead, if applicable:
- Focus lifecycle: initial focus, roving/active descendant, focus restore, trap/portal behavior if applicable
- State announcements:
  - disabled:
  - required:
  - invalid/error:
  - loading:
  - empty/no results:
- Touch target: default and compact exceptions
- Reduced motion:

### Accessibility acceptance criteria

For non-interactive display components, include the role/name or semantic rendering check only.

For interactive or composite components, complete:

- Keyboard-only user can:
- Screen reader user hears:
- Focus is managed by:
- Disabled/invalid/loading/empty states expose:
- Automated/manual checks required:

### Storybook stories required

- Default
- Disabled
- Variant: ...
- Size: ...
- State: ...
- Edge case: ...
- Dark mode, if visually different

### Design notes

- Tokens:
- Layout:
- Dark mode:
- Visual constraints:
- Motion/effects:

### Reference behavior

Copy from reference:

- ...

Adapt for Stack-and-Flow:

- ...

Do not implement:

- ...

### Implementation notes for component-contributor

- Radix primitive:
- Native element extension:
- Required token modules:
- Required reference modules:
- Expected tests:
  - Role/name or semantic rendering queries:
  - Keyboard behavior, if interactive:
  - Focus behavior, if interactive:
  - ARIA state transitions, if applicable:
  - Disabled/invalid/loading/empty states, if applicable:
  - Axe/Storybook/manual notes:
```

## Cataloging decision placement

After the validated spec, append the validator output as a sibling section with the exact heading `## Cataloging decision`. Do not nest it inside the validated spec's `###` sections; it must immediately follow `## Validated component spec` in the same approved issue comment/update and must not contain unresolved blockers/questions.

Before approval, use only draft headings such as `## Draft cataloging decision` or `## Cataloging blockers/questions`; never use the final `## Cataloging decision` heading in a proposal.

## Proposal guidance

- For simple display components, keep props minimal and composable.
- For interactive components, specify the full accessibility contract before approval; vague ARIA or keyboard notes are not enough.
- For composite components such as Autocomplete, Select, DatePicker, Drawer, Accordion, or Toast, explicitly decide whether the component remains an atom or should become a molecule/organism, and name the native/Radix/WAI-ARIA pattern being followed.
- Prefer controlled/uncontrolled API decisions only when the reference behavior requires them.
- Include `className` only as an extension point, never as a substitute for missing variants.
- Mention if a dependency or token change would be required, but do not approve it implicitly.
- Include at least one acceptance criterion for keyboard-only use and one for screen reader semantics when the component is interactive.
