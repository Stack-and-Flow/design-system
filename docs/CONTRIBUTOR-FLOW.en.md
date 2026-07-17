# Contributor Workflow — Stack-and-Flow Design System

This is the canonical document for contributing components to the design system. `CONTRIBUTING.en.md` explains the general setup; this file defines the component workflow and checkpoints every contributor must follow, with or without AI.

---

## Quick summary

```text
Project task → Research → Spec proposal skill → Cataloging validator → Validated issue spec → wait for `status:approved` → verify assignee → START WORK → Spec review → Visual preflight → Plan → Implementation → Visual review → Pre-PR component review → PR → Review → Merge → END WORK
```

Core rule: **AI executes, the contributor decides**. The spec, visual criteria, and checkpoint approvals remain human responsibility. After the validated spec is written in the task, implementation stays blocked until the linked issue has the `status:approved` label and is not assigned to someone else.

---

## Sources of truth

| Topic | Source |
| ------------------------------- | -------------------------------------------------- |
| Repo setup | [`CONTRIBUTING.en.md`](./CONTRIBUTING.en.md) |
| Architecture and code rules | [`GUIDELINES.en.md`](./GUIDELINES.en.md) |
| Tokens and visual language | [`DESIGN.en.md`](./DESIGN.en.md), `src/styles/theme.css` |
| Component visual states | [`COMPONENTS.en.md`](./COMPONENTS.en.md) |
| Cataloging and V1 recatalogation | [`COMPONENT-CATALOGING.en.md`](./COMPONENT-CATALOGING.en.md) |
| Spec intake and proposal | `skills/component-spec-proposer/SKILL.md` |
| Spec cataloging validation | `skills/component-spec-cataloging-validator/SKILL.md` |
| Detailed AI workflow | `skills/component-contributor/SKILL.md` |
| Pre-PR audit | `skills/components-auditor/SKILL.md` |

If these sources disagree, the authority order is: `GUIDELINES*.md` / `DESIGN*.md` for code and visual rules, `skills/*` for agent-assisted execution, and this document for the human workflow.

---

## Step 1 — Take a task

1. Pick a task in the [GitHub Projects Board](https://github.com/orgs/Stack-and-Flow/projects/1).
2. Verify that it has an issue attached. The issue is the implementation contract.
3. Before taking a linked issue, verify assignees. If it is already assigned to someone else, stop and get explicit permission before reassigning or taking it over.
4. Do not run **START WORK** yet if the spec is not defined and approved. The contributor may research and propose the spec, but must not start implementation.
5. If the user requested offline/no-network work, do not mutate GitHub: record the required follow-up. Do not start implementation until verifying that the issue has the `status:approved` label and the assignee gate is satisfied.

---

## Step 2 — Research

Before asking for implementation, research the component.

Minimum checklist:

- References: Radix UI primitives, MDN, or WAI-ARIA APG as applicable.
- Catalog tier: use [`COMPONENT-CATALOGING.en.md`](./COMPONENT-CATALOGING.en.md) to decide `primitives`, `atoms`, `molecules`, or `organisms` and document V1 follow-ups.
- Props: name, type, default, required/optional.
- CVA variants: keys and values.
- States: base, hover, focus, active/pressed, disabled, loading, error, empty when relevant.
- Accessibility: roles, `aria-*`, keyboard, focus management, touch target.
- Design: surface, color, spacing, radius, shadow/glow, transitions, dark mode.

Do not do partial research. If the issue is incomplete, the component will be incomplete.

---

## Step 3 — Take and validate the spec with `component-spec-proposer`

Before implementing, use the `component-spec-proposer` skill to turn the issue into a validated spec. There are two valid intake variants: capture-first and reference-component-first; both end at the same approval gate.

| Variant | When it applies | What the issue records |
| ------- | --------------- | ---------------------- |
| A — capture-first | A maintainer/user captures a component idea from a conversation or product need, even when no external reference exists yet. | Known context, constraints, unknowns, intended tier, and any missing reference or pattern. |
| B — reference-component-first | The user provides a HeroUI, Radix, MDN, WAI-ARIA APG, or other reference component URL. | Reference behavior and how it adapts to Stack-and-Flow; it is not copied blindly. |

Mandatory convergence:

```text
captured issue or reference → proposed spec → assumptions/questions → cataloging validation → human validation → `## Validated component spec` in the issue → wait for `status:approved` label → START WORK → component-contributor
```

Before requesting human approval or writing `## Validated component spec`, run `component-spec-cataloging-validator`. That gate checks the proposal against [`COMPONENT-CATALOGING.en.md`](./COMPONENT-CATALOGING.en.md), inspects the current catalog, and returns `## Draft cataloging decision` with reuse, extraction, split, child issue candidates, and target issue, or `## Cataloging blockers/questions` when validation cannot complete. If blockers/questions remain, do not request approval yet. If child issues are needed, use `component-child-issues` later, only after the final decision is validated.

When written to the issue, `## Cataloging decision` should sit immediately after `## Validated component spec` in the same comment or update, so the implementation contract and cataloging decision are reviewed together. This exact heading is reserved for the approved final version and must not contain unresolved blockers/questions.

`status:approved` is an **issue label**. Project Status `In progress` belongs to **START WORK**, not to the spec proposal phase.

Capture-first prompt:

```text
Prepare the spec for this component using component-spec-proposer.

Issue: {issue_url}
Intake: capture-first from this conversation/product need.
Known context: {context}
Reference: pending or unknown

Do not implement yet. Propose the spec, list assumptions/questions, flag missing references or patterns, run `component-spec-cataloging-validator`, and wait for my approval of the spec and `## Draft cataloging decision` before writing back to GitHub. If there are `## Cataloging blockers/questions`, do not request approval yet.
```

Reference-component-first prompt:

```text
Prepare the spec for this component using component-spec-proposer.

Issue: {issue_url}
Intake: reference-component-first
Reference: {reference_url}

Do not implement yet. Adapt the reference to Stack-and-Flow, propose the spec, list assumptions to validate, run `component-spec-cataloging-validator`, and wait for my approval of the spec and `## Draft cataloging decision` before writing back to GitHub. If there are `## Cataloging blockers/questions`, do not request approval yet.
```

The skill must:

1. Read the issue and, when present, the reference.
2. Propose a spec using the `component-spec-proposer` template.
3. List assumptions to validate, including missing references or patterns in capture-first intake.
4. Pass the proposal through `component-spec-cataloging-validator` before human approval.
5. Include `## Draft cataloging decision` when validation passes, with deterministic `### Child issue candidates` when applicable; if blockers/questions remain, show `## Cataloging blockers/questions` and stop.
6. Wait for human approval of both the proposed spec and `## Draft cataloging decision`.
7. Only after that approval, write `## Validated component spec` and the validated `## Cataloging decision` immediately after it in the same issue comment or update.
8. Leave the task waiting for approval: do not move it to `In progress` from `component-spec-proposer`.
9. Indicate the next step: wait for the `status:approved` issue label and verify the issue is unassigned or assigned to the contributor/user before starting `component-contributor`.

Do not use `component-contributor` to implement until the spec is validated, the issue has the `status:approved` label, and the assignee gate has passed.

---

## Step 4 — Document the spec in the issue

The validated spec must live in the issue as a verifiable contract.

| Field | What it must say |
| ------------------ | ---------------------------------------------------------- |
| Component name | PascalCase |
| Catalog tier | primitive / atom / molecule / organism |
| Props | Name, TypeScript type, default, required/optional |
| CVA variants | Variant keys and possible values |
| States | Visual and behavioral description per state |
| Accessibility | Roles, attributes, keyboard, focus, reduced motion when applicable |
| Intake source / Reference | capture-first or reference-component-first; URL or pattern source when available |
| Design notes | System-specific visual decisions |
| Story requirements | Default, Disabled, key variants, edge cases |

> Golden rule: if it is not in the issue, the agent should not invent it.

---

## Step 5 — Wait for `status:approved` and run START WORK

After documenting the spec, the contributor must wait for explicit maintainer/project lead approval. The operational signal is the exact GitHub label `status:approved` on the linked issue; it is not a free-text comment and it does not replace the Project Status field, which still uses `Todo`, `In progress`, and `Done`.

Rules:

- Do not create the implementation branch, plan, or code before `status:approved`.
- Before any action on a linked issue, verify assignees. If it is assigned to someone else, stop and notify the user that explicit permission is required before reassigning it.
- Do not move the Project item to `In progress` from the spec proposal phase.
- When the `status:approved` label is present and the assignee gate passes, run **START WORK**: assign the issue, move the Project item to `In progress`, confirm Team/Category, and record branch/worktree.
- If the `status:approved` label is missing, stop and request approval; do not replace it with implicit chat approval.

---

## Step 6 — Create the branch, sibling worktree, and environment

If the task comes from an issue, use issue-derived naming:

```text
branch:   {type}/{issue-number}-{slug}
worktree: ../design-system-{type}-{issue-number}-{slug}
```

Examples:

```text
feat/123-button
fix/128-modal-focus-trap
../design-system-feat-123-button
```

Prefer sibling worktrees next to the repo. Avoid `/tmp` unless it is explicitly requested.

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feat/123-button
pnpm install
pnpm run storybook
```

If you use a worktree:

```bash
git worktree add -b feat/123-button ../design-system-feat-123-button HEAD
```

Use one branch per work unit: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.

---

## Step 7 — Start the AI implementation flow

In opencode/gentle-ai, share the issue URL:

Suggested prompt:

```text
Implement this component using component-contributor.

Issue: {issue_url}

Use the `## Validated component spec` section and the immediately following `## Cataloging decision` in the same comment/update as the contract. Before reading the spec in detail, planning, or writing code, verify that the issue has the `status:approved` label and is not assigned to someone else; if the label is missing or the assignee gate fails, stop. Run START WORK before implementation intake. Do not invent props or behavior outside the spec or cataloging decision. Pause at spec review, visual preflight, and plan checkpoints before writing code.
```

The agent must load `component-contributor`, check the `status:approved` label, verify assignees, run START WORK, and only then consume the validated spec from `component-spec-proposer`. If it skips a phase, stop it.

---

## The 8 component implementation phases

### Phase 1 — Read the validated spec

Before this phase, the agent must already have verified the `status:approved` label, confirmed the issue is not assigned to someone else without explicit permission, and completed START WORK. It then reads `## Validated component spec` and the immediately following `## Cataloging decision` in the same comment/update, and extracts the component, tier, props, variants, states, accessibility, reference, design notes, reuse/extraction, and child candidates.

If the tier is `primitive`, the agent may proceed only when `## Cataloging decision` explicitly approves primitive support/path; otherwise it must stop and defer to the V1 inventory/recatalogation issue. Do not silently implement primitives as atoms.

Expected output:

- spec summary;
- cataloging decision summary, reuse/extraction, and child candidates;
- evidence of the `status:approved` label, assignee gate, and START WORK;
- questions if anything is ambiguous or if the spec conflicts with cataloging;
- reference/token modules it plans to load.

**Human checkpoint:** do not continue if the agent invents props, states, or behavior that are not in the validated spec. If a new decision appears, go back to spec proposal or update the issue before implementation.

Suggested prompt if inconsistencies appear:

```text
Stop implementation. I found a decision that is not in `## Validated component spec`:

- {decision_or_gap}

Go back to spec mode: propose how to update the spec, list assumptions, and wait for my approval before continuing.
```

---

### Phase 2 — Specification review

Before planning, the agent critiques the spec.

It must report:

- accessibility gaps;
- missing stories;
- ambiguous variants or props;
- architecture risks;
- proposed improvements.

**Human checkpoint:** accept the spec, adjust it, or request changes. This is the last cheap moment to fix scope.

Suggested prompt:

```text
Critically review the validated spec before planning.

Look for accessibility gaps, missing stories, ambiguous variants, architecture risks, and concrete improvements. Do not write code. Return: gaps, risks, improvements, and whether it is ready to proceed.
```

---

### Phase 3 — Visual preflight

Before the plan, the agent loads and applies:

- `docs/DESIGN.en.md`;
- `docs/COMPONENTS.en.md` when relevant;
- `src/styles/theme.css`;
- relevant token/reference modules.

It must define:

- surface pattern;
- text, background, border, radius, spacing, glow/focus tokens;
- visual states;
- dark mode;
- allowed transitions;
- touch target and reduced motion.

**Human checkpoint:** confirm that the component is visually aligned before code is written.

Suggested prompt:

```text
Run the visual preflight before the plan.

Load `docs/DESIGN.en.md`, `docs/COMPONENTS.en.md` when relevant, and `src/styles/theme.css`. Define surface, tokens, visual states, focus, disabled, dark mode, transitions, and reduced motion. Do not write code yet.
```

---

### Phase 4 — Plan

The agent presents a plan before touching files.

It must include:

- directory and tier;
- the 6 files to create/modify;
- CVA variants;
- hook logic;
- planned stories;
- planned tests;
- visual decisions;
- accessibility.

Required architecture:

```text
types.ts → useComponentName.ts → ComponentName.tsx → ComponentName.test.tsx → ComponentName.stories.tsx → index.ts
```

**Human checkpoint:** approve the plan or request changes. No implementation without approval.

Suggested prompt:

```text
Present the implementation plan for {component_name} before writing code.

Include tier, directory, 6 files, CVA variants, hook logic, stories, tests, visual decisions, and accessibility. Wait for my approval before implementing.
```

---

### Phase 5 — Implementation + explanation

The agent implements the 6-file pattern and explains each decision after finishing each file.

| File | Responsibility |
| --------------------------- | ----------------------------------------------------------- |
| `types.ts` | Props, public types, CVA variants, JSDoc controls |
| `useComponentName.ts` | All logic, handlers, state, refs, computed className |
| `ComponentName.tsx` | Presentational JSX only, consumes the hook |
| `ComponentName.test.tsx` | Hook tests and component behavior tests |
| `ComponentName.stories.tsx` | Storybook docs, args, variants, states; JSDoc above `const meta` and every story export |
| `index.ts` | Named component export plus type exports |

Hard rules:

- `type`, never `interface`.
- No `any`.
- No CVA outside `types.ts`.
- No logic in the presentational `.tsx`.
- No hardcoded values when a token exists.
- No `play` functions: interactions are tested in `.test.tsx`.
- `index.ts` uses named component exports plus type exports.

Suggested prompt:

```text
Implement the component according to the approved plan.

Create files in this order: `types.ts`, `use{ComponentName}.ts`, `{ComponentName}.tsx`, `{ComponentName}.test.tsx`, `{ComponentName}.stories.tsx`, `index.ts`.

After each file, explain the important decisions and stop if a blocker appears or a decision is not covered by the spec.
```

---

### Phase 6 — Visual review

With the files complete, the agent performs a visual review before declaring the work done.

It must verify:

- base, hover, focus, active/pressed, disabled;
- focus-visible with the shared `focus-ring` utility (`outline: 2px solid var(--color-primary)`, `2px` offset), never `outline: none` without restoring it;
- visual height aligned with the semantic scale that applies (`control` for actions, `form-field` for fields), and `touch-target-min` (`44px`) only for touch-first surfaces or hit-area wrappers; documented compact/dense variants may be smaller if they keep keyboard accessibility and focus;
- contrast in light/dark;
- explicit transitions, never `transition-all`;
- no layout-property animation;
- reduced motion if transforms or animations exist.

CRITICAL and MAJOR findings block progress. Fix them before continuing.

Suggested prompt:

```text
Run the visual review for {component_name}.

Review base, hover, focus, active, disabled, glow/shadow, transitions, contrast, touch target, and reduced motion. Classify findings as CRITICAL, MAJOR, MINOR, or SUGGESTION, and fix CRITICAL/MAJOR before continuing.
```

---

### Phase 7 — Component review before PR

Before opening a PR, run an explicit audit with `components-auditor`.

It must review:

- 6-file architecture;
- file responsibilities;
- strict TypeScript;
- CVA in `types.ts`;
- tokens and theme;
- stories and docs header;
- tests;
- accessibility;
- visual states.

Expected format:

```markdown
## Pre-PR Component Review — ComponentName

**Verdict**: PASS / PASS WITH WARNINGS / BLOCKED

### Blocking issues

- None

### Warnings

- None

### Evidence

- `npm test -- --run src/components/.../ComponentName.test.tsx`: passed
- `npm run build`: passed
- Storybook/manual visual check: passed or documented
```

Do not open a PR with CRITICAL or MAJOR issues.

Suggested prompt:

```text
Audit this component using components-auditor before opening a PR.

Component: {component_name}
Path: src/components/{tier}/{kebab_name}/

Review architecture, file responsibilities, CVA, TypeScript, stories, tests, tokens, visual states, and accessibility. Return PASS / PASS WITH WARNINGS / BLOCKED with evidence.
```

---

### Phase 8 — PR

The PR must link the issue and contain evidence.

Minimum checklist:

- [ ] `Closes #NNN` in the description.
- [ ] PR title in Conventional Commit format: `<type>(<optional scope>): <description>`.
- [ ] Commits in valid Conventional Commit format for `commitlint`.
- [ ] Relevant tests pass.
- [ ] Build or required checks pass.
- [ ] Pre-PR component review included or summarized.
- [ ] Storybook docs have a JSDoc block above `const meta` and useful scenario/purpose JSDoc above every story export.
- [ ] Stories are non-redundant; no generic `DarkMode` story duplicates the toolbar.
- [ ] `## Description` is present.
- [ ] `## Dependencies` only when applicable.
- [ ] `## Usage Guide` only when applicable.
- [ ] Before commit/review you ran MCP cleanup:
  `rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output`.

Suggested prompt:

```text
Prepare the PR for {component_name}.

Link `Closes #{issue_number}`. Include a summary, change table, test/build evidence, the pre-PR component review result, and visual notes when applicable. Do not open the PR if the review is BLOCKED.
```

### Phase 9 — END WORK

Close the GitHub Project task only when there is real closure evidence:

- verified merged PR; or
- explicit maintainer/user approval to close without a PR.

Minimum checklist:

- [ ] validation evidence commented on the issue;
- [ ] merged PR or explicit approval recorded;
- [ ] Project status moved to `Done`;
- [ ] follow-ups documented if anything remains.

If you are offline/no-network, do not try to mutate GitHub: leave END WORK as a follow-up item.

---

## Current Storybook criterion

The JSDoc block above `const meta` must use this structure:

```markdown
## Description

What the component does and when to use it.

## Dependencies

Only when it uses other design-system components or external primitives.

## Usage Guide

Only when composition or usage has non-obvious constraints.
```

All content inside the JSDoc block must be in English, including headings, prose, and lists.

Each story-level JSDoc block above `export const StoryName` must explain the scenario and why it matters: state, variant axis, composition constraint, accessibility behavior, or integration context. Do not accept filler descriptions that only restate the story name.

Use the Storybook dark-mode toolbar for normal theme coverage. Do not add a generic `DarkMode` story unless it demonstrates local dark scope, portal theme inheritance, or a theme-specific regression that the toolbar cannot express; the story JSDoc must state that reason.

---

## Rules the AI cannot skip

If the agent proposes any of the following, reject it:

- modifying `src/styles/theme.css` without explicit approval;
- adding dependencies without discussion;
- using a single-file architecture;
- omitting `.test.tsx` tests;
- putting interactions in `play` functions instead of tests;
- writing stories without args, controls, a JSDoc block above `const meta`, or useful JSDoc above every story export;
- adding redundant stories that duplicate controls, args, another story, or normal dark-mode toolbar coverage;
- using `description.component` in `parameters.docs`;
- using `interface` or `any`;
- hardcoding colors, spacing, or fonts;
- opening a PR without the pre-PR review;
- leaving MCP artifacts before commit/review.

---

## Reference links

| Resource | URL |
| --------------------- | ---------------------------------------------------------------------------- |
| GitHub Projects Board | [Stack-and-Flow Projects](https://github.com/orgs/Stack-and-Flow/projects/1) |
| Production Storybook | [sf-design-system.netlify.app](https://sf-design-system.netlify.app/) |
| Guidelines | [`docs/GUIDELINES.en.md`](./GUIDELINES.en.md) |
| Design | [`docs/DESIGN.en.md`](./DESIGN.en.md) |
| Components | [`docs/COMPONENTS.en.md`](./COMPONENTS.en.md) |
| Quick Start | [`docs/QUICK_START.en.md`](./QUICK_START.en.md) |
| Governance | [`docs/GOVERNANCE.en.md`](./GOVERNANCE.en.md) |
| WAI-ARIA APG | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) |
