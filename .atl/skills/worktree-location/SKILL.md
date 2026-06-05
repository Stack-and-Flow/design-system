---
name: worktree-location
description: "Trigger: creating git worktrees, parallel writer isolation, subagent worktree isolation, stacked/chained PR worktrees. Enforce sibling worktree placement next to the original repository instead of /tmp."
license: MIT
metadata:
  author: stack-and-flow
  version: "1.0"
---

# Worktree Location Policy

Use this project skill whenever an agent is about to create a git worktree or isolate writer work in a separate checkout for Stack-and-Flow.

## Hard Rule

Create worktrees as siblings of the original repository directory, never under `/tmp`, unless the user explicitly asks for a temporary worktree.

For this repo shape:

```text
/home/egdev/proyectos/design-system      # original repo
/home/egdev/proyectos/design-system-foo  # worktree sibling
```

## Important Pi Subagents Rule

Do not use `subagent({ worktree: true })` when sibling location matters. The packaged subagent worktree isolation may create temp worktrees outside the project parent.

Instead:

1. Manually create a sibling git worktree.
2. Run the worker/subagent with `cwd` set to that sibling worktree.
3. Remove or preserve the worktree only according to the user's instruction.

## Branch and Worktree Naming

When work starts from a GitHub issue, first verify the `github-project-tasks` START WORK gates: the issue has `status:approved` and is unassigned or assigned to the contributor/user. If it is assigned to someone else, stop before creating a branch/worktree and require explicit permission before reassigning or taking it over.

Then use the same naming convention as `github-project-tasks` START WORK:

```text
branch:   {type}/{issue-number}-{slug}
worktree: ../design-system-{type}-{issue-number}-{slug}
```

Examples:

```text
feat/123-button
fix/128-modal-focus-trap
../design-system-feat-123-button
```

Choose `{type}` from the Conventional Commit type for the task. Build `{slug}` from the issue title without the `[ATOMS]`, `[MOLECULES]`, `[ORGANISMS]`, `[FIX]`, etc. prefix, lowercased and dash-separated.

If no issue exists, use a short conventional branch such as `chore/cleanup-skills`; the sibling worktree still uses the branch slug with `/` converted to `-`.

## Creation Pattern

```bash
repo_root=$(git rev-parse --show-toplevel)
repo_parent=$(dirname "$repo_root")
repo_name=$(basename "$repo_root")
: "${branch:?set branch before creating a worktree}"
branch_slug=$(printf '%s' "$branch" \
  | tr '[:upper:]/' '[:lower:]-' \
  | sed 's/[^a-z0-9._-]/-/g; s/-\{2,\}/-/g; s/^-//; s/-$//')
worktree_path="$repo_parent/$repo_name-$branch_slug"

if [ -e "$worktree_path" ]; then
  echo "Refusing to overwrite existing path: $worktree_path" >&2
  exit 1
fi

git worktree add -b "$branch" "$worktree_path" HEAD
```

For an existing branch, omit `-b "$branch"`.

## Safety Checklist

Before creation:

- [ ] Confirm the repo root with `git rev-parse --show-toplevel`.
- [ ] Derive the worktree parent with `dirname "$repo_root"`.
- [ ] Show the planned absolute worktree path to the user or record it in the handoff.
- [ ] Refuse paths under `/tmp` unless explicitly requested.
- [ ] Avoid path collisions; if the sibling path exists, ask before reusing/removing it.

Before commit/PR from a worktree:

- [ ] Confirm `pwd` is the intended sibling worktree.
- [ ] Run `git status --short --branch`.
- [ ] Report the original repo path and the worktree path separately.
