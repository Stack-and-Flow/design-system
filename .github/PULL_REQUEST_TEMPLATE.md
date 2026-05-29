## Summary

<!-- What does this PR do? One or two sentences. -->

Closes #<!-- issue number -->

## Type of change

- [ ] New component
- [ ] Bug fix
- [ ] Design tokens
- [ ] Accessibility
- [ ] Infrastructure
- [ ] Documentation

## Repository checklist

- [ ] PR title follows Conventional Commit format: `<type>(<optional scope>): <description>`
- [ ] Commit messages follow the same commitlint-enforced format
- [ ] PR description links the issue with `Closes #NNN`
- [ ] Security checks pass, or any false positives are documented in the PR
- [ ] MCP/runtime artifacts are absent: `.playwright-mcp`, `page-*.png`, `page-*.jpeg`, `*.md.playwright-output`

## Component checklist (skip if not applicable)

- [ ] Follows the 6-file pattern (`types.ts`, `use*.ts`, `Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`, `index.ts`)
- [ ] Uses named component exports plus type exports
- [ ] CVA variants defined in `types.ts`, not inline
- [ ] No hardcoded colors — uses tokens from `theme.css`
- [ ] No `any` types — TypeScript strict
- [ ] ARIA attributes present and correct
- [ ] Keyboard navigable (Tab, Enter, Escape where applicable)
- [ ] Dark mode works correctly
- [ ] Storybook stories cover default, variants, and states; docs use JSDoc above `const meta` and each story export
- [ ] Tests added or updated

## How to test

<!-- Steps to verify this works locally -->

1. `pnpm run storybook`
2. Navigate to `...`
3. Verify that `...`

## Screenshots / recordings (if applicable)

<!-- Drag and drop images or screen recordings here -->

## Notes for reviewer

<!-- Anything the reviewer should know: tradeoffs, known limitations, follow-up issues -->
