# GitHub Issue Body Template

Canonical Stack-and-Flow issue body for automated issue creation. Keep headings ASCII-only because `gh` CLI output can corrupt emoji or multibyte section markers in Windows PowerShell.

```markdown
## Task: {TaskName}

### Category

{category}

### Team

{team}

### Reference

{reference_url_or_not_applicable}

### Scope

This task is responsible for:

- ...

Out of scope:

- ...

### Current workflow

- [ ] Issue triaged with Team and Category fields set on the Project board.
- [ ] Specification or plan recorded in this issue when behavior, API, accessibility, or tokens are affected.
- [ ] START WORK completed before implementation: assignee set, Project status moved to `In progress`, branch/worktree recorded.
- [ ] Implementation completed inside the approved scope.
- [ ] Validation evidence recorded in the PR or issue.
- [ ] PR opened and linked with `Closes #NNN`.
- [ ] PR merged or maintainer explicitly approved closure.
- [ ] END WORK completed: completion evidence added and Project status moved to `Done`.

### Specification or plan

For component work, paste or link the approved `## Validated component spec` from `component-spec-proposer` before implementation starts.

For non-component work, record:

- Expected behavior/change:
- Public API or consumer impact:
- Accessibility impact:
- Compatibility or migration notes:
- Non-goals:

### Accessibility impact

- Pattern or standard: native / Radix / WAI-ARIA APG / WCAG / not applicable
- Keyboard impact:
- Screen reader impact:
- Focus impact:
- Contrast or reduced-motion impact:
- Required accessibility validation:

### Validation plan

- TypeScript:
- Unit tests:
- Build/package:
- Storybook or visual check:
- Accessibility check:
- Security/dependency check:

### Work start state

Filled during START WORK:

- Assignee:
- Branch:
- Worktree:
- Project item ID:
- Project status: In progress

### PR and completion evidence

Filled during PR review or END WORK:

- PR:
- Validation evidence:
- Component audit:
- Visual review:
- Follow-up issues:
- Closure basis: merged PR / explicit maintainer approval

### Notes

Add decisions, tradeoffs, constraints, or maintainer guidance here.

### Resources

Add related links, Figma references, docs, logs, screenshots, or prior art here.
```

## Rules

- Do not add emoji to section headings.
- Avoid accent marks in headings; body text may use accents.
- Replace `{TaskName}`, `{category}`, `{team}`, and `{reference_url_or_not_applicable}` before creating the issue.
- Write this body to a temp file and pass it with `--body-file`; do not pass multi-line markdown directly through `--body`.
