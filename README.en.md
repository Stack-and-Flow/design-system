# Stack-and-Flow Design System

<div align="center">

[![Demo][demo-shield]][demo-url]
[![Stars][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

</div>

<img width="5120" height="1440" alt="V2design-system" src="https://github.com/user-attachments/assets/c3243e48-373c-4d5d-8096-48c7a92d0fb3" />

## What this project is

Stack-and-Flow is an **educational, accessible design system that can be published as an npm package**, built with React, TypeScript, Tailwind CSS v4, Radix UI primitives, CVA, Storybook, and Vite.

The goal is to learn and practice how a real component library is built: tokens, architecture, living documentation, tests, accessibility, visual review, and a GitHub Projects contribution workflow.

## Tech stack

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Storybook](https://img.shields.io/badge/-Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![radixUI](https://img.shields.io/badge/radixUI-%23000000.svg?style=for-the-badge&logo=radixui&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![PNPM](https://img.shields.io/badge/Pnpm-gray?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

## Quick start

```bash
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system
nvm use
pnpm install
pnpm run storybook
```

Storybook is available at `http://localhost:6006`.

Public demo: **[sf-design-system.netlify.app](https://sf-design-system.netlify.app/)**

## Component architecture

Every component lives in `src/components/{atoms|molecules|organisms}/{kebab-name}/` and uses the mandatory **6-file pattern**:

```text
src/components/atoms/button/
├── types.ts              # Props, public types, and CVA variants
├── useButton.ts          # Logic, state, handlers, aria, and computed className
├── Button.tsx            # Presentational JSX; consumes the hook
├── Button.test.tsx       # Hook tests and component behavior tests
├── Button.stories.tsx    # Storybook autodocs, args, variants, and states
└── index.ts              # Named component export + type exports
```

Base rules:

- Use `type`, never `interface`.
- No explicit `any`.
- CVA lives in `types.ts`.
- The component `.tsx` contains no logic and no CVA calls.
- Public imports/exports are named, for example `import { Button } from '@stack-and-flow/design-system'`.
- Storybook uses JSDoc above `const meta` and above every `export const StoryName`.
- Do not use `parameters.docs.description.component`.

## Contributing

This project uses GitHub Issues + GitHub Projects as the source workflow.

Short path:

1. Pick an issue from the [Project Board](https://github.com/orgs/Stack-and-Flow/projects/1).
2. Before implementing, verify that the spec is defined, the issue has the `status:approved` label, and the issue is not assigned to someone else.
3. Only then run **START WORK**:
   - verify assignees and assign the issue to the contributor;
   - move the Project item to `In progress`;
   - record the branch and worktree.
4. Use issue-based branch names:
   - `feat/{issue-number}-{slug}`
   - `fix/{issue-number}-{slug}`
   - `docs/{issue-number}-{slug}`
5. If you need a worktree, create it as a sibling of the repo:
   - `../design-system-{type}-{issue-number}-{slug}`
   - not under `/tmp`, unless explicitly requested.
6. Implement with the 6-file pattern.
7. Run tests/build/visual review as needed.
8. Before commit/review, clean MCP artifacts:

```bash
rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output
```

9. When closing, run **END WORK** only with a merged PR or explicit maintainer/user approval, plus validation evidence.

Recommended docs:

- [Quick Start](./docs/QUICK_START.en.md)
- [Contributor Flow](./docs/CONTRIBUTOR-FLOW.en.md)
- [Contributing](./docs/CONTRIBUTING.en.md)
- [Guidelines](./docs/GUIDELINES.en.md)
- [Design Reference](./docs/DESIGN.en.md)
- [Components Reference](./docs/COMPONENTS.en.md)

## Golden rules

- We only use **Radix UI primitives** as unstyled base primitives.
- We do not use shadcn as a component source or configuration layer.
- Use tokens from `src/styles/theme.css`; do not hardcode colors, fonts, or spacing.
- If a token is missing, propose adding it centrally before using raw values.
- Accessibility is mandatory: accessible name, keyboard behavior, visible focus, contrast, reduced motion.
- Code, comments, Storybook, and public names are in English.

## Useful scripts

```bash
pnpm run storybook       # Local Storybook
pnpm run test            # Vitest
pnpm run test:coverage   # Coverage
pnpm run build           # Library build + types
```

## Playwright MCP and AI visual audit

Playwright MCP is optional infrastructure for AI agents. It may generate artifacts such as `.playwright-mcp/`, `page-*.png`, `page-*.jpeg`, or `*.md.playwright-output`.

These files are **never committed**. Before commit or review:

```bash
rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output
```

## Resources

- **Live Storybook**: [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)
- **Project Board**: [GitHub Projects](https://github.com/orgs/Stack-and-Flow/projects/1)
- **Deepwiki Wiki**: [deepwiki.com/Stack-and-Flow/design-system](https://deepwiki.com/Stack-and-Flow/design-system)

## Educational project

This repository is open to collaboration. It is a good place to learn design systems, React, TypeScript, component architecture, accessibility, Storybook, and package publishing.

## Contact

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/egdev/)
[![Instagram](https://img.shields.io/badge/Instagram-purple?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/egdev6/)
![Discord](https://img.shields.io/badge/Egdev5285-8C9EFF?style=for-the-badge&logo=discord&logoColor=white)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:egdev6@gmail.com)

</div>

---

<div align="center">

**⭐ If you find this project useful, consider giving it a star on GitHub ⭐**

</div>

<!-- MARKDOWN LINKS & IMAGES -->
[stars-shield]: https://img.shields.io/github/stars/Stack-and-Flow/design-system.svg?style=for-the-badge&cacheBust=1
[stars-url]: https://github.com/Stack-and-Flow/design-system/stargazers
[issues-shield]: https://img.shields.io/github/issues-search?query=repo%3AStack-and-Flow%2Fdesign-system%20is%3Aissue%20is%3Aopen%20milestone%3AV1&label=V1%20issues&style=for-the-badge
[issues-url]: https://github.com/Stack-and-Flow/design-system/issues?q=is%3Aissue%20is%3Aopen%20milestone%3AV1
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/egdev6
[demo-url]: https://sf-design-system.netlify.app/
[demo-shield]: https://img.shields.io/badge/-Demo-black.svg?style=for-the-badge&colorB=555
