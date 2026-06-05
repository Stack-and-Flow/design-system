---
name: pr-reviewer
description: >
  Runs the final Stack-and-Flow PR readiness gate: CI evidence, linked issue, title/template hygiene, component audit evidence, visual/MCP cleanup, and clean review scope.
  Trigger: ready for review, review my PR, check PR before submit, delegated from sdd-verify.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "2.0"
---

## Activation Contract

Use this skill immediately before requesting human review or opening/submitting a PR. This is a **PR gate**, not the owner of component implementation rules.

Package verification checks in this skill are conditional. Apply them only when the diff touches package output, exports, generated declarations, peer ranges, React major versions, or CI/package distribution behavior. Do not turn routine component PRs into package architecture reviews.

For component-quality details, load:

- `.atl/skills/_shared/component-contract.md`
- `.atl/skills/components-auditor/SKILL.md`
- `.atl/skills/component-contributor/references/stories.md`
- `.atl/skills/visual-review/SKILL.md`

## When Delegated by SDD Orchestrator

If delegated from `sdd-verify`, return the SDD PR review envelope requested by the parent, including verdict, blockers, approval criteria, issues, and recommendation.

## Automatic Rejection Check

Run first. If any check fails, return **REJECTED** and do not continue to optional polish.

| Check | How to verify |
| --- | --- |
| CI/build/test evidence missing or failing | Inspect CI output or run the agreed local commands. |
| Package compatibility evidence missing for package-facing changes | When the diff changes package output, exports, generated declarations, peer ranges, CI/package distribution policy, or a React major version, require `pnpm run build` and `pnpm run verify:package` evidence. Tests/Storybook alone are insufficient for React major upgrades. |
| No linked issue | PR description must contain `Closes #NNN` unless maintainer explicitly waives it. |
| Linked issue assigned to someone else without permission evidence | Fetch linked issue assignees; if any assignee is not the contributor/user, require explicit reassignment/takeover permission before review proceeds. |
| Invalid PR title | Conventional Commit format: `<type>(<optional scope>): <description>`. |
| PR template incomplete | No required placeholder sections left empty. |
| Paired docs language split broken | For root/docs `*.md` + `*.en.md` pairs, base `*.md` must remain Spanish and matching `*.en.md` must remain English unless maintainers explicitly approve a language migration. |
| Branch/diff scope unclear | Diff contains unrelated work without an explicit explanation. |
| Component audit missing for component changes | Run or cite `components-auditor`; CRITICAL/MAJOR findings block PR. |
| Storybook conventions contradicted | Use `component-contributor/references/stories.md` as source of truth; reject drift such as `parameters.docs.description.component`. |
| Forbidden TS patterns in changed source | No `interface`, explicit `any`, naked non-null assertion, or unexplained TS suppression in changed `.ts`/`.tsx`. |
| Container/presentational split broken | Component `.tsx` contains logic/state/CVA that belongs in the hook or `types.ts`. |
| Story `play` functions present | Interaction tests belong in `.test.tsx`. |
| MCP runtime artifacts present | Run `rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output`, then `git status --short --untracked-files=all`; reject if any MCP artifact remains. |

## Detailed PR Checklist

Run after automatic rejection checks pass.

### 1 — Review scope

- [ ] Diff is focused and reviewable.
- [ ] Generated/build/runtime artifacts are absent.
- [ ] Review workload is reasonable; if over 400 changed lines, use chained PR strategy or record maintainer exception.
- [ ] Public API changes are intentional and documented.
- [ ] Paired docs keep the repository language split: Spanish in base `*.md`, English in matching `*.en.md`.

### 2 — Component quality evidence

For component changes:

- [ ] `components-auditor` result is PASS or accepted PASS WITH WARNINGS.
- [ ] Shared component contract was applied.
- [ ] Storybook reference was applied.
- [ ] Visual-review result is included when visuals changed.
- [ ] Tests cover the changed behavior.

Do not duplicate the component checklist here; cite the audit evidence and only report PR-blocking gaps.

### 3 — Validation evidence

- [ ] TypeScript check passed or failure is explained.
- [ ] Relevant unit tests passed.
- [ ] Build passed when package/config/source exports changed.
- [ ] `pnpm run verify:package` evidence is included when package output, exports, generated declarations, peer compatibility, CI package policy, or React major versions changed.
- [ ] Generated declarations are publish-safe when declaration/package output changed: no leaked internal aliases or CSS side-effect imports.
- [ ] Storybook build or manual visual evidence is included when stories/visuals changed.
- [ ] Accessibility evidence is included for interactive components.

### 4 — Git hygiene

- [ ] Linked issue assignee gate passed before branch/work started, or explicit permission to reassign/take over is documented.
- [ ] Branch name follows issue-derived project convention when applicable: `{type}/{issue-number}-{slug}` (for example `feat/123-button`) or has an approved exception.
- [ ] Commit messages and PR title follow Conventional Commit format.
- [ ] Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
- [ ] Domain terms such as `a11y`, `tokens`, or `infra` are scopes, not custom types.
- [ ] Branch is up to date with `main` or divergence is explained.
- [ ] Playwright MCP artifacts have been forcibly removed before commit/review.
- [ ] If closing a GitHub issue/board task after merge or maintainer approval, `github-project-tasks` END WORK has validation/PR evidence ready.

## Severity Classification

| Severity | Meaning |
| --- | --- |
| **BLOCKER** | PR cannot be submitted. |
| **CRITICAL** | Must fix before review. |
| **MAJOR** | Likely reviewer rejection; fix or get explicit acceptance. |
| **MINOR** | Recommended fix. |
| **SUGGESTION** | Optional improvement. |

## Report Format

```markdown
## PR Review — {scope or PR title}

**Verdict**: APPROVED / NEEDS WORK / REJECTED

### Blockers
- [BLOCKER] {criterion} — {evidence}

### Issues to fix before review
- [CRITICAL|MAJOR] `file:line` — {problem} — Fix: {what to do}

### Evidence checked
- Linked issue assignee gate: {pass/fail/not applicable}
- Component audit: {pass/fail/not applicable}
- Visual review: {pass/fail/not applicable}
- Typecheck/tests/build/storybook: {results}
- MCP cleanup: {pass/fail}

### Recommendation
{Ready for human review / Request changes / Reject — reason}
```

If there are no blockers and no critical/major issues, return `APPROVED ✅`.
