# Component Child Issue Template

Use this body content when `component-child-issues` decides a new independently
reviewable reusable piece is needed. Then wrap it in the canonical GitHub issue
structure required by
`skills/github-project-tasks/references/issue-body-template.md`.

```markdown
## Child component extraction

Parent issue: #{parent_issue_number} — {parent_issue_title}
Parent URL: {parent_issue_url}
Parent approval gate: `status:approved` verified
Cataloging decision: {short_decision_summary_from_validated_adjacent_heading}
Source validated handoff: same parent issue comment/update with `## Validated component spec` immediately followed by `## Cataloging decision`
Source `## Cataloging decision` target issue: {parent_or_v1_issue_number}

### Reusable piece

- Name: {child_name}
- Proposed tier: primitive / atom / molecule / organism
- Scope rule: independently reviewable; extracted lower-tier pieces are usually primitive / atom / molecule, but organism is allowed when validated.
- Source/parent component: {parent_component_name}
- Candidate action: create new
- Reuse target or extraction reason: {why_this_piece_is_shared_or_must_be_extracted}
- Blockers/questions from cataloging decision: none

### Scope

This child issue is responsible for:

- {scope_summary_from_cataloging_decision}
- {independently_reviewable_scope_item}

Out of scope:

- Parent component integration beyond the public API needed by this child.
- Other extracted pieces tracked in sibling child issues.

### Acceptance criteria

- [ ] The reusable piece has a clear public API or internal contract.
- [ ] The implementation follows Stack-and-Flow component structure and token
      rules.
- [ ] Parent integration requirements are documented or linked.
- [ ] Accessibility impact is documented when behavior or semantics are
      affected.
- [ ] Validation plan is recorded before implementation starts.

### Parent tracking

After creating or reusing this issue, add it to the parent checklist:

- [ ] #{child_issue_number} — {child_issue_title}
```
