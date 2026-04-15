# Stack-and-Flow Design System Governance

This document describes how the project is organized, who can do what, and how decisions are made.

---

## Roles

### Project Lead

The **Project Lead** is the final owner of the design system. Currently: [@egdev6](https://github.com/egdev6).

Responsibilities:
- Define the vision and roadmap of the project
- Approve and merge all Pull Requests
- Make architecture and design decisions
- Manage the project board and issue stages
- Resolve technical conflicts or disagreements

### Maintainer

**Maintainers** are contributors with a proven track record in the project who receive additional permissions.

Responsibilities:
- Review Pull Requests and leave detailed technical feedback
- Label and prioritize issues
- Help new contributors with questions and onboarding
- Participate in design decisions when the Project Lead requests it

To become a Maintainer: have contributed at least **3 merged PRs** of quality, and be proposed or accept the invitation from the Project Lead.

### Contributor

Anyone who opens an issue, reports a bug, proposes a feature, or submits a Pull Request.

Responsibilities:
- Follow the guidelines in [CONTRIBUTING.en.md](./CONTRIBUTING.en.md) and [GUIDELINES.en.md](./GUIDELINES.en.md)
- Respond to review feedback within 7 days
- Keep the PR up to date with `main` if there are conflicts

---

## Pull Request Approval Process

### Standard flow

```
1. Contributor opens PR → links the issue with "Closes #NNN"
2. CI automatically runs: tests, Storybook build, a11y
3. Project Lead or Maintainer reviews the code
4. If there is feedback → Contributor applies changes
5. Project Lead approves and merges
```

### Approval criteria

A PR is ready to merge when:

- ✅ All CI checks pass (tests, build, a11y)
- ✅ Code follows the 5-file structure and Container/Presentational pattern
- ✅ Types are explicit — no `any`, no `interface`
- ✅ Component has tests with minimum required coverage
- ✅ Storybook story is complete with controls and description
- ✅ No hardcoded values — only system tokens
- ✅ ARIA attributes are present and correct
- ✅ PR template is fully filled in
- ✅ Commit follows Conventional Commits format

### Automatic rejection criteria

A PR will be rejected without detailed review if:

- ❌ Any CI check fails
- ❌ Not linked to an existing issue
- ❌ Mixes Container and Presentational logic in the same file
- ❌ Uses `any` or `interface` in TypeScript
- ❌ Uses arbitrary Tailwind values (`p-[14px]`, `text-[#000]`)
- ❌ Missing tests or Storybook story

---

## Decision Making

### Minor decisions

Changes to existing components, bug fixes, documentation improvements, and token adjustments: the **Project Lead** decides unilaterally after review.

### Architecture decisions

Changes affecting global patterns (new atomic layer, tooling changes, new naming conventions): discussed in an issue labeled `discussion` before implementing. The **Project Lead** has the final say.

### Roadmap changes

Adding or removing project phases, significant scope changes: the **Project Lead** announces them in GitHub Discussions before implementing them.

---

## Communication

| Channel | Purpose |
|---------|---------|
| [GitHub Issues](https://github.com/Stack-and-Flow/design-system/issues) | Bugs, component proposals, concrete improvements |
| [GitHub Discussions](https://github.com/orgs/Stack-and-Flow/discussions) | Questions, open ideas, general feedback |
| [Pull Requests](https://github.com/Stack-and-Flow/design-system/pulls) | Code review and technical feedback |
| [Project Board](https://github.com/orgs/Stack-and-Flow/projects/1) | Task status tracking |

---

## Code of Conduct

This project follows a professional and respectful collaboration environment. All participants are expected to:

- Communicate respectfully and without offensive language
- Accept technical feedback constructively
- Give credit to others' contributions
- Prioritize code quality over speed

Behaviors that are not tolerated: personal attacks, discriminatory language, spam, or any form of harassment. The Project Lead may revoke access to any participant who does not comply with these norms.

---

## Changes to This Document

This document may be updated by the **Project Lead** at any time. Significant changes will be announced in GitHub Discussions with at least 7 days notice.
