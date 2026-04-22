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
- Someone asks to configure tree-shaking, peer deps, or the build output
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

## Current State (verified against actual codebase)

As of the last audit:

| Item | Status |
|------|--------|
| `package.json` has `name` | `@stack-and-flow/design-system` |
| `package.json` has `version` | `1.0.0` |
| `package.json` has `private: false` | Yes |
| `package.json` has `exports` field | **Missing** |
| `package.json` has `files` field | **Missing** |
| `package.json` has `main` / `module` fields | **Missing** |
| `package.json` has `sideEffects` field | **Missing** |
| `src/index.ts` root entry point | **Missing** |
| `vite.config.ts` has `lib` mode | **Missing** (currently configured for app/dev) |
| Per-component `index.ts` files | Exist in every component directory |
| `peerDependencies` declared | **Missing** (react, react-dom in `dependencies`) |

The project is **not yet distributable**. This skill guides the full transformation.

---

## Phase 1 — Audit current state

Before making any change, read and report the current state:

```powershell
# Check package.json fields
Get-Content package.json | ConvertFrom-Json | Select-Object name, version, private, exports, files, main, module, sideEffects

# Check if root entry exists
Test-Path src/index.ts

# Check vite config for lib mode
Select-String "lib" vite.config.ts
```

Report what exists vs what is needed. Present the full gap table before proceeding.

---

## Phase 2 — Root entry point

### Create `src/index.ts`

This is the single entry point for consumers who import the full package:
`import { Button } from '@stack-and-flow/design-system'`

```typescript
// src/index.ts — public API barrel

// Atoms
export { Button } from './components/atoms/button';
export * from './components/atoms/button/types';

export { default as Avatar } from './components/atoms/avatar';
export * from './components/atoms/avatar/types';

export { default as Badge } from './components/atoms/badge';
export * from './components/atoms/badge/types';

export { default as Divider } from './components/atoms/divider';
export * from './components/atoms/divider/types';

export { default as Dropdown } from './components/atoms/dropdown';
export * from './components/atoms/dropdown/types';

export { default as Icon } from './components/atoms/icon';

export { default as IconButton } from './components/atoms/icon-button';
export * from './components/atoms/icon-button/types';

export { default as Input } from './components/atoms/input';
export * from './components/atoms/input/types';

export { default as Modal } from './components/atoms/modal';
export * from './components/atoms/modal/types';

export { default as Skeleton } from './components/atoms/skeleton';
export * from './components/atoms/skeleton/types';

export { default as Switch } from './components/atoms/switch';
export * from './components/atoms/switch/types';

export { default as Text } from './components/atoms/text';
export * from './components/atoms/text/types';

// Molecules
export { default as Snippet } from './components/molecules/snippet';
export * from './components/molecules/snippet/types';

// Utilities
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
      "import": "./dist/atoms/divider/index.js",
      "require": "./dist/atoms/divider/index.cjs",
      "types": "./dist/atoms/divider/index.d.ts"
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
      "import": "./dist/styles/theme.css"
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

The current `vite.config.ts` is configured for **development** (app mode). It needs a separate **build** configuration for **library mode**.

### Strategy: separate config files

Do NOT modify the existing `vite.config.ts` — it is needed for Storybook and dev. Create a new file:

```
vite.config.lib.ts   ← library build only
vite.config.ts       ← dev + Storybook (unchanged)
```

### vite.config.lib.ts

```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { glob } from 'glob';

// Collect all component entry points automatically
const componentEntries = Object.fromEntries(
  glob
    .sync('src/components/{atoms,molecules}/{*}/index.ts')
    .map((file) => {
      const name = file
        .replace('src/components/atoms/', 'atoms/')
        .replace('src/components/molecules/', 'molecules/')
        .replace('/index.ts', '');
      return [name, path.resolve(__dirname, file)];
    })
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        ...componentEntries
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // Externalize everything that consumers must install themselves
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@radix-ui\/.*/,
        /^lucide-react.*/,
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'spinners-react'
      ],
      output: {
        // Preserve directory structure in output
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Separate CSS from JS
        assetFileNames: 'styles/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    // Do not minify library code — consumers' bundlers will do it
    minify: false,
    // Generate sourcemaps for debugging
    sourcemap: true
  }
});
```

### Add build script to package.json

```json
"build:lib": "vite build --config vite.config.lib.ts && tsc --emitDeclarationOnly --declaration --outDir dist"
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
    "dist/styles/theme.css",
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

The `tsc` command in the build script generates `.d.ts` files. Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "dist",
    "emitDeclarationOnly": false
  }
}
```

Or use a separate `tsconfig.build.json` that extends the base and overrides emit settings.

---

## Phase 7 — Verify the build

After configuring everything:

```powershell
# Build the library
pnpm build:lib

# Check the output structure
Get-ChildItem dist -Recurse | Select-Object FullName
```

Expected output structure:

```
dist/
  index.js              ← ESM full bundle
  index.cjs             ← CJS full bundle
  index.d.ts            ← TypeScript declarations
  atoms/
    button/
      index.js
      index.cjs
      index.d.ts
    input/
      index.js
      ...
  styles/
    theme.css           ← design tokens
```

### Smoke test the package locally

```powershell
# Pack without publishing
pnpm pack

# In a test project
pnpm add ../stack-and-flow-design-system-1.0.0.tgz
```

Then in the test project:

```typescript
// Full package import
import { Button } from '@stack-and-flow/design-system';

// Per-component import
import { Button } from '@stack-and-flow/design-system/button';

// Styles
import '@stack-and-flow/design-system/styles';
```

---

## Decision log — tradeoffs

| Decision | Chosen | Rejected | Reason |
|----------|--------|----------|--------|
| Build tool | Vite lib mode | Rollup standalone | Already in project; consistent with dev config |
| Module format | ESM + CJS | ESM only | CJS needed for Jest/older Node consumers |
| Separate config file | `vite.config.lib.ts` | Modify existing config | Existing config is used by Storybook and dev — cannot change mode |
| CSS distribution | Separate `./styles` export | Inline-in-JS | Inline CSS-in-JS would require a runtime; separate file is simpler and standard |
| `preserveModules` | true | Single bundle | Enables per-component tree-shaking at the file level |
| Radix in `dependencies` | Yes (not peerDep) | peerDep | Consumers may not have Radix; forcing them to install it is poor DX |

---

## Implementation order

Follow this sequence — each step depends on the previous:

1. **Phase 2** — create `src/index.ts` (no build changes yet, safe to do first)
2. **Phase 5** — fix `package.json` (peer deps, files, sideEffects — no build needed)
3. **Phase 4** — create `vite.config.lib.ts` (requires Phase 2 entry point to exist)
4. **Phase 3** — add `exports` map to `package.json` (requires knowing dist paths from Phase 4)
5. **Phase 6** — verify TypeScript declaration config
6. **Phase 7** — run the build and verify output

Do NOT skip steps or reorder — particularly, Phase 3 (exports map) references `dist/` paths that only exist after Phase 4 is configured and built.
