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

Set Project Status to `In progress`:

```bash
gh project item-edit \
  --project-id PVT_kwDOEHd14s4BUsw- \
  --id "$item_id" \
  --field-id PVTSSF_lADOEHd14s4BUsw-zhCIcdo \
  --single-select-option-id 47fc9ee4
```

Add the approved spec to the issue:

```bash
gh issue comment NUMBER \
  --repo Stack-and-Flow/design-system \
  --body-file /tmp/validated-component-spec.md
```

If a previous `Validated component spec` comment exists, prefer editing it manually or with the GitHub API instead of adding duplicates.
