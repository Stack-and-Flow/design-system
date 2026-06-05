# Environment Setup — Stack-and-Flow Design System

This document covers everything you need to install and configure before contributing for the first time. Follow the steps in order.

---

## 1 — Visual Studio Code

### Installation

Download and install VS Code from [code.visualstudio.com](https://code.visualstudio.com/).

### Recommended extensions

The project includes a list of recommended extensions in `.vscode/extensions.json`. VS Code detects them automatically when you open the project and will offer to install them.

If you prefer to install them manually:

| Extension | ID | What it is for |
|---|---|---|
| **Biome** | `biomejs.biome` | Linting and formatting — the project's official formatter |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Tailwind class and CSS token autocomplete |
| **TypeScript Nightly** | `ms-vscode.vscode-typescript-next` | The latest TypeScript support |
| **Error Lens** | `usernamehw.errorlens` | Inline errors and warnings in the editor |
| **Version Lens** | `pflannery.vscode-versionlens` | Shows available package versions in `package.json` |

> **Important:** Biome replaces Prettier and ESLint in this project. If you have Prettier installed globally, make sure Biome has priority as the default formatter in this workspace.

### Editor font (optional)

The project configuration uses `RobotoMono Nerd Font`. If you do not have it installed, the editor will fall back to your system monospace font — this does not affect functionality.

You can download it from [nerdfonts.com](https://www.nerdfonts.com/font-downloads).

---

## 2 — Node.js and pnpm

### Node.js

The project requires **Node.js v22.14.0** exactly, managed with nvm.

**Install nvm:**

- macOS / Linux: [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- Windows: [github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

**Install and use the correct version:**

```bash
nvm install 22.14.0
nvm use
```

The `.nvmrc` file at the repository root contains the required version. `nvm use` without arguments reads it automatically.

**Verify:**

```bash
node --version
# → v22.14.0
```

### pnpm

This project uses pnpm as its package manager. Do not use npm or yarn — the lockfile and workspace setup are defined for pnpm.

```bash
npm install -g pnpm
```

**Verify:**

```bash
pnpm --version
# → 10.x.x
```

---

## 3 — opencode + gentle-ai

opencode is the AI editor we use for the assisted component workflow. gentle-ai is the agent harness layer that lives inside the project.

### Install opencode

Download the installer from [opencode.ai](https://opencode.ai/) or install via terminal:

```bash
npm install -g opencode-ai
```

See the official opencode documentation for up-to-date tutorials and walkthroughs.

### How gentle-ai works in this project

You do not need manual setup. When you open the project directory in opencode, `.atl/AGENTS.md` is injected automatically as base context for all agents. That means the agent already knows:

- the 6-file architecture and the rules for each file;
- which design tokens are available and how to use them;
- Storybook rules and story structure;
- anti-patterns that trigger PR rejection.

When you want to implement a component, simply say:

```
Implement this component: https://github.com/Stack-and-Flow/design-system/issues/XXX
```

The agent will load `component-contributor` and follow the current workflow: `status:approved` label verification, assignee verification, START WORK when applicable, validated spec reading, spec review, visual preflight, plan, implementation, visual review, pre-PR component audit, and END WORK when closing the task.

---

## 4 — Playwright MCP

MCPs (Model Context Protocol servers) extend the agent's capabilities. Playwright MCP lets the agent interact with the browser — useful for visually reviewing Storybook during development. Before commit or review, clean up its local artifacts:

```bash
rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output
```

### Installation

```bash
npm install -g @playwright/mcp
```

### opencode configuration

Add the following configuration to `~/.config/opencode/config.json` (or the equivalent path on your system):

```json
{
  "mcp": {
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Restart opencode after adding the configuration so the MCP can register.

**Verify that it is active:** when you start a conversation in opencode, the agent will have access to browser tools such as `browser_navigate`, `browser_snapshot`, and `browser_screenshot`.

> See the official opencode and Playwright MCP documentation for up-to-date configuration and troubleshooting examples.

---

## 5 — Project installation

### Clone the repository

```bash
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system
```

### Set the Node version

```bash
nvm use
```

### Install dependencies

```bash
pnpm install
```

Lefthook (git hooks) installs automatically via the project setup. It configures the pre-commit hooks (Biome + TypeScript) without extra steps.

### Verify that everything works

```bash
pnpm run storybook
```

Storybook should open at `http://localhost:6006`. If you can see the existing components, the environment is ready.

**Additional checks:**

```bash
pnpm run test          # Vitest — should pass without errors
pnpm exec biome check  # Biome — should pass without warnings
```

---

## 6 — Git setup

### Identity

If this is the first time you use Git on this machine:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Branch convention

Before starting any task, create your branch from `main`. If the task comes from an issue, use issue-derived naming:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feat/123-button
```

If you work with a worktree, use a sibling worktree next to the repo, for example:

```text
../design-system-feat-123-button
```

Avoid `/tmp` unless it is explicitly requested.

| Prefix | When to use it |
|---|---|
| `feat/` | New component or feature |
| `fix/` | Bug fix |
| `docs/` | Documentation |
| `chore/` | Dependencies, tooling, config |
| `refactor/` | Code improvement without behavior change |

### Conventional Commits

Commits must follow the format `<type>: <description>`:

```bash
git commit -m "feat: add Button component with primary and outlined variants"
git commit -m "fix: correct focus ring on Input in light mode"
git commit -m "docs: update CONTRIBUTING with visual review checklist"
```

Pre-commit hooks run Biome and TypeScript automatically. If a commit fails, fix the reported errors before trying again.

---

## Ready to contribute

With the environment configured, the next step is the contributor workflow:

👉 **[Contributor Workflow — Stack-and-Flow Design System](./CONTRIBUTOR-FLOW.en.md)**

---

## Common troubleshooting

**`pnpm install` fails with a Node version error**
Make sure you ran `nvm use` in the project directory. The active version must be `v22.14.0`.

**Biome does not format on save**
Verify that the `biomejs.biome` extension is active and that Biome is the default formatter for the workspace. In VS Code: `Ctrl+Shift+P` → "Format Document With..." → select Biome.

**Storybook does not start**
Try clearing the cache: `pnpm run storybook-clean-cache && pnpm run storybook`.

**Pre-commit hooks do not install**
Run `pnpm exec lefthook install` manually.

**opencode does not load project context**
Make sure you open the project root directory (`design-system/`), not a subfolder. `.atl/AGENTS.md` must exist at the root of the workspace you opened.
