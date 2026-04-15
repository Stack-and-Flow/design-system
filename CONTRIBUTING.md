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

### Proprietary Fonts Note
The design system uses **WildWolf** and **Univia** fonts. Since these are proprietary, they are **not included** in the open-source repository. The system is configured to gracefully fallback to standard sans-serif fonts in your local environment without breaking the layout.

---

## How to Create a New Component

Every component MUST strictly follow the Atomic Design + Container/Presentational architecture (Detailed in [`GUIDELINES.md`](./GUIDELINES.md)).

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
2. The PR MUST pass all CI checks (Biome formatting/linting, TypeScript strict checks).
3. The PR MUST be reviewed by at least one core maintainer before merging.

### PR Checklist
Before requesting a review, verify:
- [ ] Component follows the 5-file architecture perfectly.
- [ ] No `interface` used (only `type`). No `any`.
- [ ] Storybook contains `args`, `controls`, and `description`.
- [ ] Tokens from `theme.css` are used (no hardcoded colors or spacing).
- [ ] ARIA attributes are implemented for interactable elements.
- [ ] Conventional Commits are used.

---

## Reporting Bugs & Proposing Features

- **Bugs**: Open an issue using the bug report template. Include reproduction steps, expected behavior, and screenshots if applicable.
- **Proposing Components**: Before writing code, propose the component in the [GitHub Projects Board](https://github.com/orgs/Stack-and-Flow/projects/1) under the "In Review" tab, or open a Feature Request issue to discuss API and requirements with the Project Lead.

---

## Useful Links
- **Storybook Demo**: [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)
- **GitHub Projects (Kanban)**: [Project Board](https://github.com/orgs/Stack-and-Flow/projects/1)
- **Guidelines**: [GUIDELINES.md](./GUIDELINES.md)