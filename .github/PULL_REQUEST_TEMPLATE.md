## Summary

<!-- What changed, who it helps, and why it matters. Keep it short. -->

Closes #<!-- issue number -->

## Review scope

<!-- Tell reviewers what to inspect first and what is intentionally out of scope. -->

- Primary files/areas:
- Out of scope:
- Review workload: <!-- small / medium / large; explain if >400 changed lines -->

## Type of change

- [ ] New component
- [ ] Existing component update/refactor
- [ ] Bug fix
- [ ] Accessibility
- [ ] Design tokens
- [ ] Storybook/docs
- [ ] Infrastructure/tooling
- [ ] NPM/dependencies

## Workflow gates

- [ ] Linked issue is present with `Closes #NNN` or maintainer approved an exception.
- [ ] Work was started through the Project flow: assignee set, Project status `In progress`, branch/worktree recorded.
- [ ] PR title follows Conventional Commit format: `<type>(<optional scope>): <description>`.
- [ ] Commits follow the same commitlint-enforced format.
- [ ] Diff is focused; unrelated work is called out in Review scope.
- [ ] MCP/runtime artifacts are absent: `.playwright-mcp`, `page-*.png`, `page-*.jpeg`, `*.md.playwright-output`.

## Component evidence (required for component changes)

- [ ] Validated component spec is linked or quoted in the issue.
- [ ] Accessibility contract from the spec was implemented or deviations are explained below.
- [ ] Follows the 6-file pattern: `types.ts`, `use*.ts`, `Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`, `index.ts`.
- [ ] CVA variants live in `types.ts`; JSX component has no state, CVA calls, or business logic.
- [ ] Uses design tokens from `theme.css`; no hardcoded colors or arbitrary color utilities.
- [ ] Storybook covers default, variants, documented states, edge cases, and dark mode when visually different.
- [ ] Component audit result is PASS or accepted PASS WITH WARNINGS.
- [ ] Visual review result is included when visuals changed.

## Accessibility evidence

<!-- Required for interactive components and a11y changes. Use N/A only for static display changes. -->

- [ ] Role/name semantics verified with Testing Library queries or equivalent.
- [ ] Keyboard-only behavior verified: Tab / Shift+Tab, Enter / Space, Arrow keys, Escape, Home / End / typeahead where applicable.
- [ ] Focus lifecycle verified: initial focus, roving/active descendant, focus restore, trap/portal behavior where applicable.
- [ ] Disabled, required, invalid/error, loading, and empty states expose the expected semantics where applicable.
- [ ] Reduced motion behavior is respected where motion changed.
- [ ] Screen reader or axe/manual evidence is included below when applicable.

## Validation evidence

<!-- Paste commands and results. If a check was skipped, explain why. -->

- TypeScript:
- Unit tests:
- Build/package:
- Storybook or visual check:
- Accessibility check:
- Security/dependency check:

## Screenshots or recordings

<!-- Required for visual changes when possible. Drag and drop images or recordings here. -->

## Notes for reviewer

<!-- Tradeoffs, known limitations, follow-up issues, spec deviations, or maintainer decisions. -->
