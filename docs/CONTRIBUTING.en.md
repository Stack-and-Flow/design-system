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

The canonical component workflow is [`CONTRIBUTOR-FLOW.md`](./CONTRIBUTOR-FLOW.md). This document only summarizes the main rules.

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
4. **Review before PR**: run the pre-PR component review defined in `CONTRIBUTOR-FLOW.md`.

---

## Storybook Documentation Rules

Storybook is our single source of truth. Every component MUST be fully documented.

- **English by default**: Stories, descriptions, comments, and labels are written in English, except the canonical docs headings.
- **Controls & Args**: You MUST define `controls` via JSDoc in `types.ts` and set default `args` in `.stories.tsx`.
- **Docs Description**: You MUST include `parameters.docs.description.component` with this structure:
  - `## Descripción` is required.
  - `## Dependencies` only when the component uses other components or external primitives.
  - `## Guía de uso` only when usage is complex.
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
- Branch naming convention: `feat/component-name`, `fix/bug-name`, `chore/task-name`.

### Commits
We strictly follow **Conventional Commits**:
- `feat:` for new features or components.
- `fix:` for bug fixes.
- `chore:` for tooling, dependencies, etc.
- `docs:` for documentation updates.
- `refactor:` for code changes that neither fix a bug nor add a feature.
- `style:` for formatting, missing semi-colons, etc.
- `test:` for adding or fixing tests.

### Pull Request Process
1. Push your branch and open a PR against `main`.
2. You can call automatic review to copilot since it is prepared to human review.
3. The PR MUST pass all CI checks (Biome formatting/linting, TypeScript strict checks).
4. The PR MUST be reviewed by at least one core maintainer before merging.

### PR Checklist
Before requesting a review, verify:
- [ ] Component follows the 6-file architecture perfectly.
- [ ] No `interface` used (only `type`). No `any`.
- [ ] Storybook contains `args`, `controls`, and `parameters.docs.description.component`.
- [ ] `## Descripción` is present; `## Dependencies` and `## Guía de uso` are used only when applicable.
- [ ] Interactive components have tests in `.test.tsx`.
- [ ] The pre-PR component review has passed or is documented.
- [ ] Tokens from `theme.css` are used (no hardcoded colors or spacing).
- [ ] ARIA attributes are implemented for interactable elements.
- [ ] Conventional Commits are used.

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
- Which design tokens to use (and which hardcoded values to avoid)
- The Storybook rules and required story structure
- The full list of anti-patterns that cause PR rejection

**To activate**: simply open the project directory in opencode. No manual setup required — context loads automatically.

---

### AI Workflow for Components

When using gentle-ai/opencode, the agent follows `component-contributor`. The full canonical workflow is [`CONTRIBUTOR-FLOW.md`](./CONTRIBUTOR-FLOW.md).

Phase summary:

1. **Research** — investigate references, API, states, accessibility, and design.
2. **Spec** — document the issue; the agent reads it without inventing behavior.
3. **Spec review** — the agent critiques gaps, risks, and inconsistencies before planning.
4. **Visual preflight** — tokens, surfaces, states, focus, transitions, and dark mode are aligned before the plan.
5. **Plan** — review and approve files, variants, tests, stories, and accessibility.
6. **Implementation** — the agent creates the 6 files and explains decisions.
7. **Visual review** — CRITICAL or MAJOR issues are fixed before continuing.
8. **Pre-PR review** — `components-auditor` validates architecture, tests, Storybook, tokens, visual states, and accessibility before PR.

---

### What AI should NOT do

If you are using an AI tool, do not allow it to:

- Modify `src/styles/theme.css` tokens without your explicit approval
- Add new `npm` or `pnpm` dependencies without discussion
- Skip the 6-file structure in favor of a "simpler" single-file approach
- Write stories without args, controls, or `parameters.docs.description.component`
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
