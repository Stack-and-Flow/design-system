# Stack-and-Flow Design System

<div align="center">

[![Demo][demo-shield]][demo-url]
[![Stars][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

</div>

![storybook](https://github.com/user-attachments/assets/81874b4d-4a89-4b8f-8054-6bc4a4e4d0fd)

## 🎯 What is this project?

A modern, scalable, and accessible **Design System** built from scratch with **React**, **TypeScript**, **Tailwind CSS v4**, and **Storybook**. This project follows professional architectural patterns like **Atomic Design** and **Container/Presentational** to maintain clean, predictable, and maintainable code.

### ✨ Key Features

- 🧱 **Atomic Design Architecture**: Components organized as atoms, molecules, and organisms
- 🎨 **Tokenized Design**: Consistent system for colors, typography, and spacing
- ♿ **Accessibility First**: ARIA attributes, keyboard navigation, and WCAG compliance
- 📚 **Living Documentation**: All components documented in Storybook
- 🔒 **Type-safe**: Strict TypeScript with no `any` allowed
- 🎭 **Dark Mode**: Native support for light and dark themes
- 🚀 **Developer Experience**: Git hooks, automatic linting, and custom CLI tools

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Storybook](https://img.shields.io/badge/-Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![radixUI](https://img.shields.io/badge/radixUI-%23000000.svg?style=for-the-badge&logo=radixui&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-brown?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![PNPM](https://img.shields.io/badge/Pnpm-gray?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version specified in `.nvmrc`)
- **pnpm** - [Installation Guide](https://pnpm.io/installation)
- **nvm** (optional but recommended) - [UNIX](https://github.com/nvm-sh/nvm) | [Windows](https://github.com/coreybutler/nvm-windows)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system

# 2. Use the correct Node version
nvm use

# 3. Install dependencies
pnpm install

# 4. Run Storybook with hot reload
npx storybook-watch
```

Done! Storybook will open at `http://localhost:6006` 🎉

## 📖 Live Demo

Explore all components and their interactive documentation:

**🔗 [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)**

## 🏗️ Component Architecture

Every component follows a strict **5-file structure** that separates concerns:

```
src/components/atoms/button/
├── Button.tsx           # Presentational Layer (JSX only)
├── useButton.ts         # Container Layer (logic + CVA)
├── types.ts             # Types + CVA Variants
├── index.ts             # Public exports
└── Button.stories.tsx   # Storybook documentation
```

### Why this architecture?

- ✅ **Clear separation** of logic and presentation
- ✅ **Reusability** of hooks across components
- ✅ **Simplified testing** (test logic independently from UI)
- ✅ **Predictable scalability** and maintainability

## 🤝 How to Contribute?

This is an **educational and open collaboration project**. We'd love for you to participate, regardless of your experience level.

> 📖 **New here?** Read the **[Quick Start Guide](./docs/QUICK_START.en.md)** — from zero to your first contribution in under 10 minutes.

### Workflow

1. **Research** similar components and patterns
2. **Define** functionality, props, variants, and use cases
3. **Implement** following the 5-file architecture
4. **Document** in Storybook with controls and examples
5. **Open a PR** following [Conventional Commits](https://www.conventionalcommits.org/)

📚 **Complete documentation**: Read [CONTRIBUTING.en.md](./docs/CONTRIBUTING.en.md) and [GUIDELINES.en.md](./docs/GUIDELINES.en.md) before starting.

### Golden Rules

- ✅ We only use **Radix UI** as base library (unstyled primitives)
- ✅ Use system tokens (colors, spacing, fonts) from `src/styles/theme.css`
- ✅ **Strict TypeScript**: explicit types, no `any`
- ✅ **Mandatory accessibility**: ARIA attributes, keyboard navigation
- ✅ **English in code**: variables, comments, and documentation

### 💡 Got ideas?

- 🆕 **Propose components** on the [Kanban Board](https://github.com/orgs/Stack-and-Flow/projects/1)
- 🐛 **Report bugs** using issue templates
- 💬 **Contact the Project Lead** to discuss features before implementing

## 🧰 Project Tools

### Compilot CLI

Interactive tool for component scaffolding and maintenance.

```bash
npx compilot-cli
```

📖 [More information](https://github.com/Stack-and-Flow/compilot-cli/)

### Storybook Watch

Smart hot reload for Storybook during development.

```bash
npx storybook-watch
```

📖 [More information](https://github.com/Stack-and-Flow/storybook-watch)

## 📚 Learning Resources

- **HeroUI**: [UI library reference](https://heroui.com/docs/react/components)
- **📖 Deepwiki Wiki**: [deepwiki.com/Stack-and-Flow/design-system](https://deepwiki.com/Stack-and-Flow/design-system)
- **🎨 UI References**: [UI Libraries repo](https://github.com/Stack-and-Flow/ui-libraries)
- **📋 Kanban Board**: [GitHub Projects](https://github.com/orgs/Stack-and-Flow/projects/1)

## 🎓 Educational Project

This repository is for **educational purposes** and is fully open to collaboration. If you're interested in:

- Learning how to build a professional Design System
- Improving your skills in React, TypeScript, or Software Architecture
- Contributing to a real open-source project
- Working with advanced patterns (Atomic Design, Container/Presentational)

📩 **Contact me directly or open an issue!** You're more than welcome.

## 🥇 Contributors

Special thanks to everyone who has contributed to making this project possible.

<a href="https://github.com/Stack-and-Flow/design-system/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Stack-and-Flow/design-system&nocache=1" />
</a>

## 📫 Contact

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
[issues-shield]: https://img.shields.io/github/issues/Stack-and-Flow/design-system.svg?style=for-the-badge
[issues-url]: https://github.com/Stack-and-Flow/design-system/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/egdev6
[demo-url]: https://sf-design-system.netlify.app/
[demo-shield]: https://img.shields.io/badge/-Demo-black.svg?style=for-the-badge&colorB=555
[wiki-url]: https://deepwiki.com/Stack-and-Flow/design-system
[wiki-shield]: https://img.shields.io/badge/-Wiki-black.svg?style=for-the-badge&colorB=555
