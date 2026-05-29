# Contributing to Stack-and-Flow Design System

Thank you for your interest in contributing! This document provides the steps and workflow to contribute to our design system.

## Prerequisites

You MUST have the following installed:

- [Node.js](https://nodejs.org/) (Use the version specified in `.nvmrc`)
- [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage Node versions.
- [pnpm](https://pnpm.io/installation) package manager.

## Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Stack-and-Flow/design-system.git
   cd design-system
   ```
2. **Set the correct Node version**:
   ```bash
   nvm use
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Start Storybook**:
   ```bash
   pnpm run storybook
   ```

### Fonts Note

The design system uses **Space Grotesk Variable**, loaded via `@fontsource-variable/space-grotesk`. It is included as a regular npm dependency and will be available automatically after `pnpm install`.

---

## How to Create a New Component

The canonical component workflow is [`CONTRIBUTOR-FLOW.en.md`](./CONTRIBUTOR-FLOW.en.md). This document only summarizes the main rules.

Every component MUST strictly follow the Atomic Design + Container/Presentational architecture (detailed in [`GUIDELINES.en.md`](./GUIDELINES.en.md)).

1. **Locate the right tier**: Decide if it's an `atom`, `molecule`, or `organism`.
2. **Create the structure**: If you create a `Button` atom, the structure MUST be exactly:
   ```text
   src/components/atoms/button/
   ├── types.ts             # Types, public props, JSDoc controls, CVA variants
   ├── useButton.ts         # Container layer: logic, state, refs, handlers
   ├── Button.tsx           # Presentational layer: JSX only
   ├── Button.test.tsx      # Hook and component behavior tests
   ├── Button.stories.tsx   # Storybook documentation
   └── index.ts             # Re-exports
   ```
3. **Implement in order**: `types.ts` → hook → component → tests → stories → `index.ts`.
4. **Design visual semantics deliberately**: decorative glow/elevation belongs to the component contract. When consumers may need a quieter version of a glow-bearing control, prefer `emphasis="default" | "flat"` over a raw `glow?: boolean` prop. Never let decorative emphasis disable focus-visible/accessibility glow.
5. **Review before PR**: run the pre-PR component review defined in `CONTRIBUTOR-FLOW.en.md`.

---

## Storybook Documentation Rules

Storybook is our single source of truth. Every component MUST be fully documented.

- **English only**: all Storybook documentation is written in English, including docs headings, descriptions, comments, story names, and arg labels.
- **Controls & Args**: You MUST define `controls` via JSDoc in `types.ts` and set default `args` in `.stories.tsx`.
- **Docs Description**: You MUST include a JSDoc block above `const meta` with this structure:
  - `## Description` is required.
  - `## Dependencies` only when the component uses other components or external primitives.
  - `## Usage Guide` only when usage is complex.
- **No `parameters.docs.description.component`**: component docs live in JSDoc above `const meta`.
- **No `play` functions**: Interactions are tested in `ComponentName.test.tsx`, not in stories.

---

## Component Tests

Stories are living documentation, not the test suite. Interaction and behavior tests live in `ComponentName.test.tsx`.

Before opening a PR, verify:

- [ ] Hook logic is tested with `renderHook` when the hook contains logic.
- [ ] Component behavior is tested with `render` / `screen` / `userEvent`.
- [ ] ARIA, keyboard, disabled behavior, and relevant states are covered.
- [ ] Tests do not use internal CSS class strings as the main contract.
- [ ] `npm test -- --run src/components/.../ComponentName.test.tsx` passes.

---

## Git Workflow

### Branching Strategy

- `main` is the base branch. All PRs target `main`.
- If the task comes from an issue, use: `{type}/{issue-number}-{slug}` (for example `feat/123-button`).
- If you also use a worktree, use the matching sibling worktree path: `../design-system-{type}-{issue-number}-{slug}`.
- See [`CONTRIBUTOR-FLOW.en.md`](./CONTRIBUTOR-FLOW.en.md) for the full naming, START WORK, and END WORK lifecycle.

### Commits

We strictly follow **Conventional Commits**. The `commit-msg` hook runs `commitlint` automatically and rejects any commit that does not match the required format.

Required format:

```text
<type>(<optional scope>): <description>
```

Valid examples:

```text
feat(button): add loading state
fix(calendar): correct keyboard navigation
chore(infra): update lint tooling
docs: update contribution guide
```

Common types:

- `feat:` for new features or components.
- `fix:` for bug fixes.
- `chore:` for tooling, dependencies, etc.
- `docs:` for documentation updates.
- `refactor:` for code changes that neither fix a bug nor add a feature.
- `style:` for formatting, missing semi-colons, etc.
- `test:` for adding or fixing tests.

Before creating a commit, you can validate a message manually:

```bash
echo "feat(button): add loading state" | pnpm exec commitlint
```

### Pull Request Process

1. Before implementing from an issue, verify that the spec is defined and the issue has the `status:approved` label; only then run **START WORK**: assign the issue, move it to `In progress`, and record the branch/worktree plan.
2. Push your branch and open a PR against `main`.
3. Use a PR title with the same Conventional Commit format, for example `feat(button): add loading state`.
4. You can request automated Copilot review until the PR is ready for human review.
5. The PR MUST pass all CI checks, including tests, Storybook build, accessibility, and security scans.
6. The PR MUST be reviewed by at least one core maintainer before merging.
7. Mark the task `Done` only through **END WORK** after the PR is merged or the maintainer/user explicitly approves closure.

### PR Checklist

Before requesting a review, verify:

- [ ] Component follows the 6-file architecture perfectly.
- [ ] No `interface` used (only `type`). No `any`.
- [ ] Storybook contains `args`, `controls`, and a JSDoc block above `const meta`.
- [ ] `## Description` is present; `## Dependencies` and `## Usage Guide` are used only when applicable.
- [ ] Interactive components have tests in `.test.tsx`.
- [ ] The pre-PR component review has passed or is documented.
- [ ] Tokens from `theme.css` are used (no hardcoded colors; arbitrary sizing/typography only in approved compact/dense CVA variants).
- [ ] ARIA attributes are implemented for interactable elements.
- [ ] Conventional Commits are used for commit messages and the PR title.
- [ ] Security checks pass, or any false positives are documented in the PR.
- [ ] MCP cleanup ran before commit/review: `rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output`.

### Security checks

Pull requests run dependency audit and secrets scanning before merge. See [SECURITY.en.md](./SECURITY.en.md) for the policy, remediation steps, and false-positive handling.

---

## Working with AI Agents

### Is AI allowed?

Yes. Contributors are free to use AI-assisted tools (GitHub Copilot, opencode/gentle-ai, Cursor, etc.) when working on this project.

However, two rules are non-negotiable:

1. **The output MUST meet all project standards** — regardless of how it was generated. If the AI produced code that breaks GUIDELINES.en.md, fix it before opening a PR.
2. **You are responsible** for every line in your PR, AI-generated or not. "The AI wrote it" is not a valid reason to bypass the PR checklist.

---

### Using gentle-ai (opencode)

If you use [opencode](https://opencode.ai/), this project includes `.atl/AGENTS.md` — a context file that is automatically injected into all agents when you open the project.

The agents will already know:

- The 6-file architecture and where each piece of logic belongs
- Which design tokens to use, which hardcoded values to avoid, and whether a compact/dense CVA size exception is approved
- The Storybook rules and required story structure
- The full list of anti-patterns that cause PR rejection

**To activate**: simply open the project directory in opencode. No manual setup required — context loads automatically.

---

### AI Workflow for Components

When using gentle-ai/opencode, the agent follows `component-contributor`. The full canonical workflow is [`CONTRIBUTOR-FLOW.en.md`](./CONTRIBUTOR-FLOW.en.md).

Phase summary:

1. **Research** — investigate references, API, states, accessibility, and design.
2. **Spec proposal** — use `component-spec-proposer` to turn the task and reference into a validated issue spec.
3. **Approval gate** — once the spec is written, wait for the `status:approved` label on the issue; without that label there is no START WORK or implementation under any circumstance.
4. **START WORK** — after the `status:approved` label, assign the issue, move it to `In progress`, and record branch/worktree.
5. **Spec intake** — with START WORK already completed, `component-contributor` reads the `## Validated component spec` section without inventing behavior.
6. **Spec review** — the agent critiques gaps, risks, and inconsistencies before planning.
7. **Visual preflight** — tokens, surfaces, states, focus, transitions, and dark mode are aligned before the plan.
8. **Plan** — review and approve files, variants, tests, stories, and accessibility.
9. **Implementation** — the agent creates the 6 files and explains decisions.
10. **Visual review** — CRITICAL or MAJOR issues are fixed before continuing.
11. **Pre-PR review** — `components-auditor` validates architecture, tests, Storybook, tokens, visual states, and accessibility before PR.
12. **END WORK** — move the task to `Done` only with a merged PR or explicit maintainer/user approval plus validation evidence.

> To activate the full flow, first prepare the spec with `component-spec-proposer`; after validation, wait for `status:approved`, share the issue URL, and ask the agent to implement the component.

---

### What AI should NOT do

If you are using an AI tool, do not allow it to:

- Modify `src/styles/theme.css` tokens without your explicit approval
- Add new `npm` or `pnpm` dependencies without discussion
- Skip the 6-file structure in favor of a "simpler" single-file approach
- Write stories without args, controls, or a JSDoc block above `const meta`
- Use `interface` instead of `type`, or introduce `any` types

If the AI proposes any of these, reject it and redirect it to the correct pattern.

---

### PR Review for AI-generated code

AI-generated code goes through the **exact same review process** as human-written code. There are no exceptions.

Before requesting a review on an AI-assisted PR:

- Run through the PR checklist as you would for any contribution
- Run the pre-PR component review and document the evidence
- Fix every CRITICAL or MAJOR issue before requesting review
- If a guideline was broken, the PR will be rejected regardless of the author

---

## Reporting Bugs & Proposing Features

- **Bugs**: Open an issue using the bug report template. Include reproduction steps, expected behavior, and screenshots if applicable.
- **Proposing Components**: Before writing code, propose the component in the [GitHub Projects Board](https://github.com/orgs/Stack-and-Flow/projects/1) or open a Feature Request issue to discuss API and requirements with the Project Lead.

---

## Useful Links

- **Storybook Demo**: [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)
- **GitHub Projects (Kanban)**: [Project Board](https://github.com/orgs/Stack-and-Flow/projects/1)
- **Guidelines**: [GUIDELINES.en.md](./GUIDELINES.en.md)
- **Quick Start**: [QUICK_START.en.md](./QUICK_START.en.md)
- **Governance**: [GOVERNANCE.en.md](./GOVERNANCE.en.md)
