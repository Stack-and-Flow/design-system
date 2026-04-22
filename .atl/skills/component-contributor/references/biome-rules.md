# Reference: Biome Rules

> Source: `biome.json` — all rules verified against the actual config file.
> Pre-commit hook runs: `biome-staged` (format + lint) + `tsc` (type check).

---

## Formatter settings

| Setting | Value |
|---------|-------|
| Indent style | `space` |
| Indent width | `2` |
| Line width | `120` |
| Line ending | `crlf` (Windows) |
| Semicolons | `always` |
| Quote style (JS/TS) | `single` |
| JSX quote style | `single` |
| Trailing commas | `none` |
| Arrow parens | `always` |
| Bracket spacing | `true` |
| Bracket same line | `false` |

---

## Linter rules — errors that will fail CI

### Style rules (auto-fixable)

| Rule | What it enforces | Wrong | Right |
|------|-----------------|-------|-------|
| `useImportType` | Type-only imports need `type` keyword | `import { FC } from 'react'` | `import type { FC } from 'react'` |
| `useExportType` | Type-only exports need `type` keyword | `export { MyType }` | `export type { MyType }` |
| `useNamingConvention` | Components PascalCase, hooks camelCase, files match | `mycomponent`, `UseButton` | `MyComponent`, `useButton` |
| `noImplicitBoolean` | No boolean shorthand on JSX props | `<Button disabled />` | `<Button disabled={true} />` |
| `useBlockStatements` | Always use braces in if/else | `if (x) return y` | `if (x) { return y; }` |
| `useFragmentSyntax` | Use `<>` not `<React.Fragment>` | `<React.Fragment>` | `<>` |
| `useOptionalChain` | Prefer `?.` over `&&` checks | `obj && obj.prop` | `obj?.prop` |
| `useConst` | Prefer `const` over `let` when not reassigned | `let x = 1` | `const x = 1` |
| `useConsistentArrayType` | Use shorthand array syntax | `Array<string>` | `string[]` |
| `noNonNullAssertion` | No `!` non-null assertions | `value!.prop` | `value?.prop` or proper guard |
| `useShorthandFunctionType` | Use `() => T` not `{ (): T }` | `{ (): void }` | `() => void` |

### Suspicious rules

| Rule | What it enforces |
|------|-----------------|
| `noDoubleEquals` | Always `===` / `!==` — never `==` / `!=` |
| `noDuplicateJsxProps` | No repeated JSX attribute names |
| `noExplicitAny` | **OFF** — `any` is allowed (but avoid it) |
| `noEmptyBlockStatements` | No empty `{}` blocks |
| `noDebugger` | No `debugger` statements |

### Correctness rules

| Rule | What it enforces |
|------|-----------------|
| `noUnusedVariables` | All declared variables must be used |
| `useHookAtTopLevel` | Hooks cannot be called inside conditions or loops |
| `useJsxKeyInIterable` | Every element in a `.map()` needs a `key` prop |
| `noChildrenProp` | Pass children as JSX, not `children={...}` prop |
| `noUndeclaredVariables` | No use of variables before declaration |

### Complexity rules

| Rule | What it enforces |
|------|-----------------|
| `useOptionalChain` | `?.` instead of `&&` chaining |
| `noUselessTernary` | No `condition ? true : false` |
| `noUselessRename` | No `{ a: a }` in destructuring |
| `noBannedTypes` | No `Boolean`, `Number`, `String` wrappers |

### Security rules

| Rule | What it enforces |
|------|-----------------|
| `noDangerouslySetInnerHtml` | No `dangerouslySetInnerHTML` |
| `noBlankTarget` | `target="_blank"` must have `rel="noopener noreferrer"` |

---

## The biome-ignore comment

When a Biome rule must be suppressed (e.g. mock names that must match library exports), use:

```tsx
// biome-ignore lint/style/useNamingConvention: must match library export name
DynamicIcon: () => null
```

Format: `// biome-ignore lint/<category>/<rule>: <reason>`

Rules:
- The reason is MANDATORY — Biome will reject the comment without it
- Use sparingly — if you need many suppressions, reconsider the code
- Only suppress at the specific line, not the entire file

---

## TypeScript — additional constraints (tsc pre-commit)

The pre-commit also runs `tsc`. TypeScript violations will also block the commit.

- No `interface` — use `type` exclusively
- No `any` unless absolutely unavoidable (and it should be documented)
- Strict null checks are enabled — handle `undefined` / `null` explicitly
- All exported types must use `export type`

---

## Quick diagnosis

If your commit is rejected, check in order:

1. **Import/export type** — does every type import have `type`?
2. **Naming convention** — are component names PascalCase? Hook names camelCase starting with `use`?
3. **Implicit boolean** — any JSX boolean props without `={true}`?
4. **Optional chain** — any `x && x.y` that should be `x?.y`?
5. **Unused variables** — any imports or declared vars that are never used?
6. **JSX keys** — any `.map()` without `key` props?
7. **TypeScript** — any `interface`, `any`, or unhandled `null`?

---

## Checklist before committing

- [ ] All type imports use `import type`
- [ ] All type exports use `export type`
- [ ] No `interface` — only `type`
- [ ] No implicit boolean JSX props (write `={true}`)
- [ ] No `x && x.y` — use `x?.y`
- [ ] No `!` non-null assertion — use optional chaining or guards
- [ ] Every `.map()` has a `key` prop
- [ ] No unused imports or variables
- [ ] `biome-ignore` comments include a reason
