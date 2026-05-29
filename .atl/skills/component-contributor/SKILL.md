---
name: component-contributor
description: >
  Guides an AI agent through implementing a Stack-and-Flow design-system component from an approved issue/spec.
  Trigger: component implementation, implement this component, build a component, component issue URL, delegated from sdd-apply.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "3.0"
---

## Activation Contract

Use this skill when implementing a new or changed component. This skill owns the contributor workflow; it does **not** duplicate component, story, test, or visual rule checklists.

When delegated from `sdd-apply`, skip contributor onboarding and return the SDD implementation-progress envelope requested by the orchestrator.

## Required References

Load these before implementation:

1. `.atl/skills/_shared/component-contract.md` — structure, TypeScript, tokens, tests, stories, exports, Radix, accessibility gates.
2. `.atl/skills/component-contributor/references/biome-rules.md` — before writing any `.ts`/`.tsx`.
3. `docs/DESIGN.md` and `src/styles/theme.css` — before choosing tokens or judging visuals.
4. `docs/COMPONENTS.md` — for interactive/visual state rules when present.

Load by intent:

| Need | Reference |
| --- | --- |
| Storybook | `.atl/skills/component-contributor/references/stories.md` |
| Tests | `.atl/skills/component-contributor/references/testing.md` |
| Native HTML element props | `.atl/skills/component-contributor/references/html-extension.md` |
| Radix primitive | `.atl/skills/component-contributor/references/radix-patterns.md` |
| `className` merging | `.atl/skills/component-contributor/references/tailwind-merge.md` |
| Contributor PR workflow | `.atl/skills/component-contributor/references/git-workflow.md` |
| Starting from a GitHub issue or board task | `.atl/skills/github-project-tasks/SKILL.md` — verify issue label `status:approved`, then run START WORK before implementation |

## Workflow

Follow these phases in order. Do not skip gates because a component looks simple.

**Non-negotiable approval gate:** implementation must not start under any circumstance unless the linked GitHub issue has the exact label `status:approved`. Chat approval, assumptions, offline mode, or a local copy of the spec do not satisfy this gate.

### 0 — Contributor onboarding

Only when working directly with a contributor: confirm they understand React + strict TypeScript, Tailwind v4 tokens, CVA, the 6-file pattern, Storybook as docs, and tests in `.test.tsx`. If not, teach briefly before proceeding.

### 1 — Approval gate, START WORK, then spec intake

If implementation will proceed from a GitHub issue or Project board card, first verify that the linked issue has the exact label `status:approved`. If it is missing, stop and ask for maintainer/project lead approval; do not read the implementation spec in detail, plan, or code.

After the label is present, load `.atl/skills/github-project-tasks/SKILL.md` and run **START WORK** before spec intake, planning, or coding: assign the issue to the contributor/user, move Project status to `In progress`, and record the planned branch/worktree. Offline/no-network mode may only skip GitHub mutations after evidence confirms the issue already has `status:approved`; it never bypasses the approval gate.

Then extract component name, tier, props, variants, states, accessibility behavior, reference URL, and design notes. If the spec lives in a GitHub issue, read issue comments too; validated specs may live there.

Stop and ask when the issue label `status:approved` is missing or cannot be verified, START WORK cannot be completed, or required behavior, accessibility, states, or variants are missing. Do not invent public API and do not begin implementation.

### 1.5 — Spec critique

Before planning, return:

```markdown
## Spec Review — {ComponentName}

### Gaps found
- {missing requirement and impact}

### Risks found
- {implementation/product risk and mitigation}

### Improvements proposed
- {specific improvement}

### Ready to proceed
{Yes / No — why}
```

Flag only meaningful issues: accessibility failures, undocumented keyboard/focus behavior, missing stories for documented variants, unclear defaults, broken composability, or token references that do not exist.

### 1.75 — Visual preflight

Map the component to the design system before coding:

- surface pattern: opaque, raised, tinted, or floating/frosted;
- relevant tokens from `theme.css`;
- base/hover/focus/active/disabled/loading/error states;
- focus ring, disabled treatment, touch target, contrast, reduced motion;
- allowed Radix primitive, if any.

### 2 — Plan

Present a concise plan and wait for confirmation unless SDD delegation already approved implementation:

```markdown
## Implementation Plan

**Component**: {ComponentName}
**Tier**: atoms / molecules / organisms
**Directory**: `src/components/{tier}/{kebab-name}/`

### Files
1. `types.ts` — props, CVA variants, defaults
2. `useComponentName.ts` — logic, aria, handlers, className
3. `ComponentName.tsx` — JSX only
4. `ComponentName.test.tsx` — hook + behavior tests
5. `ComponentName.stories.tsx` — canonical Storybook examples
6. `index.ts` — named export + type exports

### Decisions
- Tokens: {list}
- Radix primitive: {yes/no; which one}
- States and accessibility: {summary}
- Validation: {tests/build/storybook/manual visual checks}
```

### 3 — Implement

Implement files in this order: `types.ts` → hook → component → tests → stories → `index.ts`.

Use `.atl/skills/_shared/component-contract.md` as the contract for each file. If a local mature component contradicts the shared contract, stop and ask whether to follow current code or update the contract.

### 4 — Explain decisions

After each file, briefly explain the non-obvious decisions: CVA shape, token choices, ARIA behavior, Radix composition, and test/story coverage. Keep this short; do not write tutorial prose.

### 5 — Visual review

Load `.atl/skills/visual-review/SKILL.md` and run the full visual gate. Fix CRITICAL and MAJOR visual issues before claiming completion.

### 6 — Component audit before PR

Load `.atl/skills/components-auditor/SKILL.md` for the final component audit. Do not open a PR with CRITICAL or MAJOR findings.

### 7 — End work handoff

If the component work came from a GitHub issue or Project board card, use `.atl/skills/github-project-tasks/SKILL.md` END WORK only after validation evidence exists and the PR is merged or the maintainer/user explicitly approves closing the task. If working offline/no-network, return the END WORK follow-up instead of mutating GitHub.

## Output Contract

For normal implementation, return:

```markdown
## Component Implementation — {ComponentName}

**Files changed**: {list}
**Spec deviations**: {list or "None"}
**Validation**: {commands/checks and result}
**Visual review**: {PASS / issues}
**Component audit**: {PASS / issues}
**Remaining work**: {list or "None"}
```

For SDD delegation, use the SDD return envelope supplied by the parent.
