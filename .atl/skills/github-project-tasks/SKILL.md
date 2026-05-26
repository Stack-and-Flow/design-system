---
name: github-project-tasks
description: >
  Creates and audits GitHub Issues + Project board items for Stack-and-Flow following the canonical format.
  Covers two modes: CREATE (new issue + board card) and AUDIT (detect malformed existing issues).
  Trigger: When someone asks to create a task, add a component to the board, or fix/review existing issues.
  Also delegable from sdd-tasks when breaking down a change into board-tracked tasks.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- Someone says "create a task for X", "add Y to the board", "open an issue for Z"
- Someone says "review the board tasks", "fix the issue format", "audit existing issues"
- Delegated from `sdd-tasks` to create board cards for each implementation task

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-tasks`:

- **Change name**: the SDD change being broken down
- **Tasks list**: the task breakdown to create as board items
- **Category**: the board category to assign (`component` | `fix` | `infra` | `a11y` | `docs` | `tokens`)

When delegated: run CREATE mode for each task, return SDD return envelope:

```markdown
## Tasks Created

**Change**: {change-name}
**Issues created**: {list: title | url | board item id}
**Fields set**: status | team | category | milestone
**Issues skipped**: {list or "None" — with reason}
**Status**: {N} tasks created. Ready for implementation.
```

---

## Project Board — Reference Data

| Field | Type | Values |
|-------|------|--------|
| Project ID | — | `1` (owner: `Stack-and-Flow`) |
| Project node ID | — | `PVT_kwDOEHd14s4BUsw-` |
| Status | Single select | `Todo` · `In progress` · `Done` |
| Team | Single select | `Squad 1` · `Squad 2` · `Squad 3` |
| Category | Single select | `component` · `fix` · `infra` · `a11y` · `docs` · `tokens` |
| Milestone | Field | e.g. `Core` |

**Field IDs** (required for `gh project item-edit`):

| Field | ID |
|-------|----|
| Status | `PVTSSF_lADOEHd14s4BUsw-zhCIcdo` |
| Team | `PVTSSF_lADOEHd14s4BUsw-zhCIcqA` |
| Category | `PVTSSF_lADOEHd14s4BUsw-zhDyHaQ` |

**Category option IDs:**

| Category | Option ID |
|----------|-----------|
| `component` | `c68ff6ff` |
| `fix` | `90c78b01` |
| `infra` | `78447643` |
| `a11y` | `d8f02829` |
| `docs` | `30905538` |
| `tokens` | `33054117` |

**Status option IDs:**

| Status | Option ID |
|--------|-----------|
| `Todo` | `f75ad846` |
| `In progress` | `47fc9ee4` |
| `Done` | `98236657` |

**Team option IDs:**

| Team | Option ID |
|------|-----------|
| `Squad 1` | `9282166a` |
| `Squad 2` | `8a5d08e5` |
| `Squad 3` | `478d0b17` |

---

## CRITICAL: Emoji encoding warning

**NEVER use emojis in issue body markdown.**

The `gh` CLI serializes issue bodies as JSON. When PowerShell (Windows) reads JSON with multi-byte emoji characters, they corrupt to `���`. This affects every section header that uses emoji.

**Rule**: Use plain ASCII text for ALL section headers and labels in issue bodies.

```markdown
# WRONG — will corrupt on Windows gh CLI output
## 🎯 Tarea: Button

### 📝 Notas adicionales

### 🔗 Recursos relacionados

# CORRECT — safe in all environments
## Tarea: Button

### Notas adicionales

### Recursos relacionados
```

---

## Issue body — canonical format

This is the EXACT format used across all existing issues. Do NOT deviate.

```markdown
## Tarea: {ComponentName}

### Referencia:

{reference_url}

### Fases del desarrollo

- [ ] 1. **Research de funcionalidad**
  Investigar soluciones similares, patrones existentes y necesidades reales. Añadir capturas, enlaces o benchmarks si aplican.

- [ ] 2. **Definicion de funcionalidades**
  Especificar que debe hacer el componente: props, estados, interaccion, accesibilidad, variantes, etc.

- [ ] 3. **Implementacion del componente**
  Desarrollo del componente en base a la definicion anterior. Incluir historias de Storybook si procede.

- [ ] 4. **Documentacion del componente**
  - [ ] Storybook documentado con controles y ejemplos de uso
  - [ ] MDX o comentarios en JSDoc si aplica
  - [ ] Seccion de casos de uso o guidelines

- [ ] 5. **Code review y modificaciones**
  - [ ] Revision funcional
  - [ ] Revision visual (alineamiento con el design system)
  - [ ] Correccion de errores o ajustes sugeridos

- [ ] 6. **Merge en main**
  Una vez aprobado, mergear la rama a `main` siguiendo el flujo de PR establecido. (Esta parte me encargo yo)

---

### Notas adicionales

_Anotar cualquier comentario, decision tomada o consideraciones especiales. (Nombra a egdev6 para cualquier consulta)_

---

### Recursos relacionados

_Nombrar cualquier recurso externo_
```

**Accent marks**: avoid them in section headings to prevent encoding issues with `gh` CLI. Body text (descriptions, placeholder copy) is fine with accents.

---

## Issue title — canonical format

```
[ATOMS] ComponentName
[MOLECULES] ComponentName
[ORGANISMS] ComponentName
[FIX] description-of-bug
[UPDATE] description-of-change
[ADD] description-of-addition
[INFRA] description-of-infra-task
[DOCS] description-of-docs-task
```

---

## Mode 1: CREATE

### Step 1 — Gather information

Before running any command, confirm:
1. Component/task name
2. Atomic tier (`atoms` / `molecules` / `organisms`) or task type (`fix` / `infra` / `docs` / `tokens`)
3. Reference URL (HeroUI, Radix, MDN, etc.) — if applicable
4. Assignee GitHub username — if known
5. Team (`Squad 1` / `Squad 2` / `Squad 3`) — default: `Squad 1`
6. Category — infer from tier/type if not provided

### Step 2 — Write the body to a temp file

ALWAYS write the body to a temp file first. Never pass multi-line markdown directly via `--body` flag — it breaks on Windows PowerShell.

```powershell
# Write body to temp file
$body = @'
## Tarea: {ComponentName}

### Referencia:

{reference_url}

### Fases del desarrollo

- [ ] 1. **Research de funcionalidad**
  Investigar soluciones similares, patrones existentes y necesidades reales. Añadir capturas, enlaces o benchmarks si aplican.

- [ ] 2. **Definicion de funcionalidades**
  Especificar que debe hacer el componente: props, estados, interaccion, accesibilidad, variantes, etc.

- [ ] 3. **Implementacion del componente**
  Desarrollo del componente en base a la definicion anterior. Incluir historias de Storybook si procede.

- [ ] 4. **Documentacion del componente**
  - [ ] Storybook documentado con controles y ejemplos de uso
  - [ ] MDX o comentarios en JSDoc si aplica
  - [ ] Seccion de casos de uso o guidelines

- [ ] 5. **Code review y modificaciones**
  - [ ] Revision funcional
  - [ ] Revision visual (alineamiento con el design system)
  - [ ] Correccion de errores o ajustes sugeridos

- [ ] 6. **Merge en main**
  Una vez aprobado, mergear la rama a `main` siguiendo el flujo de PR establecido. (Esta parte me encargo yo)

---

### Notas adicionales

_Anotar cualquier comentario, decision tomada o consideraciones especiales. (Nombra a egdev6 para cualquier consulta)_

---

### Recursos relacionados

_Nombrar cualquier recurso externo_
'@
$body | Out-File -FilePath "$env:TEMP\issue-body.md" -Encoding utf8
```

### Step 3 — Create the issue

```powershell
$issue = gh issue create `
  --repo Stack-and-Flow/design-system `
  --title "[ATOMS] {ComponentName}" `
  --body-file "$env:TEMP\issue-body.md" `
  --assignee "{username}" `
  | ConvertFrom-Json
# Note: gh issue create returns the URL as plain text, not JSON
# Capture with: $issueUrl = gh issue create --title ... --body-file ...
```

Simpler form:

```powershell
$issueUrl = gh issue create `
  --repo Stack-and-Flow/design-system `
  --title "[ATOMS] {ComponentName}" `
  --body-file "$env:TEMP\issue-body.md"

Write-Host "Created: $issueUrl"
```

### Step 4 — Add to project board

```powershell
# Get the issue number from the URL
$issueNumber = ($issueUrl -split '/')[-1]

# Add to project — returns item ID
$itemId = gh project item-add 1 `
  --owner Stack-and-Flow `
  --url $issueUrl `
  --format json | ConvertFrom-Json | Select-Object -ExpandProperty id

Write-Host "Board item ID: $itemId"
```

### Step 5 — Set board fields

```powershell
# Set Status = Todo
gh project item-edit `
  --project-id PVT_kwDOEHd14s4BUsw- `
  --id $itemId `
  --field-id PVTSSF_lADOEHd14s4BUsw-zhCIcdo `
  --single-select-option-id f75ad846

# Set Team = Squad 1
gh project item-edit `
  --project-id PVT_kwDOEHd14s4BUsw- `
  --id $itemId `
  --field-id PVTSSF_lADOEHd14s4BUsw-zhCIcqA `
  --single-select-option-id 9282166a

# Set Category = component
gh project item-edit `
  --project-id PVT_kwDOEHd14s4BUsw- `
  --id $itemId `
  --field-id PVTSSF_lADOEHd14s4BUsw-zhDyHaQ `
  --single-select-option-id c68ff6ff
```

### Step 6 — Confirm and report

After all steps complete, output:

```
Issue created: #{number} — {title}
URL: {url}
Board item ID: {itemId}
Fields: Status=Todo | Team=Squad 1 | Category=component
```

---

## Mode 2: AUDIT

Scan existing issues for format violations.

### What to check

For each issue in the project board:

| Check | Pass condition |
|-------|---------------|
| Title format | Starts with `[ATOMS]`, `[MOLECULES]`, `[ORGANISMS]`, `[FIX]`, `[UPDATE]`, `[ADD]`, `[INFRA]`, or `[DOCS]` |
| Body not empty | `content.body` is not `""` or `null` |
| Has 6 phases | Body contains the 6 checkbox phases |
| No emoji corruption | Body does NOT contain `���` |
| Has reference section | Body contains `### Referencia` or `### Referencia:` |
| Has notes section | Body contains `### Notas adicionales` |
| Board fields set | `status`, `team`, `category` are not null/empty |

### Fetch all items for audit

```powershell
gh project item-list 1 `
  --owner Stack-and-Flow `
  --format json | ConvertFrom-Json | Select-Object -ExpandProperty items
```

### Report format

```
## Issue Audit Report

**Total issues**: {N}
**Issues with violations**: {N}

### Violations found

| Issue | Violation | Severity |
|-------|-----------|----------|
| #{number} {title} | {what is wrong} | BLOCKER / WARN |

### Issues to fix

#### #{number} — {title}
- Problem: {exact violation}
- Fix: {what command or manual edit is needed}
```

**Severity**:
- **BLOCKER** — empty body, missing phases, emoji corruption in headers
- **WARN** — missing board field, non-standard title format, missing reference URL

### Auto-fix eligibility

The agent CAN auto-fix:
- Board fields not set (Status, Team, Category) — via `gh project item-edit`
- Title prefix missing or wrong casing — via `gh issue edit --title`

The agent CANNOT auto-fix without human review:
- Empty body — content must be provided by a human
- Missing reference URL — requires research
- Corrupted emoji in body — requires rewriting the body content
