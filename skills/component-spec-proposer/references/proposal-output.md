# Component spec proposer output

Use these output shapes for `component-spec-proposer`.

## Before approval

Present proposals under `## Component Spec Proposal: {ComponentName}`. Do not use the final-only `## Validated component spec` or `## Cataloging decision` headings before human approval.

When cataloging validation passes with no blockers/questions, insert the validator output as-is. It already includes the `## Draft cataloging decision` heading.

```markdown
## Component Spec Proposal: {ComponentName}

{spec body from references/spec-template.md, omitting the final-only `## Validated component spec` heading before approval}

## Assumptions to validate

- ...

{validated output from component-spec-cataloging-validator inserted as-is}

## Ready for validation

Reply with approve to validate both the proposed spec and draft cataloging decision, or list changes.
```

When cataloging validation has blockers/questions, insert the validator output as-is. It already includes the `## Cataloging blockers/questions` heading.

```markdown
## Component Spec Proposal: {ComponentName}

{spec body from references/spec-template.md, omitting the final-only `## Validated component spec` heading before approval}

## Assumptions to validate

- ...

{blockers/questions output from component-spec-cataloging-validator inserted as-is}
```

Do not show `## Ready for validation` until cataloging blockers/questions are resolved.

## After approval and GitHub update

```markdown
## Spec Ready

**Issue**: #{number} {title}
**Spec**: Added to issue as `Validated component spec` with validated `## Cataloging decision`
**Project setup**: {team/category present or missing setup}
**Approval gate**: Waiting for issue label `status:approved`
**Next**: After the issue has label `status:approved` and is unassigned or assigned to the contributor/user, run START WORK via `github-project-tasks`, then run `component-contributor` for implementation.
```
