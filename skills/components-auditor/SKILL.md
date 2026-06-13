---
name: components-auditor
description: >
  Reviews existing Stack-and-Flow components against the shared component contract, Storybook conventions, tests, visual states, tokens, and accessibility.
  Trigger: component audit, review existing component, check component quality, delegated from sdd-verify.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "2.0"
---

## Activation Contract

Use this skill for component-level quality review after implementation, during PR readiness, or when delegated from `sdd-verify`.

This skill owns **audit execution and reporting**. It consumes shared references instead of duplicating their rule text.

## Required References

Always read in this order:

1. `skills/_shared/component-contract.md` — authoritative component contract.
2. `skills/component-contributor/references/stories.md` — Storybook conventions.
3. `skills/component-contributor/references/testing.md` — test conventions when tests are in scope.
4. `docs/GUIDELINES.md` — coding conventions.
5. `docs/DESIGN.md`, `docs/COMPONENTS.md` when present, and `src/styles/theme.css` — token and visual source of truth.
6. `skills/visual-review/SKILL.md` — full visual review protocol.

Never flag a token value as wrong without checking `theme.css` first.

## Audit Phases

### 1 — Scope and evidence

Identify component directory, tier, changed files, spec/issue reference, and relevant existing patterns. If the component uses Radix, also load `skills/component-contributor/references/radix-patterns.md`.

### 2 — Contract audit

Audit against `skills/_shared/component-contract.md`:

- required 6-file pattern and no unapproved extra files;
- TypeScript rules and public prop typing;
- Public prop JSDoc/default parity: compare `types.ts` props against CVA `defaultVariants`, hook/component destructuring defaults, alias/coalesced fallbacks, and boolean fallback chains; fail missing or stale `@default` docs.
- CVA placement and hook/component responsibilities;
- token usage and Tailwind v4 custom fractional naming;
- sizing consistency: comparable action controls use `control-*` tokens, form fields like `Input`/`Select` use `form-field-*` tokens when label/floating-label layout affects alignment, touch-target wrappers use `touch-target-min` when required, and compact exceptions are explicitly documented;
- named export and type export pattern;
- Radix primitive rules when applicable;
- accessibility gates and reduced motion.

### 3 — Story and test audit

Use the Storybook and testing references as the single source of truth. In particular:

- story docs live in JSDoc above `const meta` and each story export;
- each story JSDoc explains the scenario and why it matters, not just the story name;
- story set is necessary and non-duplicative, including no generic theme-only `DarkMode` story when the global Storybook dark-mode toolbar covers the case;
- `parameters.docs.description.component` is not used;
- no manual `argTypes` unless a documented exception exists;
- event args use `action(...)`;
- no story `play` functions;
- tests cover hook logic, DOM behavior, ARIA, interactions, disabled states, and keyboard behavior where applicable;
- mocks are declared before component imports;
- tests do not assert internal CSS class strings.

### 4 — Visual audit

Run the `visual-review` protocol for state completeness, glow, blur/gradient, transitions, gradient borders, focus, contrast, touch target, reduced motion, and consistency between shared control-height tokens versus documented compact exceptions.

### 5 — Severity and verdict

Classify findings:

| Severity | Meaning |
| --- | --- |
| **CRITICAL** | Accessibility failure, unsafe TypeScript, missing focus/contrast/disabled behavior, or broken public API. |
| **MAJOR** | Contract violation likely to block review: wrong file responsibilities, CVA in wrong file, token bypass, Storybook convention drift, visual composition violation. |
| **MINOR** | Spec inconsistency or incomplete documentation/story/test coverage that does not break behavior. |
| **SUGGESTION** | Optional improvement. |

Verdict:

- **PASS** — no CRITICAL or MAJOR issues.
- **PASS WITH WARNINGS** — no CRITICAL, but has MAJOR/MINOR issues that are documented and accepted.
- **FAIL** — has CRITICAL issues or unaccepted MAJOR issues.

## Report Format

```markdown
## Component Audit — {ComponentName}

**Verdict**: PASS / PASS WITH WARNINGS / FAIL
**Scope**: {files/components reviewed}

### Compliance matrix
| Area | Status | Notes |
| --- | --- | --- |
| Component contract | ✅ / ⚠️ / ❌ | |
| Storybook | ✅ / ⚠️ / ❌ | |
| Tests | ✅ / ⚠️ / ❌ | |
| Visual states | ✅ / ⚠️ / ❌ | |
| Accessibility | ✅ / ⚠️ / ❌ | |

### Findings
- [SEVERITY] `file:line` — Problem: ... Expected: ... Found: ... Rule: ...

### Validation evidence
- `node scripts/verify-prop-default-docs.mjs`: pass/fail/not run — reason
- `{command}`: pass/fail/not run — reason
```

When delegated from SDD, wrap this content in the SDD verification envelope requested by the orchestrator.

## Hard Rules

- Review-only unless explicitly assigned as a writer.
- Do not replace a working project pattern with a preference unless it violates a referenced rule.
- If shared references conflict, stop and report the conflict instead of choosing silently.
