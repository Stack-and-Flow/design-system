---
name: component-spec-proposer
description: "Trigger: HeroUI reference, component spec proposal, prepare component issue. Propose specs, iterate approval, then ready the GitHub Project task."
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## Activation Contract

Use this skill when a user provides a component task or GitHub issue plus a reference implementation, usually HeroUI, and asks to prepare requirements before `component-contributor` implementation.

Do not implement the component. Your job is to turn a vague task into a validated, issue-backed implementation spec.

## Hard Rules

- Treat the reference as inspiration, not source of truth. Adapt to Stack-and-Flow tokens, 6-file pattern, accessibility rules, and Storybook conventions.
- Never mark the task ready until the user explicitly validates the proposed spec.
- Do not invent irreversible product decisions. Flag assumptions and ask for confirmation.
- Keep issue/project writes single-threaded: update the issue first, then the GitHub Project item.
- Use ASCII-safe headings in GitHub comments and issue edits. No emojis in issue body or generated comments.
- If `gh` lacks `read:project` or `project` scope, stop and ask the user to run `gh auth refresh -s read:project,project`.

## Decision Gates

| Situation                                    | Action                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| Reference URL missing                        | Ask for HeroUI/Radix/MDN/reference URL before proposing specs.                 |
| Issue URL missing                            | Produce the proposal only; do not update GitHub.                               |
| Component tier unclear                       | Ask whether it is atom, molecule, or organism.                                 |
| Reference implies complex composite behavior | Flag possible molecule/organism mismatch before validation.                    |
| User approves proposal                       | Add the validated spec to the issue; leave Project `In progress` transition to START WORK. |
| User requests changes                        | Revise the proposal and ask for validation again.                              |

## Execution Steps

1. Read the GitHub issue, if provided: title, body, comments, assignees, and URL. If the rendered issue page does not expose the comment thread, fetch the issue comments via the GitHub API (`/repos/{owner}/{repo}/issues/{number}/comments`) or `gh api` before continuing.
2. Fetch and study the reference URL. Extract behavior, states, accessibility, anatomy, and examples.
3. Compare against project rules from `component-contributor`, especially Phase 1 requirements.
4. Present a proposed spec using `references/spec-template.md`.
5. Include an `Assumptions to validate` section for choices not explicit in the issue/reference.
6. Ask the user to approve, reject, or edit the proposal. Do not write to GitHub before approval.
7. After approval, append or update a GitHub issue comment headed `## Validated component spec` using the approved spec.
8. If the issue is not on the Project board or Team/Category fields are missing, report the missing setup instead of mutating status.
9. Report the issue URL, spec comment status, and next command/action: run START WORK via `github-project-tasks`, then start `component-contributor`.

## Output Contract

Before approval, return:

```markdown
## Component Spec Proposal: {ComponentName}

{spec from references/spec-template.md}

## Assumptions to validate

- ...

## Ready for validation

Reply with approve, or list changes.
```

After approval and GitHub update, return:

```markdown
## Spec Ready

**Issue**: #{number} {title}
**Spec**: Added to issue as `Validated component spec`
**Project setup**: {team/category present or missing setup}
**Next**: Run START WORK via `github-project-tasks`, then run `component-contributor` for implementation.
```

## References

- `references/spec-template.md` — required proposal and issue spec structure.
- `references/github-project-update.md` — commands for issue comments and Project status updates.
- `../component-contributor/SKILL.md` — implementation-readiness contract.
- `../github-project-tasks/SKILL.md` — GitHub Project IDs and status option IDs.
