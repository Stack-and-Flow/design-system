---
name: auditor
description: >
  Audits the design system itself against standards for a production-ready, npm-distributable library.
  Covers: token architecture, theme structure, folder organization, package.json configuration,
  build output, peer dependencies, and design system best practices.
  Proposes concrete improvements — not just flags issues.
  Trigger: When auditing the design system as a whole — token architecture, folder structure, npm distributable standards.
  Also delegable from sdd-verify or sdd-explore for system-level validation.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- Someone asks to "audit the system", "check token architecture", "review our npm setup", or similar
- Before a major release to verify distributable quality
- When evaluating whether to add a new category of tokens or components
- Delegated from `sdd-verify` or `sdd-explore` as part of a system-level SDD change

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-verify` or `sdd-explore`:

- **Change name**: the SDD change being audited
- **Scope**: which aspect of the system to audit (tokens / structure / npm / all)
- **Artifact store mode**: `engram | openspec | hybrid | none`

When delegated: run the requested scope phases and return in the SDD return envelope format:

```markdown
## System Audit Report

**Change**: {change-name}
**Scope**: {tokens | structure | npm | all}

### Compliance Matrix
| Area | Status | Issues |
|------|--------|--------|
| Token architecture | ✅ / ⚠️ / ❌ | {count} |
| Theme structure | ✅ / ⚠️ / ❌ | {count} |
| Folder organization | ✅ / ⚠️ / ❌ | {count} |
| npm distributable config | ✅ / ⚠️ / ❌ | {count} |
| Peer dependencies | ✅ / ⚠️ / ❌ | {count} |
| Build output | ✅ / ⚠️ / ❌ | {count} |

### Proposed Improvements
{numbered list — each with: what, why, concrete example}

### Issues Found
**CRITICAL**: {list or "None"}
**MAJOR**: {list or "None"}
**MINOR**: {list or "None"}

### Verdict
{PASS / PASS WITH WARNINGS / FAIL}
```

---

## Before You Start

Always read in this order:

1. `src/styles/theme.css` — current token architecture
2. `package.json` — current npm config, exports, peerDependencies
3. `docs/DESIGN.md` — visual design intent and token categories
4. `docs/GUIDELINES.md` — current coding standards
5. `src/components/` — current folder structure (sample 3-5 components)
6. `vite.config.ts` or `tsconfig.json` — build configuration

---

## Phase 1 — Token Architecture Audit

A design system's token architecture is its CONTRACT with consumers. Tokens must be:
- **Semantic** — names express intent, not value (`color-brand-primary` not `color-red-500`)
- **Scalable** — new themes can override tokens without touching components
- **Distributable** — tokens must be consumable by external projects as CSS custom properties

### 1.1 — Token naming conventions

- [ ] All tokens use semantic names — no value-encoded names (`--color-red-500` is a primitive, not a token)
- [ ] Token categories are clearly separated: `color`, `spacing`, `typography`, `radius`, `shadow`, `gradient`, `animation`
- [ ] Dark/light mode handled via CSS selectors (`:root` / `.dark`) or `@media (prefers-color-scheme)` — not via duplicated token names
- [ ] Token names follow a consistent pattern: `--{category}-{role}-{modifier}` (e.g. `--color-surface-dark`, `--spacing-component-md`)

### 1.2 — Token completeness

- [ ] **Color tokens** cover: brand (primary, secondary), surface (base, raised, overlay), border, text (primary, secondary, muted, inverse), status (success, warning, error, info)
- [ ] **Spacing tokens** cover: component-level (padding, gap) and layout-level (section, page margin) — not mixed
- [ ] **Typography tokens** cover: font-family, font-size scale, font-weight, line-height, letter-spacing
- [ ] **Border radius tokens** cover: the full scale used in components (sm, md, lg, pill, full)
- [ ] **Shadow/glow tokens** cover: elevation levels + interactive glows
- [ ] **Animation tokens** cover: duration scale, easing curves used across components

### 1.3 — Token primitives vs. semantic tokens

Audit whether the project uses primitives correctly:

- **Primitives** (`--primitive-red-500: #ff0036`) — raw values, not used directly in components
- **Semantic tokens** (`--color-brand-primary: var(--primitive-red-500)`) — what components consume
- [ ] Components NEVER reference primitives directly — only semantic tokens
- [ ] Semantic tokens reference primitives (or are standalone if no primitive layer exists)
- [ ] If no primitive layer exists: flag as MAJOR — theming becomes impossible without it

### 1.4 — Tailwind v4 `@theme` compliance

- [ ] All tokens declared inside `@theme {}` block in the CSS file
- [ ] Token names map cleanly to Tailwind utility classes (`--color-brand-primary` → `text-brand-primary`, `bg-brand-primary`)
- [ ] No conflicts with Tailwind's built-in token namespace (e.g. avoid `--color-red-500` — conflicts with Tailwind's palette)
- [ ] `@layer base` used for global resets and font-face declarations — not inside `@theme`

---

## Phase 2 — Folder Structure Audit

A distributable design system must have a structure that supports:
- Tree-shaking (consumers import only what they use)
- Clear public API (what is exported vs. internal)
- Scalability (adding new component tiers without restructuring)

### 2.1 — Component organization

- [ ] Components organized by atomic tier: `atoms/`, `molecules/`, `organisms/`
- [ ] Each component in its own folder: `{tier}/{kebab-name}/`
- [ ] No cross-tier imports downward (organisms can import molecules/atoms; atoms cannot import molecules)
- [ ] No circular dependencies between components

### 2.2 — Public API surface

- [ ] A top-level `src/index.ts` (or `src/main.ts`) exists and re-exports the public API
- [ ] Only components intended for external consumption are re-exported from the top-level index
- [ ] Internal utilities, hooks, and helpers are NOT re-exported from the top-level index
- [ ] Types are explicitly exported — consumers must be able to import prop types

### 2.3 — Style distribution

- [ ] `theme.css` (or equivalent) is included in the build output — consumers need the CSS custom properties
- [ ] Components do NOT bundle CSS directly into JS (no CSS-in-JS that leaks into the bundle)
- [ ] Consumers are expected to import the CSS file once at the app root — this is documented

---

## Phase 3 — npm Distributable Audit

### 3.1 — `package.json` essentials

- [ ] `"name"` uses a scoped package name: `@{org}/{package}` — avoids namespace conflicts
- [ ] `"version"` follows semver strictly
- [ ] `"main"` points to the CJS build (for Node/legacy consumers)
- [ ] `"module"` points to the ESM build (for modern bundlers)
- [ ] `"types"` points to the TypeScript declaration file (`.d.ts`)
- [ ] `"exports"` field defined for modern package resolution:
  ```json
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/theme.css"
  }
  ```
- [ ] `"files"` field lists ONLY what should be in the npm package: `["dist", "README.md"]`
- [ ] `"sideEffects"` set correctly: `["**/*.css"]` if the CSS file has side effects, `false` if the JS is pure

### 3.2 — Peer dependencies

- [ ] `react` and `react-dom` are in `peerDependencies` — NOT `dependencies`
- [ ] `tailwindcss` is in `peerDependencies` if components depend on Tailwind utilities at runtime
- [ ] Version ranges in peerDependencies are permissive: `"react": ">=18.0.0"` not `"react": "19.0.0"`
- [ ] `devDependencies` contains only build/test tools — nothing a consumer needs at runtime
- [ ] `dependencies` contains ONLY runtime dependencies the consumer doesn't need to install separately (e.g. `class-variance-authority`, `clsx`)

### 3.3 — Build output

- [ ] Build produces both ESM (`.mjs`) and CJS (`.cjs`) formats
- [ ] TypeScript declarations (`.d.ts`) are generated and included in the output
- [ ] CSS custom properties file (`theme.css`) is in the build output
- [ ] Source maps included for debugging — `.js.map` files
- [ ] Build output does NOT include: test files, stories, source `.ts/.tsx` files, `node_modules`
- [ ] Tree-shaking works — each component can be imported individually without pulling in the full library

### 3.4 — README and documentation

- [ ] `README.md` exists with: installation, basic usage, peer dependency list
- [ ] CSS import instruction is explicit: `import '@stack-and-flow/design-system/styles'`
- [ ] Storybook URL referenced for component documentation
- [ ] CHANGELOG or release notes present

---

## Phase 4 — Propose Improvements

For EVERY issue found, propose a concrete improvement. Do not just flag — show the solution.

Format each proposal as:

```
## Proposal {N}: {Short title}

**Problem**: {What is wrong and why it matters for consumers}
**Impact**: {What breaks or degrades if this is not fixed}
**Proposed solution**:
{Concrete example — show the before/after}
**Effort**: Low / Medium / High
**Priority**: CRITICAL / MAJOR / MINOR
```

Examples of good proposals:

```
## Proposal 1: Add primitive token layer

Problem: Components reference semantic tokens that have no primitive backing.
This means changing the brand color requires editing every semantic token manually.

Impact: Theming is O(n) — proportional to the number of tokens. Adding a dark theme
requires duplicating the entire token set.

Proposed solution:
// Before — semantic token with hardcoded value
--color-brand-primary: #ff0036;

// After — primitive layer + semantic reference
--primitive-brand-500: #ff0036;
--color-brand-primary: var(--primitive-brand-500);

Effort: Medium
Priority: MAJOR
```

---

## Phase 5 — Summary Report

```markdown
## Design System Audit — Stack-and-Flow

**Audited on**: {date}
**Scope**: {tokens | structure | npm | all}

### Overall Health

| Area | Score | Critical | Major | Minor |
|------|-------|----------|-------|-------|
| Token architecture | {score}/10 | {N} | {N} | {N} |
| Folder structure | {score}/10 | {N} | {N} | {N} |
| npm config | {score}/10 | {N} | {N} | {N} |
| Build output | {score}/10 | {N} | {N} | {N} |

### Top Priorities

1. {Most critical issue + proposal reference}
2. {Second most critical}
3. {Third}

### Verdict
**DISTRIBUTABLE** — ready for npm publish with no blockers
**DISTRIBUTABLE WITH WARNINGS** — publishable but improvements recommended
**NOT DISTRIBUTABLE** — critical issues must be resolved before publishing
```

---

## Rules

- NEVER suggest changes that would break the public API without flagging the breaking change explicitly
- NEVER propose a different design aesthetic — this skill audits standards compliance, not visual preferences
- ALWAYS provide a concrete before/after example for every proposal
- ALWAYS check the actual `theme.css` values before flagging a token as wrong
- When delegated from SDD, use the SDD return envelope — do not return a free-form report
