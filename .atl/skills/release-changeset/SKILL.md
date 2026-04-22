---
name: release-changeset
description: >
  Manages the @changesets/cli release workflow for Stack-and-Flow Design System.
  Covers initial setup, detecting commits without changeset coverage, generating changeset files,
  and proposing the correct semver bump based on Conventional Commits.
  Trigger: When someone asks to "create a changeset", "prepare a release", "what needs a changeset",
  or "add changeset for my changes". Also delegable from sdd-archive as the final step of a change cycle.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- Someone asks "create a changeset for my changes"
- Someone asks "what commits don't have a changeset yet?"
- Someone asks "prepare the release" or "bump the version"
- Delegated from `sdd-archive` as the final step after implementation is verified

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-archive`:

- **Change name**: the SDD change that was just completed
- **Commits in scope**: list of commits included in this change
- **Affected packages**: which components/exports were modified

When delegated: run Phase 2 (detect) + Phase 3 (generate) only. Skip Phase 1 (setup) if `.changeset/` already exists.
Return SDD return envelope:

```markdown
## Changeset Generated

**Change**: {change-name}
**Bump type**: patch | minor | major
**Changeset file**: .changeset/{slug}.md
**Commits covered**: {list}
**Reasoning**: {why this bump type — based on Conventional Commits analysis}
**Next steps**: Run `pnpm changeset version` to apply + `pnpm changeset publish` to release
```

---

## Phase 1 — Setup (first time only)

Run this phase ONLY if `.changeset/` does NOT exist in the project root.

### Step 1 — Install @changesets/cli

```powershell
pnpm add -D @changesets/cli
```

### Step 2 — Initialize

```powershell
pnpm changeset init
```

This creates:
```
.changeset/
  config.json     ← configuration
  README.md       ← auto-generated, can be deleted
```

### Step 3 — Configure .changeset/config.json

Replace the generated config with this:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Key decisions:
- `"access": "public"` — required for `@stack-and-flow/design-system` scoped package
- `"commit": false` — we commit manually; no auto-commits from changeset tooling
- `"baseBranch": "main"` — matches the project's single-trunk strategy

### Step 4 — Add scripts to package.json

Add to the `scripts` section:

```json
"changeset": "changeset",
"changeset:version": "changeset version",
"changeset:publish": "changeset publish"
```

### Step 5 — Add .changeset to .gitignore exception

The `.changeset/` directory MUST be committed — it is NOT generated output.
Verify `.gitignore` does NOT exclude it. If it does, remove that line.

---

## Phase 2 — Detect uncovered commits

Find commits that introduced user-visible changes but have no corresponding changeset entry.

### What needs a changeset

A commit NEEDS a changeset if it:
- Adds a new component or feature (`feat:`)
- Fixes a bug (`fix:`)
- Makes a breaking change (any type with `BREAKING CHANGE:` in body or `!` after type)
- Updates exported types or public API

A commit does NOT need a changeset if it:
- Only changes docs (`docs:`)
- Only changes tests (`test:`)
- Only changes internal tooling/config (`chore:`)
- Only changes Storybook stories with no component logic change (`style:`)

### How to detect

```powershell
# Step 1 — get all commits since last version tag (or since beginning if no tag)
$lastTag = git describe --tags --abbrev=0 2>$null
if ($lastTag) {
  $commits = git log "$lastTag..HEAD" --oneline --no-merges
} else {
  $commits = git log --oneline --no-merges
}

# Step 2 — list existing changeset files (already written entries)
$existingChangesets = Get-ChildItem .changeset -Filter "*.md" |
  Where-Object { $_.Name -ne "README.md" } |
  ForEach-Object { Get-Content $_.FullName }

# Step 3 — display commits for manual review
$commits
```

Then analyze each `feat:` and `fix:` commit and check if the changeset directory contains a file that references the same component or change.

### Report format

```
## Uncovered Commits

The following commits introduce user-visible changes with no changeset entry:

| Commit | Type | Summary | Needs bump |
|--------|------|---------|------------|
| {sha} | feat | add Avatar component | minor |
| {sha} | fix  | button onClick when loading | patch |
| {sha} | feat | BREAKING: rename Button `text` prop to `label` | major |

Recommendation: generate {N} changeset file(s) — see Phase 3.
```

---

## Phase 3 — Generate changeset

### Bump type rules (Semver + Conventional Commits)

| Condition | Bump |
|-----------|------|
| Any commit with `BREAKING CHANGE:` in body | **major** |
| Any commit with `!` after type (e.g. `feat!:`) | **major** |
| Any `feat:` commit | **minor** |
| Only `fix:` commits | **patch** |
| Multiple types — take the highest | e.g. feat + fix = **minor** |

### Changeset file format

Changesets uses a YAML frontmatter + markdown body format:

```markdown
---
"@stack-and-flow/design-system": minor
---

Add Avatar component with `size`, `shape`, and `fallback` variants.

Supports `sm`, `md`, `lg` sizes and `circle`, `square` shapes.
Accessible: includes `alt` prop forwarded as `aria-label` when image fails.
```

Rules for the body:
- Written in **English** — changesets become the public CHANGELOG
- One or two sentences maximum per entry
- Describe WHAT changed from the consumer's perspective — not implementation details
- No internal implementation details ("refactored the hook", "moved to CVA")
- DO include: new props, removed props, behavior changes, breaking changes

### File naming

Changesets generates a random slug filename. Use the CLI to generate it:

```powershell
pnpm changeset
```

The CLI will interactively ask for bump type and summary. Use this for the canonical flow.

### Non-interactive alternative (for agent use)

Write the file directly:

```powershell
# Generate a random slug
$slug = -join ((97..122) | Get-Random -Count 8 | ForEach-Object { [char]$_ })
$filename = ".changeset/$slug.md"

$content = @"
---
"@stack-and-flow/design-system": minor
---

{Summary of changes in English, consumer perspective, 1-2 sentences.}
"@

$content | Out-File -FilePath $filename -Encoding utf8
Write-Host "Changeset written: $filename"
```

### One changeset per logical group

Do NOT create one changeset per commit. Group related changes:

```markdown
# WRONG — too granular
.changeset/abc123.md  → "fix button disabled state"
.changeset/def456.md  → "fix button aria-label"
.changeset/ghi789.md  → "fix button loading spinner"

# CORRECT — grouped by component/feature
.changeset/abc123.md  → "Fix Button disabled state, aria-label forwarding, and loading spinner visibility"
```

Exception: if changes belong to different bump types (one fix + one feat), use separate files.

---

## Phase 4 — Apply and publish (release flow)

This phase is run by the Project Lead — document it but do NOT execute it automatically.

```powershell
# 1 — Consume changeset files, bump version in package.json, update CHANGELOG.md
pnpm changeset:version

# 2 — Commit the version bump
git add .
git commit -m "chore: release v{new-version}"

# 3 — Tag the release
git tag "v{new-version}"

# 4 — Publish to npm
pnpm changeset:publish
```

**NEVER run Phase 4 automatically.** Only the Project Lead executes releases.

---

## Quick reference — commands

| Task | Command |
|------|---------|
| Initialize changesets | `pnpm changeset init` |
| Create changeset interactively | `pnpm changeset` |
| Apply changesets + bump version | `pnpm changeset:version` |
| Publish to npm | `pnpm changeset:publish` |
| List pending changesets | `ls .changeset/*.md \| Where-Object { $_.Name -ne 'README.md' }` |
| See what version would be bumped to | `pnpm changeset status` |
