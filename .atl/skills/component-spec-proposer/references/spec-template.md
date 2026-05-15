# Component Spec Template

Use this exact structure for proposals and for the final GitHub issue comment.
Keep headings ASCII-safe.

```markdown
## Validated component spec

### Component

- Name:
- Atomic level:
- Directory:
- Reference URL:

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

### Accessibility

- Role:
- ARIA:
- Keyboard behavior:
- Focus behavior:
- Touch target:
- Reduced motion:

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
```

## Proposal guidance

- For simple display components, keep props minimal and composable.
- For interactive components, specify keyboard behavior and focus states before approval.
- For composite components such as Autocomplete, Select, DatePicker, Drawer, Accordion, or Toast, explicitly decide whether the component remains an atom or should become a molecule/organism.
- Prefer controlled/uncontrolled API decisions only when the reference behavior requires them.
- Include `className` only as an extension point, never as a substitute for missing variants.
- Mention if a dependency or token change would be required, but do not approve it implicitly.
