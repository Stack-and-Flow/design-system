---
name: npm-architect
description: >
  Guides the transformation of Stack-and-Flow Design System into a properly distributable npm package
  with per-component tree-shaking, correct exports map, vite lib mode, and peer dependency hygiene.
  Trigger: When someone asks "how do we distribute this as npm?", "set up the npm package",
  "configure the build for publishing", or "how do we make each component importable independently".
  Also delegable from sdd-design when designing the distribution strategy.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- Someone asks how to publish the design system as an npm package
- Someone asks how to enable per-component imports (`import { Button } from '@stack-and-flow/design-system/button'`)
- Someone asks to configure tree-shaking, peer deps, the build output, or package verification policy
- Someone asks to review package exports, generated declarations, React peer compatibility, or CI/package manager contract drift
- Delegated from `sdd-design` to design the distribution architecture

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-design` or `sdd-explore`:

- **Scope**: `full` (all phases) | `audit` (Phase 1 only) | `exports` (Phase 3 only) | `build` (Phase 4 only)

When delegated: run requested scope, return SDD return envelope:

```markdown
## NPM Architecture Result

**Scope**: {scope}
**Current state**: {summary of what exists}
**Changes proposed**: {list of files to modify + what changes}
**Breaking changes**: {list or "None"}
**Next steps**: {ordered list}
```

---

## Current State Policy

Do not trust frozen package-state tables in this skill. The npm package shape changes over time, so the current state must be verified at runtime before proposing exports, build, dependency, or publishing changes.

Use Phase 1 to inspect `package.json`, the package scripts, the publish/consumer verification scripts, workflow pnpm pinning, and the existing exports/build setup. Report what exists now versus what the requested package goal requires.

## Current repo maintenance contract

Treat these as the current Stack-and-Flow package gates unless the repo changes again:

- `package.json` is the source of truth for the package manager contract: `pnpm@10.34.1`
- GitHub workflows that install pnpm should pin the same exact version, not a floating major such as `10`
- `pnpm run build` is the publish-shape gate: it builds `dist/`, emits declarations, and runs `scripts/prepare-dist.mjs`
- `pnpm run verify:package` is the consumer-compatibility gate: it builds, packs, and verifies real React 18 and React 19 consumers
- Published declarations must not leak internal alias specifiers (`@/`, `@atoms/`, `@molecules/`, `@organisms/`, `@hooks/`, `@utils/`) or CSS side-effect imports
- Apply these checks only when the work changes package output, exports, generated declarations, peer ranges, React major versions, or CI/package distribution behavior. Do not force routine component-only PRs through a package architecture audit.

---

## Phase 1 — Audit current state

Before making any change, read and report the current state:

```powershell
# Package contract
Get-Content package.json | ConvertFrom-Json | Select-Object packageManager, exports, files, main, module, types, sideEffects, peerDependencies

# Build and consumer verification commands
Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty scripts | Select-Object build, 'verify:package'

# Workflow pnpm pinning
Get-ChildItem .github/workflows/*.yml | Select-String 'pnpm/action-setup|version:'

# Published output hygiene / consumer verification helpers
Get-Content scripts/prepare-dist.mjs
Get-Content scripts/verify-package-consumption.mjs
```

At minimum, report:

- exact `packageManager` value
- whether workflows pin the same pnpm version
- what `pnpm run build` does to publishable output
- whether `verify:package` covers React 18 and React 19 consumers
- whether generated declarations are sanitized for published consumption

Present the full gap table before proceeding.

---

## Phase 2 — Root entry point

### Create `src/index.ts`

This is the single entry point for consumers who import the full package:
`import { Button } from '@stack-and-flow/design-system'`

```typescript
// src/index.ts — public API barrel

// Primitives
export { Divider } from './components/primitives/divider';
export type * from './components/primitives/divider/types';

export { Spacer } from './components/primitives/spacer';
export type * from './components/primitives/spacer/types';

// Atoms
export { Button } from './components/atoms/button';
export type * from './components/atoms/button/types';

export { Avatar } from './components/atoms/avatar';
export type * from './components/atoms/avatar/types';

export { Badge } from './components/atoms/badge';
export type * from './components/atoms/badge/types';

export { Dropdown } from './components/atoms/dropdown';
export type * from './components/atoms/dropdown/types';

export { Icon } from './components/atoms/icon';
export type * from './components/atoms/icon/types';

export { IconButton } from './components/atoms/icon-button';
export type * from './components/atoms/icon-button/types';

export { Input } from './components/atoms/input';
export type * from './components/atoms/input/types';

export { Modal } from './components/organisms/modal';
export type * from './components/organisms/modal/types';

export { Skeleton } from './components/atoms/skeleton';
export type * from './components/atoms/skeleton/types';

export { Switch } from './components/atoms/switch';
export type * from './components/atoms/switch/types';

export { Text } from './components/atoms/text';
export type * from './components/atoms/text/types';

// Molecules
export { Snippet } from './components/molecules/snippet';
export type * from './components/molecules/snippet/types';

// Utilities intentionally exported as public API
export { cn } from './lib/utils';
```

**Rules**:

- ONLY export what is part of the public API — no internal hooks, no internal utils beyond `cn`
- Every component export must have a corresponding type export
- `export type` for type-only re-exports (Biome enforces this)
- Do NOT export Storybook utilities, test helpers, or internal implementation details

---

## Phase 3 — Per-component entry points

Per-component imports allow tree-shaking at the bundler level:
`import { Button } from '@stack-and-flow/design-system/button'`

This requires an `exports` map in `package.json` with one entry per component.

### package.json exports field

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/atoms/button/index.js",
      "require": "./dist/atoms/button/index.cjs",
      "types": "./dist/atoms/button/index.d.ts"
    },
    "./avatar": {
      "import": "./dist/atoms/avatar/index.js",
      "require": "./dist/atoms/avatar/index.cjs",
      "types": "./dist/atoms/avatar/index.d.ts"
    },
    "./badge": {
      "import": "./dist/atoms/badge/index.js",
      "require": "./dist/atoms/badge/index.cjs",
      "types": "./dist/atoms/badge/index.d.ts"
    },
    "./divider": {
      "import": "./dist/primitives/divider/index.js",
      "require": "./dist/primitives/divider/index.cjs",
      "types": "./dist/primitives/divider/index.d.ts"
    },
    "./dropdown": {
      "import": "./dist/atoms/dropdown/index.js",
      "require": "./dist/atoms/dropdown/index.cjs",
      "types": "./dist/atoms/dropdown/index.d.ts"
    },
    "./icon": {
      "import": "./dist/atoms/icon/index.js",
      "require": "./dist/atoms/icon/index.cjs",
      "types": "./dist/atoms/icon/index.d.ts"
    },
    "./input": {
      "import": "./dist/atoms/input/index.js",
      "require": "./dist/atoms/input/index.cjs",
      "types": "./dist/atoms/input/index.d.ts"
    },
    "./modal": {
      "import": "./dist/atoms/modal/index.js",
      "require": "./dist/atoms/modal/index.cjs",
      "types": "./dist/atoms/modal/index.d.ts"
    },
    "./switch": {
      "import": "./dist/atoms/switch/index.js",
      "require": "./dist/atoms/switch/index.cjs",
      "types": "./dist/atoms/switch/index.d.ts"
    },
    "./text": {
      "import": "./dist/atoms/text/index.js",
      "require": "./dist/atoms/text/index.cjs",
      "types": "./dist/atoms/text/index.d.ts"
    },
    "./styles": {
      "import": "./dist/design-system.css"
    }
  }
}
```

**Why both `import` and `require`?**
ESM consumers use `import`. CJS consumers (Jest, older Node tooling) use `require`. Providing both avoids hard dependencies on the consumer's module system.

**Why a `./styles` entry?**
Consumers need to import the CSS tokens. Without a declared export path, bundlers may not resolve it correctly. The explicit `./styles` entry makes it:

```typescript
import '@stack-and-flow/design-system/styles';
```

---

## Phase 4 — Vite lib mode configuration

Inspect the current Vite build before proposing a package architecture change. In the current repo, `vite.config.ts` already contains the library build configuration used by `pnpm run build`; do not assume a separate `vite.config.lib.ts` exists or is required.

Current library-build expectations:

- `build.lib.entry` points at `src/index.ts`
- ESM and CJS outputs are emitted from the configured Vite build
- React, React DOM, JSX runtime, and icon package imports stay externalized for consumers
- CSS output resolves to the exported package styles entry, currently `./styles` -> `./dist/design-system.css`
- `tsconfig.build.json` and `scripts/prepare-dist.mjs` complete the declaration-output contract after Vite runs

Only introduce a separate Vite library config if the current config can no longer serve Storybook/test/dev and package output safely. If you propose that split, explain why the current unified config is insufficient and update scripts, exports, and verification evidence together.

### Keep the publish build command explicit

If the repo already ships a publish build, keep that command as the source of truth and make sure it includes declaration sanitization after emit. In the current repo, that contract is:

```json
"build": "vite build && tsc --project tsconfig.build.json && node scripts/prepare-dist.mjs"
```

---

## Phase 5 — package.json hygiene

### Move runtime deps to peerDependencies

Consumers already have React in their project. Bundling it would cause two React instances — a hard runtime error.

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": false
    }
  },
  "dependencies": {
    "@radix-ui/react-avatar": "1.1.11",
    "@radix-ui/react-dialog": "1.1.15",
    "@radix-ui/react-dropdown-menu": "2.1.16",
    "@radix-ui/react-select": "2.2.6",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "tailwind-merge": "3.5.0",
    "lucide-react": "1.8.0",
    "spinners-react": "1.0.11"
  }
}
```

**What stays in `dependencies`**: Radix, CVA, clsx, tailwind-merge, lucide, spinners — these are runtime dependencies that consumers may not already have. They MUST be installed alongside the package.

**What moves to `peerDependencies`**: React, ReactDOM — every consumer already has these.

**What moves to `devDependencies`**: Everything Storybook, Vite plugins, TypeScript, testing — none of this is needed at runtime.

### Add `files` field

Controls what gets published to npm. ONLY the `dist/` directory and the root metadata files:

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

This prevents publishing: `src/`, `.storybook/`, `docs/`, `.atl/`, test files, config files.

### Add `sideEffects` field

Tells bundlers which files have side effects (cannot be tree-shaken away).

```json
{
  "sideEffects": [
    "dist/design-system.css",
    "**/*.css"
  ]
}
```

**Why**: if `sideEffects: false` (fully tree-shakeable), bundlers may eliminate the CSS import. CSS files ALWAYS have side effects — they modify the global stylesheet. Everything else (`*.js`) is safe to tree-shake.

### Add `main`, `module`, and `types` fields

For compatibility with older tooling that does not read `exports`:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

---

## Phase 6 — TypeScript declarations

The declaration gate is the published `.d.ts` output, not only the TypeScript compiler flags.

`pnpm run build` already emits declarations and then runs `scripts/prepare-dist.mjs`, so inspect both the tsconfig settings and the post-processing script before proposing declaration changes.

Declaration checklist:

- emitted `.d.ts` files resolve through public or relative specifiers, never internal aliases such as `@/` or `@atoms/`
- `dist/index.d.ts` does not keep CSS side-effect imports such as `import './styles/global.css';`
- post-build sanitization stays aligned with the actual alias scheme used in source
- declaration fixes should target publish-safe output; do not require committing generated `dist/` files unless the workflow explicitly does so

---

## Phase 7 — Verify package output

Run this phase when the work changes package output, exports, generated declarations, peer ranges, CI/package distribution policy, or a React major version. Skip it for routine component-only changes that do not affect published package behavior.

```powershell
# Publish-shape gate
pnpm run build

# Consumer-compatibility gate
pnpm run verify:package
```

Expected evidence:

- `pnpm run build` succeeds and leaves publishable output in `dist/`
- `scripts/prepare-dist.mjs` has sanitized generated declarations for publish-safe consumption
- `pnpm run verify:package` proves the packed package works for real React 18 and React 19 consumers
- ESM/CJS root imports and the exported styles subpath resolve successfully

If the request is only documentation or skill text, do not run these commands just to satisfy ceremony. Cite the contract accurately instead.

---

## Decision log — tradeoffs

| Decision | Chosen | Rejected | Reason |
|----------|--------|----------|--------|
| Build tool | Vite lib mode | Rollup standalone | Already in project; consistent with dev config |
| Module format | ESM + CJS | ESM only | CJS needed for Jest/older Node consumers |
| Vite config shape | Current `vite.config.ts` unless evidence requires split | Assume `vite.config.lib.ts` is needed | The current repo already builds the library from `vite.config.ts`; propose a split only with concrete evidence |
| CSS distribution | Separate `./styles` export | Inline-in-JS | Inline CSS-in-JS would require a runtime; separate file is simpler and standard |
| Package verification | `pnpm run verify:package` with React 18 + React 19 consumers | Tests/Storybook only for package compatibility | Consumer installs catch peer/export/declaration failures that app-level tests can miss |
| Declaration hygiene | Post-build sanitized `.d.ts` output | Leaking source aliases or CSS side-effect imports | Published declarations must resolve outside this repository |

---

## Implementation order

For new package architecture work, follow the phases above in dependency order: first audit current package state, then align entry points, exports, Vite build behavior, package metadata, declarations, and verification evidence.

For current-maintenance work, do not blindly recreate old setup steps. Start from the existing `package.json`, `vite.config.ts`, `tsconfig.build.json`, `scripts/prepare-dist.mjs`, `scripts/verify-package-consumption.mjs`, and CI workflow pins, then change only the piece that the request requires.

Do NOT skip verification for package-facing changes: exports, build output, generated declarations, peer ranges, React major versions, and CI/package distribution policy require build and package-consumption evidence.
