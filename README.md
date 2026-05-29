# Sistema de Diseño Stack-and-Flow

<div align="center">

[![Demo][demo-shield]][demo-url]
[![Estrellas][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

</div>

<img width="5120" height="1440" alt="V2design-system" src="https://github.com/user-attachments/assets/9f09a8ca-5d50-466d-9a63-d5194433c15e" />

## Qué es este proyecto

Stack-and-Flow es un **design system educativo, accesible y publicable como paquete npm**, construido con React, TypeScript, Tailwind CSS v4, Radix UI primitives, CVA, Storybook y Vite.

El objetivo es aprender y practicar cómo se construye una librería de componentes real: tokens, arquitectura, documentación viva, tests, accesibilidad, revisión visual y flujo de contribución con GitHub Projects.

## Stack

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

## Inicio rápido

```bash
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system
nvm use
pnpm install
pnpm run storybook
```

Storybook queda disponible en `http://localhost:6006`.

Demo pública: **[sf-design-system.netlify.app](https://sf-design-system.netlify.app/)**

## Arquitectura de componentes

Cada componente vive en `src/components/{atoms|molecules|organisms}/{kebab-name}/` y usa el patrón obligatorio de **6 archivos**:

```text
src/components/atoms/button/
├── types.ts              # Props, tipos públicos y variantes CVA
├── useButton.ts          # Lógica, estado, handlers, aria y className computado
├── Button.tsx            # JSX presentacional; consume el hook
├── Button.test.tsx       # Tests de hook y comportamiento del componente
├── Button.stories.tsx    # Storybook autodocs, args, variants y estados
└── index.ts              # Named export del componente + type exports
```

Reglas base:

- `type`, nunca `interface`.
- Sin `any` explícito.
- CVA vive en `types.ts`.
- El componente `.tsx` no contiene lógica ni llamadas CVA.
- Exports/imports públicos son nombrados, por ejemplo `import { Button } from '@stack-and-flow/design-system'`.
- Storybook usa JSDoc encima de `const meta` y encima de cada `export const StoryName`.
- No usamos `parameters.docs.description.component`.

## Contribuir

Este proyecto usa GitHub Issues + GitHub Projects como flujo de trabajo.

Ruta corta:

1. Elegí una issue del [Project Board](https://github.com/orgs/Stack-and-Flow/projects/1).
2. Antes de implementar, verificá que la spec esté definida y que la issue tenga el label `status:approved`.
3. Recién después ejecutá **START WORK**:
   - asignar la issue al contributor;
   - mover el Project item a `In progress`;
   - registrar branch y worktree.
4. Usá branch issue-based:
   - `feat/{issue-number}-{slug}`
   - `fix/{issue-number}-{slug}`
   - `docs/{issue-number}-{slug}`
5. Si necesitás worktree, crealo como sibling del repo:
   - `../design-system-{type}-{issue-number}-{slug}`
   - no en `/tmp`, salvo pedido explícito.
6. Implementá con el patrón de 6 archivos.
7. Corré tests/build/revisión visual según corresponda.
8. Antes de commit/review, limpiá artefactos MCP:

```bash
rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output
```

9. Al cerrar, usá **END WORK** sólo si hay PR merged o aprobación explícita del maintainer/usuario, con evidencia de validación.

Documentación recomendada:

- [Quick Start](./docs/QUICK_START.md)
- [Contributor Flow](./docs/CONTRIBUTOR-FLOW.md)
- [Contributing](./docs/CONTRIBUTING.md)
- [Guidelines](./docs/GUIDELINES.md)
- [Design Reference](./docs/DESIGN.md)
- [Components Reference](./docs/COMPONENTS.md)

## Reglas de oro

- Sólo usamos **Radix UI primitives** como base sin estilos.
- No usamos shadcn como fuente de componentes ni configuración.
- Usá tokens desde `src/styles/theme.css`; no hardcodees colores, fuentes o spacing.
- Si falta un token, proponé agregarlo centralmente antes de usar valores raw.
- Accesibilidad obligatoria: nombre accesible, teclado, focus visible, contraste, reduced motion.
- Código, comentarios, Storybook y nombres públicos en inglés.

## Scripts útiles

```bash
pnpm run storybook       # Storybook local
pnpm run test            # Vitest
pnpm run test:coverage   # Cobertura
pnpm run build           # Build de librería + tipos
```

## Playwright MCP y auditoría visual AI

Playwright MCP es infraestructura opcional para agentes AI. Puede generar artefactos como `.playwright-mcp/`, `page-*.png`, `page-*.jpeg` o `*.md.playwright-output`.

Estos archivos **no se commitean**. Antes de commit o review:

```bash
rm -rf .playwright-mcp page-*.png page-*.jpeg *.md.playwright-output
```

## Recursos

- **Storybook live**: [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)
- **Project Board**: [GitHub Projects](https://github.com/orgs/Stack-and-Flow/projects/1)
- **Wiki Deepwiki**: [deepwiki.com/Stack-and-Flow/design-system](https://deepwiki.com/Stack-and-Flow/design-system)

## Proyecto educativo

Este repositorio está abierto a colaboración. Es ideal si querés aprender design systems, React, TypeScript, arquitectura de componentes, accesibilidad, Storybook y publicación de librerías.

## Contacto

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/egdev/)
[![Instagram](https://img.shields.io/badge/Instagram-purple?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/egdev6/)
![Discord](https://img.shields.io/badge/Egdev5285-8C9EFF?style=for-the-badge&logo=discord&logoColor=white)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:egdev6@gmail.com)

</div>

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub ⭐**

</div>

<!-- MARKDOWN LINKS & IMAGES -->
[stars-shield]: https://img.shields.io/github/stars/Stack-and-Flow/design-system.svg?style=for-the-badge&cacheBust=1
[stars-url]: https://github.com/Stack-and-Flow/design-system/stargazers
[issues-shield]: https://img.shields.io/github/issues-search?query=repo%3AStack-and-Flow%2Fdesign-system%20is%3Aissue%20is%3Aopen%20milestone%3AMVP&label=MVP%20issues&style=for-the-badge
[issues-url]: https://github.com/Stack-and-Flow/design-system/issues?q=is%3Aissue%20is%3Aopen%20milestone%3AMVP
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/egdev6
[demo-url]: https://sf-design-system.netlify.app/
[demo-shield]: https://img.shields.io/badge/-Demo-black.svg?style=for-the-badge&colorB=555
