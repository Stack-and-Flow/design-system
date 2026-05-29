# GitHub Project Update Commands

Project data comes from `../github-project-tasks/SKILL.md`.

Required auth scopes:

```bash
gh auth refresh -s read:project,project
```

Find the Project item for an issue URL:

```bash
issue_url="https://github.com/Stack-and-Flow/design-system/issues/NUMBER"
item_id=$(gh project item-list 1 \
  --owner Stack-and-Flow \
  --format json \
  --limit 200 \
  --jq ".items[] | select(.content.url == \"$issue_url\") | .id")
```

Do not move Project Status to `In progress` from `component-spec-proposer`.
That transition belongs to START WORK in `github-project-tasks`, after spec approval and immediately before implementation.

Add the approved spec to the issue:

```bash
gh issue comment NUMBER \
  --repo Stack-and-Flow/design-system \
  --body-file /tmp/validated-component-spec.md
```

If a previous `Validated component spec` comment exists, prefer editing it manually or with the GitHub API instead of adding duplicates.
