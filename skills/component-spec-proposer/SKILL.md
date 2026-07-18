---
name: component-spec-proposer
description: "Trigger: capture-first component spec, reference-component-first spec, HeroUI/Radix/reference component, prepare component issue. Propose specs, run cataloging validation, and prepare the issue spec before implementation."
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.1"
---

## Activation Contract

Use this skill when a user provides a component task or GitHub issue and asks to prepare requirements before `component-contributor` implementation. It supports both capture-first intake from conversation/product need and reference-component-first intake from HeroUI, Radix, MDN, WAI-ARIA APG, or another reference URL.

Do not implement, approve implementation, label the issue, or move Project Status. Turn a vague task into a validated, issue-backed component spec.

## Hard Rules

- Treat any reference as inspiration, not source of truth. Adapt to Stack-and-Flow tokens, 6-file pattern, accessibility rules, and Storybook conventions.
- Never claim implementation readiness from this skill; validation only covers the proposed spec and draft cataloging result.
- Run `component-spec-cataloging-validator` after drafting and before final human approval or `## Validated component spec` writes.
- Reserve the exact `## Cataloging decision` heading for the final approved issue comment/update, immediately after `## Validated component spec`.
- Do not accept vague accessibility placeholders such as "supports keyboard" or "uses ARIA". For interactive/composite components, define pattern, roles, names, keyboard, focus lifecycle, announcements, and expected tests.
- Prefer native semantics first; when using Radix or WAI-ARIA APG patterns, name the pattern and intentional deviations.
- Use ASCII-safe headings in GitHub comments and issue edits. No emojis.
- If `gh` lacks `read:project` or `project` scope, stop and ask the user to run `gh auth refresh -s read:project,project`.

## Decision Gates

| Situation | Action |
| --- | --- |
| Reference URL missing and intake is capture-first | Propose from issue/conversation context; flag missing reference or pattern as an assumption/question when behavior is ambiguous. |
| Reference URL missing and context is insufficient | Ask for a reference URL or maintainer-provided behavior before proposing specs. |
| Issue URL missing | Produce the proposal only; do not update GitHub. |
| Component tier unclear | Ask whether it is primitive, atom, molecule, or organism. |
| Reference implies complex composite behavior | Flag possible molecule/organism mismatch before validation. |
| Accessibility contract is vague or expected tests are missing | Stop and ask; do not produce a ready-to-approve spec. |
| Cataloging validator has not run | Run `component-spec-cataloging-validator`; do not ask for final approval or write `## Validated component spec`. |
| Cataloging validator returns blockers/questions | Report them under `## Cataloging blockers/questions`; do not show `## Ready for validation`, ask for final approval, or write `## Validated component spec` until reuse/extraction is classified. |
| Linked issue assigned to someone else | Stop before GitHub writes or handoff; require explicit permission before reassignment/takeover. |
| User approves proposal and draft cataloging decision after validator passed with no blockers/questions | Add the validated spec and decision to the issue, then leave implementation blocked until `status:approved`. |
| User requests changes | Revise, rerun cataloging validation, and ask for validation again. |

## Execution Steps

1. Read issue metadata, assignees, labels, URL, body, and comments if provided.
2. Determine intake source: capture-first or reference-component-first.
3. Study the reference URL if present; otherwise use issue/conversation context and record missing pattern choices as assumptions.
4. Identify the semantic pattern and compare against `component-contributor` Phase 1 requirements.
5. Draft the spec from `references/spec-template.md`. Before approval, present it under `## Component Spec Proposal: {ComponentName}` and omit the final-only `## Validated component spec` heading.
6. Include `Assumptions to validate` for unresolved product, accessibility, keyboard, focus, or reference decisions.
7. Run `component-spec-cataloging-validator` and include its result with the proposal as `## Draft cataloging decision`, or as `## Cataloging blockers/questions` when validation cannot complete.
8. If there are no blockers/questions, ask the user to approve, reject, or edit both the proposed spec and draft cataloging decision. If blockers/questions remain, do not show the approval prompt.
9. After approval, write/update the issue with `## Validated component spec`, followed immediately by validated `## Cataloging decision` in the same comment/update.
10. Confirm the Project item exists only; do not move it to `In progress`.
11. Report the next gate: wait for `status:approved`, then START WORK via `github-project-tasks`, then `component-contributor`.

## Output Contract

Use `references/proposal-output.md` for pre-approval and post-update response shapes.

## References

- `references/spec-template.md` — required proposal and issue spec structure.
- `references/proposal-output.md` — pre-approval and post-update output shapes.
- `references/github-project-update.md` — commands for issue comments and Project lookup/status guards.
- `../component-spec-cataloging-validator/SKILL.md` — mandatory cataloging gate before final approval.
- `../../docs/COMPONENT-CATALOGING.md` and `../../docs/COMPONENT-CATALOGING.en.md` — catalog tier authority.
- `../component-contributor/SKILL.md` — implementation-readiness contract.
- `../github-project-tasks/SKILL.md` — GitHub Project IDs and status option IDs.
