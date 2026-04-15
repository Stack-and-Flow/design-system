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

Every component MUST strictly follow the Atomic Design + Container/Presentational architecture (detailed in [`GUIDELINES.en.md`](./GUIDELINES.en.md)).

1. **Locate the right tier**: Decide if it's an `atom`, `molecule`, or `organism`.
2. **Create the structure**: If you create a `Button` atom, the structure MUST be exactly:
   ```text
   src/components/atoms/button/
   ├── Button.tsx           # Presentational layer
   ├── useButton.ts         # Container layer (Logic & CVA)
   ├── types.ts             # Types and CVA variants
   ├── index.ts             # Re-exports
   └── Button.stories.tsx   # Storybook documentation
   ```
3. **Implement**:
   - Write variants in `types.ts`.
   - Write logic in `useButton.ts`.
   - Consume logic in `Button.tsx`.
4. **Export**: Re-export correctly in `index.ts`.

---

## Storybook Documentation Rules

Storybook is our single source of truth. Every component MUST be fully documented.

- **English Only**: All stories, descriptions, and comments MUST be written in English.
- **Controls & Args**: You MUST define `controls` via JSDoc in your `types.ts` and set default `args` in the `.stories.tsx` file.
- **Docs Description**: You MUST include a `parameters.docs.description.component` describing what the component does and when to use it.

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
- [ ] Component follows the 5-file architecture perfectly.
- [ ] No `interface` used (only `type`). No `any`.
- [ ] Storybook contains `args`, `controls`, and `description`.
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
- The 5-file architecture and where each piece of logic belongs
- Which design tokens to use (and which hardcoded values to avoid)
- The Storybook rules and required story structure
- The full list of anti-patterns that cause PR rejection

**To activate**: simply open the project directory in opencode. No manual setup required — context loads automatically.

---

### AI Workflow for Components

When using AI to create a component, follow this adapted workflow:

1. **Research** — Ask the AI to scan `src/components/` and confirm the component doesn't already exist. Identify the correct atomic tier.
2. **Scaffold** — Run `compilot-cli` to generate the 5-file structure, or ask the AI to replicate it exactly.
3. **Spec first** — Define `types.ts` first: props, CVA variants, and JSDoc controls. Let the AI help, but review every type.
4. **Implement** — Ask the AI to implement the hook and component strictly following GUIDELINES.en.md. Reference the file explicitly.
5. **Review** — Manually open each generated file and verify it against the PR checklist below. Do not skip this step.
6. **Document** — Verify the `.stories.tsx` file has `Default`, `Disabled`, and variant-specific stories with proper `args`, controls, and an English description.

---

### What AI should NOT do

If you are using an AI tool, do not allow it to:

- Modify `src/styles/theme.css` tokens without your explicit approval
- Add new `npm` or `pnpm` dependencies without discussion
- Skip the 5-file structure in favor of a "simpler" single-file approach
- Write Storybook stories in Spanish or without proper controls and descriptions
- Use `interface` instead of `type`, or introduce `any` types

If the AI proposes any of these, reject it and redirect it to the correct pattern.

---

### PR Review for AI-generated code

AI-generated code goes through the **exact same review process** as human-written code. There are no exceptions.

Before requesting a review on an AI-assisted PR:
- Run through the PR checklist as you would for any contribution
- Fix every violation before requesting review — reviewers will not flag AI-generated issues as "acceptable"
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
