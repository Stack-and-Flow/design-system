# Quick Start Guide

Get from zero to your first contribution in under 10 minutes.

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | see `.nvmrc` | [nodejs.org](https://nodejs.org/) |
| pnpm | latest | `npm i -g pnpm` |
| nvm | any | [UNIX](https://github.com/nvm-sh/nvm) / [Windows](https://github.com/coreybutler/nvm-windows) |
| git | any | [git-scm.com](https://git-scm.com/) |

## 1. Clone and install

```bash
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system
nvm use
pnpm install
```

## 2. Start Storybook

```bash
pnpm run storybook
```

Storybook opens at `http://localhost:6006`. This is your development environment — every component lives here.

## 3. Find something to work on

Go to the [GitHub Project board](https://github.com/orgs/Stack-and-Flow/projects/1) and pick an open issue from the **Todo** column.

> **First time?** Look for issues tagged `layer: atom` with `category: component` — these are self-contained and well-defined.

Before writing code, make sure the spec is defined, the issue has the `status:approved` label, and the issue is not assigned to someone else. Only then run **START WORK**:
- verify assignees and assign the issue to yourself;
- move it to `In progress`;
- record the branch and worktree plan.

## 4. Create your branch

If the task comes from an issue, use issue-derived naming:

```bash
git checkout -b feat/123-your-component
# or
git checkout -b fix/128-short-description
```

If you use a worktree, use the matching sibling path:

```text
../design-system-feat-123-your-component
```

Branch naming follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat/` — new component or feature
- `fix/` — bug fix
- `a11y/` — accessibility improvement
- `tokens/` — design token change
- `docs/` — documentation only

## 5. Build your component

Every component follows the **6-file pattern**. Use `CONTRIBUTOR-FLOW.en.md` as the canonical workflow and create it manually under the correct atomic layer:

```
src/components/atoms/your-component/
├── types.ts                   # Types + JSDoc controls + CVA variants
├── useYourComponent.ts        # Container layer — logic, state, handlers
├── YourComponent.tsx          # Presentational layer — JSX only
├── YourComponent.test.tsx     # Hook and component behavior tests
├── YourComponent.stories.tsx  # Storybook documentation
└── index.ts                   # Public exports
```

Read [CONTRIBUTOR-FLOW.en.md](./CONTRIBUTOR-FLOW.en.md) for the full workflow and [GUIDELINES.en.md](./GUIDELINES.en.md) for architecture rules before writing code.

## 6. Run tests

```bash
pnpm test
```

All tests must pass before opening a PR. If you're adding a new component, add tests too.

## 7. Open a Pull Request

Push your branch and open a PR against `main`:

```bash
git push origin feat/123-your-component
```

Then go to GitHub → your branch → **Compare & pull request**.

- Use the PR template — fill in every section
- Link the issue in the summary (`Closes #123`)
- Add screenshots if there are visual changes
- Clean MCP artifacts before commit/review: `rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output`

> The project lead reviews and merges. The task moves to `Done` only through **END WORK** after the PR is merged or explicit approval is given.

---

## Commit message format

We use [Conventional Commits](https://www.conventionalcommits.org/). Git hooks will reject commits that don't follow this format.

```
feat(button): add loading state variant
fix(switch): forward aria-label prop correctly
docs(modal): add usage examples to Storybook
fix(a11y): improve input focus ring visibility
chore(tokens): update spacing token docs
```

Format: `<type>(<optional scope>): <description>` (`scope` is optional)

Common types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Use `a11y`, `tokens`, or `infra` as scopes, not as custom types.

---

## Using AI agents (optional)

This project supports [opencode](https://opencode.ai/) with pre-configured context. If you use it:

```bash
opencode
```

The agent automatically loads the project rules from `AGENTS.md` — no manual setup needed. Read [CONTRIBUTING.en.md](./CONTRIBUTING.en.md#working-with-ai-agents) for the full AI workflow.

---

## Need help?

- 💬 [GitHub Discussions](https://github.com/orgs/Stack-and-Flow/discussions) — for questions and ideas
- 🐛 [Open an issue](https://github.com/Stack-and-Flow/design-system/issues/new/choose) — for bugs or proposals
- 📋 [Project board](https://github.com/orgs/Stack-and-Flow/projects/1) — for task tracking
