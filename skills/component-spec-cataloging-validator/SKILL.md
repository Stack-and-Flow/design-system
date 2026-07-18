---
name: component-spec-cataloging-validator
description: "Trigger: component spec cataloging validation, validate component proposal tier, reuse or extraction audit. Validate a proposed component spec against the catalog tier system before approval."
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## Activation Contract

Use this skill after `component-spec-proposer` drafts a proposal and before the proposal is accepted as `## Validated component spec` or the issue receives `status:approved`.

Do not implement, approve, label, or create GitHub issues. Your job is to audit whether the proposed component should reuse existing pieces, stay in the parent issue, split/extract reusable pieces, produce child issue candidates, or defer to V1 inventory.

## Hard Rules

- Read the proposed spec and the source issue/comment/context that produced it.
- Read `docs/COMPONENT-CATALOGING.md` or `docs/COMPONENT-CATALOGING.en.md`; it is the tier authority.
- Inspect `src/components/{primitives,atoms,molecules,organisms}/` enough to detect existing reusable pieces, overlap, and naming/API conflicts; if a tier directory is missing, record that as evidence instead of assuming support exists.
- Stop if anatomy, API, states, accessibility, or intended composition are too vague to reason about tiers or reuse.
- Do not create GitHub issues. If child issues are needed, include complete candidate rows for later `component-child-issues` execution, but keep pre-approval output under a draft heading.
- Before human approval, use `## Draft cataloging decision` when validation passes or `## Cataloging blockers/questions` when it cannot complete. Do not emit the final `## Cataloging decision` heading before approval.
- The exact `## Cataloging decision` heading is reserved for the approved issue comment/update immediately after `## Validated component spec`.
- When child issue candidates are `yes`, include the per-candidate handoff fields required by `component-child-issues` and leave every candidate's blockers/questions as `none` before final approval.
- Do not add `status:approved` or claim implementation readiness.

## Decision Gates

| Finding | Action |
| --- | --- |
| Existing component already satisfies the need | Decide `reuse existing`; name the component and required adaptation. |
| Proposal is one cohesive parent-scope component | Decide `keep in parent`; document why no child is needed. |
| Proposal hides reusable pieces | Decide `split/extract`; list the pieces that must be conceptually divided, extracted, or reused. Extracted lower-tier pieces are usually primitives, atoms, or molecules; organism candidates are allowed when independently reviewable. |
| Extracted piece is independently reviewable and should be tracked separately | Use `needs child issue` as the decision, mark `child issue candidates: yes`, add a complete row in `### Child issue candidates`, and target #224 for primitives/atoms or #225 for molecules/organisms. |
| Evidence is incomplete or catalog status is uncertain | Decide `defer to V1 inventory`; target #223 and list missing evidence. |
| Public exports/docs/story migration is the main work | Target #226; reserve #227 for final verification follow-up. |

## Execution Steps

1. Read the proposed spec, source issue/comment, and assumptions from `component-spec-proposer`.
2. Load the cataloging guide and classify the proposed anatomy against tier contracts and atom disqualifiers.
3. Inspect current component folders and public APIs for reuse, overlap, or extraction opportunities.
4. Compare proposed tier, proposed path, and actual reusable pieces; call out mismatches.
5. Choose one decision: `reuse existing`, `keep in parent`, `split/extract`, `needs child issue`, or `defer to V1 inventory`.
6. Treat `split/extract` as conceptual scope division; treat `needs child issue` as a separately trackable extracted/reused unit that is independently reviewable.
7. Produce the output block below and hand it to the user for approval before any validated spec or status label is added.
8. If a candidate cannot be classified with a name, tier, source, action, reason, scope, target issue, and blockers/questions status, leave it under `## Cataloging blockers/questions` instead of a vague child candidate.

## Output Contract

When validation passes with no unresolved blockers/questions, return a paste-ready draft block with this exact heading:

```markdown
## Draft cataloging decision

- Component:
- Proposed tier: primitive | atom | molecule | organism
- Current/proposed path:
- Decision: reuse existing | keep in parent | split/extract | needs child issue | defer to V1 inventory
- Existing pieces to reuse:
- Pieces to extract/create:
- Child issue candidates: yes | no
- Target issue: parent | #223 | #224 | #225 | #226 | #227
- Blockers/questions: none

### Child issue candidates

If `Child issue candidates` is `yes`, this section is the deterministic handoff consumed later by `component-child-issues` after approval. Include one row per candidate, and keep each candidate `Blockers/questions` value as `none`; if a candidate still has unresolved blockers or questions, return the blockers/questions output instead. Use the `{name or none}` placeholder only when candidates are `no`.

| Candidate name | Proposed tier | Source/parent component | Action | Reuse target or extraction reason | Scope summary | Target issue | Blockers/questions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {name or none} | primitive/atom/molecule/organism | {source component} | reuse existing/create new/skip/defer | {existing component or why this must be extracted} | {independently reviewable scope} | parent/#223/#224/#225/#226/#227 | none |

### Evidence

- Tier contract check:
- Existing catalog check:
- Reuse/extraction rationale:
```

When validation cannot complete, return only:

```markdown
## Cataloging blockers/questions

- Component:
- Blockers/questions:
- Evidence needed:
- Next validation step:
```

After human approval, `component-spec-proposer` may convert the draft heading to the final `## Cataloging decision` heading only in the same issue comment/update immediately after `## Validated component spec`.

## References

- `docs/COMPONENT-CATALOGING.md`
- `docs/COMPONENT-CATALOGING.en.md`
- `skills/component-spec-proposer/SKILL.md`
- `skills/component-child-issues/SKILL.md` — later execution only, after a validated `Cataloging decision`.
