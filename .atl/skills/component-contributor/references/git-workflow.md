# Reference: Git Workflow

> Source: `docs/CONTRIBUTING.md`, `docs/GOVERNANCE.md`

---

## Branch naming

```
feat/component-name      ← new component or feature
fix/bug-description      ← bug fix
chore/task-description   ← tooling, dependencies, configuration
docs/what-was-documented ← documentation only
refactor/what-changed    ← code change without behavior change
```

Examples:
```
feat/avatar-component
feat/tooltip
fix/button-disabled-state
fix/input-focus-ring
chore/update-biome
docs/contributing-ai-workflow
refactor/dropdown-hook-logic
```

Rules:
- Lowercase, kebab-case only
- Branch name describes WHAT is being worked on
- One feature/fix per branch — never mix concerns

---

## Conventional Commits

Format: `<type>: <description>`

All lowercase. No period at the end. Present tense.

| Type | When to use |
|------|-------------|
| `feat:` | New component, new feature, new prop |
| `fix:` | Bug fix |
| `chore:` | Dependencies, tooling, config |
| `docs:` | Documentation only |
| `refactor:` | Code change — no bug fix, no new feature |
| `style:` | Formatting, whitespace, semicolons |
| `test:` | Adding or fixing tests |

```bash
# ✅ CORRECT
git commit -m "feat: add Avatar component with size and shape variants"
git commit -m "fix: prevent button onClick when isLoading is true"
git commit -m "chore: update biome to 2.4.12"
git commit -m "docs: add forwardRef usage to GUIDELINES"
git commit -m "test: add renderHook tests for useInput"

# ❌ WRONG
git commit -m "Added Avatar"           # not conventional
git commit -m "Feat: Avatar Component" # wrong case
git commit -m "feat: Avatar."          # has period
git commit -m "update stuff"           # no type
```

---

## Opening a Pull Request

### Step 1 — Create a linked issue first

Every PR MUST be linked to an existing GitHub issue.
No issue = automatic PR rejection.

When creating the issue, use the appropriate template (component, bug, feature).

### Step 2 — Open the PR against `main`

```bash
git checkout -b feat/my-component
# ... make changes ...
git add .
git commit -m "feat: add MyComponent with variant and size props"
git push origin feat/my-component
```

Then open the PR via GitHub UI or `gh pr create`.

### Step 3 — Fill the PR template completely

The PR template must be filled. Incomplete templates = rejection without review.

### Step 4 — Link the issue

In the PR description, include:

```
Closes #123
```

This:
- Links the PR to the issue
- Automatically closes the issue when the PR is merged
- Is a hard requirement — PRs without issue link are rejected

### Step 5 — Pass CI before requesting review

CI checks that must pass:
- Biome format + lint (`biome-staged`)
- TypeScript type check (`tsc`)
- Vitest unit tests
- Storybook build
- a11y checks

Do NOT request human review if CI is red. Fix CI first.

---

## Automatic rejection criteria (no review given)

A PR will be rejected WITHOUT detailed feedback if:

| Violation | Why |
|-----------|-----|
| No linked issue | No `Closes #NNN` in description |
| CI failing | Tests, build, or lint failures |
| `interface` used | Project uses `type` exclusively |
| `any` used | Type safety violation |
| Hardcoded colors/spacing | Must use design tokens from `theme.css` |
| Missing tests | Unit tests AND story required |
| Missing story | Storybook is the source of truth |
| Container/Presentational mixed | Logic in `.tsx` file |

---

## PR approval criteria

A PR is ready to merge when:

- [ ] All CI checks pass (tests, build, a11y)
- [ ] 5-file architecture followed exactly
- [ ] No `any`, no `interface`
- [ ] Tests cover hook logic + component behavior
- [ ] Story has args, controls, and description
- [ ] No hardcoded values — only design tokens
- [ ] ARIA attributes present and correct
- [ ] PR template fully filled
- [ ] Conventional commit message
- [ ] Linked to an issue with `Closes #NNN`

---

## Responding to review feedback

- Respond to feedback within **7 days** — longer = PR may be closed
- Address ALL comments before re-requesting review
- Keep the branch updated with `main` if conflicts arise

```bash
git fetch origin
git rebase origin/main
# resolve conflicts if any
git push --force-with-lease
```

---

## Using AI tools

AI-generated code follows the **exact same review process** as human-written code.

"The AI wrote it" is NOT a valid reason to skip the checklist.

Before opening a PR with AI-generated code:
- Run through the PR checklist manually
- Fix every violation — reviewers will not accept AI-generated problems as "acceptable"
- You are responsible for every line in your PR
