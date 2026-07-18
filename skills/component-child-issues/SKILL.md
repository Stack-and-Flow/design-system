---
name: component-child-issues
description: "Trigger: component child issues, cataloging child issues, extracted primitives, atoms, molecules, organisms. Create or reuse child issues after validated component cataloging decisions."
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## Activation Contract

Use this skill only after a parent component issue has `status:approved` and a same-comment/update handoff where `## Validated component spec` is followed immediately by an exact validated `## Cataloging decision` section that may extract reusable primitives, atoms, molecules, or organisms.

Do not use it for generic GitHub Project operations, unapproved component ideas, draft cataloging output, or implementation planning without that validated adjacent parent handoff.

## Hard Rules

- Read and verify the parent issue labels, body, and comments before deciding children.
- Require issue label `status:approved`; stop if it is missing or cannot be verified.
- Require `## Validated component spec` immediately followed by exact heading `## Cataloging decision` in the same issue comment/update; stop if the decision is standalone, draft-only, missing, unvalidated, or ambiguous.
- Immediately before creating, reusing, linking, adding to Project, or updating the parent checklist, re-check the parent still has `status:approved` and the same adjacent validated handoff. Stop if either gate changed.
- Reject any `## Cataloging decision` that contains unresolved blockers/questions or candidate rows whose blockers/questions are not `none`.
- Extract child candidates only from the `### Child issue candidates` block under the validated adjacent `## Cataloging decision`.
- Require each candidate to include name, proposed tier, source/parent component, action, reuse target or extraction reason, scope summary, target issue, and blockers/questions.
- Create or reuse child issues only for independently reviewable reusable
  pieces with proposed tier `primitive`, `atom`, `molecule`, or `organism`.
  Extracted lower-tier pieces are usually `primitive`, `atom`, or `molecule`.
- Avoid duplicate child issues; search existing repo issues and parent issue
  links first.
- Link every child issue back to the parent and update the parent with a child
  checklist.
- Use `github-project-tasks` for issue creation, Project fields, milestones,
  and mutation safety.
- Default technical artifacts, issue titles, and issue bodies to English.

## Decision Gates

| Situation | Action |
| --- | --- |
| Parent lacks `status:approved` | Stop and request maintainer/project lead approval. |
| Parent lacks the adjacent validated `## Validated component spec` + `## Cataloging decision` handoff | Stop and request validation. |
| Validated decision or candidate row contains blockers/questions | Stop and request a resolved cataloging decision. |
| Candidate row is missing required fields or uses vague placeholders | Stop and request a deterministic cataloging decision. |
| Candidate action is `skip` or `defer` | Do not create a child; record the reason on the parent checklist. |
| Candidate is not reusable/reviewable | Skip; keep it in parent scope. |
| Matching child issue exists | Reuse it and link it to the parent. |
| Candidate action is `create new` and no matching issue exists | Create it with the child template. |
| Required Project field is missing | Ask before mutating GitHub. |
| Parent approval or adjacent handoff changes during mutation preflight | Stop before further mutation and report the stale gate. |
| A GitHub mutation partially succeeds and a later step fails | Mark the run partial, report every created/reused/linked issue and missing follow-up, and never claim silent success. |

## Execution Steps

1. Load `skills/github-project-tasks/SKILL.md` and follow it for all GitHub
   and Project mutations.
2. Read the parent issue title, body, labels, milestone, assignees, Project
   fields, linked issues, and comments containing `## Validated component spec`.
3. Select only a same-comment/update handoff where `## Validated component spec` is followed immediately by `## Cataloging decision`, the parent issue has `status:approved`, and no blockers/questions remain.
4. Extract child candidates only from that validated `## Cataloging decision` section and its `### Child issue candidates` block.
5. Reject vague candidates before mutating GitHub; every consumed candidate must include the required per-candidate fields.
6. Search existing open and closed issues for equivalent child work.
7. For each candidate, decide `create`, `reuse`, `skip`, or `defer` using the candidate action and the gates above.
8. Run mutation preflight: re-read parent labels and the same issue comment/update, then verify `status:approved` and adjacent `## Validated component spec` + `## Cataloging decision` still match the consumed handoff.
9. For new children, fill the child issue template and create the issue through
   `github-project-tasks` CREATE mode.
10. Add each child issue to the GitHub Project using the Team, Category, and
   Milestone policy required by `github-project-tasks`.
11. Update the parent issue with a checklist of created or reused children and
   note skipped or deferred candidates.
12. If any create, Project add, link, or parent update fails after an earlier mutation succeeded, stop further mutation unless `github-project-tasks` gives a safe retry. Return `partial`, list completed GitHub changes, list missing rollback/follow-up actions, and do not claim the parent is fully synchronized.

## Output Contract

Return:

- Parent issue inspected, `status:approved` evidence, and adjacent `## Validated component spec` + `## Cataloging decision` status.
- Child issues created: title, URL, Project fields.
- Child issues reused: title, URL, reason.
- Candidates skipped: name and reason.
- Parent checklist update status.
- Partial mutation recovery notes: completed mutations, failed step, safe retry or manual follow-up required.
- Blockers, unresolved fields, or required human decisions.
- Whether registry refresh is needed after skill changes.

## References

- `skills/component-child-issues/assets/child-issue-template.md`
- `skills/github-project-tasks/SKILL.md`
- `skills/github-project-tasks/references/issue-body-template.md`
