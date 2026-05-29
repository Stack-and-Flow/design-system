---
name: github-project-tasks
description: >
  Creates and audits GitHub Issues + Project board items for Stack-and-Flow following the canonical board fields and issue template.
  Trigger: create task, start work, assign issue, move to In progress, end work, close task, move to Done, add component to board, audit GitHub Project issues, delegated from sdd-tasks.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "2.0"
---

## Activation Contract

Use this skill for Stack-and-Flow GitHub issue + Project board work. It has four modes:

- **CREATE** — create issue(s), add to Project, set fields.
- **START WORK** — after the linked issue has label `status:approved`, assign the issue, move the Project item to `In progress`, and record the branch/worktree plan before implementation starts.
- **END WORK** — comment validation/PR evidence and move the Project item to `Done` only after the task is genuinely complete.
- **AUDIT** — detect malformed existing issues or board items.

When delegated from `sdd-tasks`, run CREATE for each implementation task and return the SDD task-created envelope requested by the orchestrator.

## Required Reference

Before writing an issue body, read:

- `.atl/skills/github-project-tasks/references/issue-body-template.md`

That template is the single source of truth for the issue body. Do not duplicate it in this skill.

## Project Board Reference Data

| Field | Value |
| --- | --- |
| Owner | `Stack-and-Flow` |
| Project number | `1` |
| Project node ID | `PVT_kwDOEHd14s4BUsw-` |
| Status values | `Todo`, `In progress`, `Done` |
| Team values | `Squad 1`, `Squad 2`, `Squad 3` |
| Category values | `component`, `fix`, `infra`, `a11y`, `docs`, `tokens` |

Field IDs:

| Field | ID |
| --- | --- |
| Status | `PVTSSF_lADOEHd14s4BUsw-zhCIcdo` |
| Team | `PVTSSF_lADOEHd14s4BUsw-zhCIcqA` |
| Category | `PVTSSF_lADOEHd14s4BUsw-zhDyHaQ` |

Option IDs:

| Field | Value | Option ID |
| --- | --- | --- |
| Category | `component` | `c68ff6ff` |
| Category | `fix` | `90c78b01` |
| Category | `infra` | `78447643` |
| Category | `a11y` | `d8f02829` |
| Category | `docs` | `30905538` |
| Category | `tokens` | `33054117` |
| Status | `Todo` | `f75ad846` |
| Status | `In progress` | `47fc9ee4` |
| Status | `Done` | `98236657` |
| Team | `Squad 1` | `9282166a` |
| Team | `Squad 2` | `8a5d08e5` |
| Team | `Squad 3` | `478d0b17` |

## Hard Rules

- Never use emojis in issue body markdown; Windows/PowerShell + `gh` can corrupt them.
- Avoid accent marks in section headings; body text may use accents.
- Always write multi-line issue bodies to a temp file and pass `--body-file`.
- Confirm task name, tier/type, reference URL when applicable, assignee, team, and category before CREATE.
- Before implementation starts from a GitHub issue, require the exact issue label `status:approved`, then run START WORK: assign the issue to the contributor/user and move the Project item to `In progress`.
- Before marking a task done, run END WORK: add validation/PR evidence and move the Project item to `Done` only when merged or explicitly approved by the maintainer/user.
- Do not invent a missing reference URL; ask or research.

## Issue Titles

```text
[ATOMS] ComponentName
[MOLECULES] ComponentName
[ORGANISMS] ComponentName
[FIX] description-of-bug
[UPDATE] description-of-change
[ADD] description-of-addition
[INFRA] description-of-infra-task
[DOCS] description-of-docs-task
```

## Mode 1 — CREATE

1. Read the issue body template reference.
2. Fill placeholders into a temp file.
3. Create issue:

```powershell
$issueUrl = gh issue create `
  --repo Stack-and-Flow/design-system `
  --title "[ATOMS] {ComponentName}" `
  --body-file "$env:TEMP\issue-body.md"
```

4. Add issue to board:

```powershell
$itemId = gh project item-add 1 `
  --owner Stack-and-Flow `
  --url $issueUrl `
  --format json | ConvertFrom-Json | Select-Object -ExpandProperty id
```

5. Set Status, Team, and Category with `gh project item-edit` using the field/option IDs above.
6. Report issue number, URL, board item ID, and fields set.

## Mode 2 — START WORK

Run this before implementation starts from an existing GitHub issue or board card, after the linked issue has label `status:approved`. Offline/no-network mode may skip GitHub mutations only after approval evidence confirms the label is present; it does not permit implementation without `status:approved`.

Inputs required:

1. Issue URL or issue number.
2. Evidence that the linked issue has label `status:approved`.
3. GitHub username of the contributor/user doing the work.
4. Planned branch name.
5. Planned worktree path when a worktree will be used.

Steps:

1. Confirm the issue is the right task and the contributor/user is correct.
2. Verify the exact issue label `status:approved` is present. If it is missing, stop; do not move the Project item to `In progress`.

```powershell
$approvalLabel = gh issue view {issue_number} `
  --repo Stack-and-Flow/design-system `
  --json labels `
  --jq '.labels[].name' | Select-String -SimpleMatch 'status:approved'
```

If `$approvalLabel` is empty, the approval gate is not satisfied. Stop; implementation must not start under any circumstance.

3. Assign the issue:

```powershell
gh issue edit {issue_number} `
  --repo Stack-and-Flow/design-system `
  --add-assignee {username}
```

4. Ensure the issue is on Project `1`. If not, add it with `gh project item-add`.
5. Resolve the Project item ID for existing cards:

```powershell
$issueUrl = "https://github.com/Stack-and-Flow/design-system/issues/{issue_number}"
$itemId = gh project item-list 1 `
  --owner Stack-and-Flow `
  --format json `
  --limit 200 `
  --jq ".items[] | select(.content.url == \"$issueUrl\") | .id"
```

If `$itemId` is empty after adding/checking the Project item, stop and report the blocker.

6. Move Project Status to `In progress`:

```powershell
gh project item-edit `
  --project-id PVT_kwDOEHd14s4BUsw- `
  --id $itemId `
  --field-id PVTSSF_lADOEHd14s4BUsw-zhCIcdo `
  --single-select-option-id 47fc9ee4
```

7. Confirm Team and Category are set. If missing, set them using the option IDs above.
8. Report the work-start state:

```markdown
## Work Started

**Issue**: #{number} — {title}
**Assignee**: @{username}
**Approval gate**: issue label `status:approved` verified
**Project status**: In progress
**Team**: {team}
**Category**: {category}
**Branch**: `{branch}`
**Worktree**: `{path or "not used"}`
```

Do not start implementation if the `status:approved` label is missing or unverified. Do not start implementation if assignment, item lookup, or `In progress` status fails, unless the user explicitly asks to continue offline/no-network after the approval label has been verified.

## Branch and Worktree Naming

Use this convention when START WORK records or creates a branch/worktree:

```text
branch:   {type}/{issue-number}-{slug}
worktree: ../design-system-{type}-{issue-number}-{slug}
```

Examples:

```text
feat/123-button
fix/128-modal-focus-trap
docs/142-contributor-flow
../design-system-feat-123-button
```

Choose `{type}` from the Conventional Commit type that best matches the task (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, etc.). Build `{slug}` from the issue title without the `[ATOMS]` / `[FIX]` prefix, lowercased and dash-separated.

If the user provides a different branch name, keep it only when it still follows Conventional Commit branch prefixes or the user explicitly approves the exception.

## Mode 3 — END WORK

Run this when implementation is verified and the task is ready to close. Move the Project item to `Done` only after the PR is merged or the maintainer/user explicitly says the task should be closed.

Inputs required:

1. Issue URL or issue number.
2. Merged PR URL, or an explicit maintainer/user closure approval when there is no PR.
3. Validation evidence: tests/build/storybook/manual checks run.
4. Known follow-up issues, if any.

Steps:

1. Verify closure eligibility before any mutation:
   - If using a PR, confirm it is merged with `gh pr view {pr_url_or_number} --repo Stack-and-Flow/design-system --json mergedAt,url` and require `mergedAt` to be non-null.
   - If there is no PR, require explicit maintainer/user approval in the current task context and record that approval in the completion comment.
2. Resolve the Project item ID using the START WORK item lookup pattern.
3. Write a concise completion comment to the issue:

```powershell
$body = @'
## Work completed

Validation:
- {command}: {result}
- {manual check}: {result}

Landing evidence: {merged_pr_url_or_explicit_approval}
Follow-up: {follow_up_or_none}
'@
$body | Out-File -FilePath "$env:TEMP\work-completed.md" -Encoding utf8

gh issue comment {issue_number} `
  --repo Stack-and-Flow/design-system `
  --body-file "$env:TEMP\work-completed.md"
```

4. Move Project Status to `Done`:

```powershell
gh project item-edit `
  --project-id PVT_kwDOEHd14s4BUsw- `
  --id $itemId `
  --field-id PVTSSF_lADOEHd14s4BUsw-zhCIcdo `
  --single-select-option-id 98236657
```

4. Return:

```markdown
## Work Ended

**Issue**: #{number} — {title}
**Project status**: Done
**Landing evidence**: {merged PR URL or explicit approval}
**Validation**: {summary}
**Follow-up**: {list or "None"}
```

If the PR is not merged, closure approval is missing, validation evidence is missing, or the user requests offline/no-network work, return `## Work End Skipped` with the required follow-up instead of mutating GitHub.

## Mode 4 — AUDIT

Fetch board items:

```powershell
gh project item-list 1 `
  --owner Stack-and-Flow `
  --format json | ConvertFrom-Json | Select-Object -ExpandProperty items
```

Check each item:

| Check | Pass condition |
| --- | --- |
| Title format | Starts with an approved prefix. |
| Body not empty | `content.body` is not empty/null. |
| Has workflow checklist | Body contains `### Current workflow` and START WORK / END WORK checklist items. |
| No emoji corruption | Body does not contain `���`. |
| Has reference section | Body contains `### Reference`. |
| Has spec or plan section | Body contains `### Specification or plan`. |
| Has accessibility impact section | Body contains `### Accessibility impact`. |
| Has validation plan | Body contains `### Validation plan`. |
| Has work start section | Body contains `### Work start state`. |
| Has PR/completion section | Body contains `### PR and completion evidence`. |
| Has notes section | Body contains `### Notes`. |
| Has resources section | Body contains `### Resources`. |
| Board fields set | status, team, category are present. |
| In progress has assignee | Items in `In progress` have at least one assignee. |
| Assigned Todo is intentional | Assigned issues still in `Todo` are flagged for confirmation. |
| Done has closure evidence | Items in `Done` have a merged PR link or explicit maintainer/user closure note plus validation evidence. |

Auto-fix only board fields and obvious title prefix/casing. Ask before rewriting bodies, missing references, missing assignees, or corrupted content.

## Output Contract

For CREATE or AUDIT:

```markdown
## GitHub Project Tasks Result

**Mode**: CREATE / AUDIT
**Issues touched**: {list}
**Board fields set**: {status/team/category or "n/a"}
**Violations**: {list or "None"}
**Needs human input**: {list or "None"}
```

For START WORK, return the `## Work Started` report shown in Mode 2, or:

```markdown
## Work Start Skipped

**Issue**: #{number} — {title}
**Reason**: offline/no-network requested or GitHub mutation failed after `status:approved` was verified
**Approval gate**: issue label `status:approved` verified; if not verified, implementation remains blocked
**Required follow-up**: assign issue, move Project status to `In progress`, confirm team/category
**Branch**: `{branch}`
**Worktree**: `{path or "not used"}`
```

For END WORK, return the `## Work Ended` report shown in Mode 3, or:

```markdown
## Work End Skipped

**Issue**: #{number} — {title}
**Reason**: offline/no-network requested, PR not merged, missing explicit closure approval, missing validation evidence, or GitHub mutation failed
**Required follow-up**: comment validation and merged PR/approval evidence, then move Project status to `Done` when approved
**Landing evidence**: {merged PR URL, explicit approval, or "missing"}
**Validation**: {summary or "missing"}
```
