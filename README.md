# Sistema de Diseño Stack-and-Flow

<div align="center">

[![Demo][demo-shield]][demo-url]
[![Estrellas][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

</div>

![storybook](https://github.com/user-attachments/assets/81874b4d-4a89-4b8f-8054-6bc4a4e4d0fd)

## 🎯 ¿Qué es este proyecto?

Un **Design System** moderno, escalable y accesible construido desde cero con **React**, **TypeScript**, **Tailwind CSS v4** y **Storybook**. Este proyecto sigue patrones profesionales de arquitectura como **Atomic Design** y **Container/Presentational** para mantener un código limpio, predecible y fácil de mantener.

### ✨ Características principales

- 🧱 **Arquitectura Atomic Design**: Componentes organizados en átomos, moléculas y organismos
- 🎨 **Diseño tokenizado**: Sistema consistente de colores, tipografías y espaciados
- ♿ **Accesibilidad primero**: ARIA attributes, navegación por teclado y cumplimiento WCAG
- 📚 **Documentación en vivo**: Todos los componentes documentados en Storybook
- 🔒 **Type-safe**: TypeScript estricto sin `any` permitidos
- 🎭 **Dark mode**: Soporte nativo para temas claro y oscuro
- 🚀 **Developer Experience**: Git hooks, linting automático y herramientas CLI personalizadas

## 🛠️ Stack Tecnológico

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

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** (versión especificada en `.nvmrc`)
- **pnpm** - [Guía de instalación](https://pnpm.io/installation)
- **nvm** (opcional pero recomendado) - [UNIX](https://github.com/nvm-sh/nvm) | [Windows](https://github.com/coreybutler/nvm-windows)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system

# 2. Usar la versión correcta de Node
nvm use

# 3. Instalar dependencias
pnpm install

# 4. Ejecutar Storybook con hot reload
npx storybook-watch
```

¡Listo! Storybook se abrirá en `http://localhost:6006` 🎉

## 📖 Demo en Vivo

Explora todos los componentes y su documentación interactiva:

**🔗 [sf-design-system.netlify.app](https://sf-design-system.netlify.app/)**

## 🏗️ Arquitectura de Componentes

Cada componente sigue una estructura estricta de **5 archivos** que separa responsabilidades:

```
src/components/atoms/button/
├── Button.tsx           # Capa Presentacional (solo JSX)
├── useButton.ts         # Capa Container (lógica + CVA)
├── types.ts             # Tipos + Variantes CVA
├── index.ts             # Exportaciones públicas
└── Button.stories.tsx   # Documentación Storybook
```

### ¿Por qué esta arquitectura?

- ✅ **Separación clara** de lógica y presentación
- ✅ **Reutilización** de hooks entre componentes
- ✅ **Testing** simplificado (prueba lógica independiente de UI)
- ✅ **Escalabilidad** predecible y mantenible

## 🤝 ¿Cómo Contribuir?

Este es un **proyecto educativo y abierto a colaboración**. Nos encantaría que participes, sin importar tu nivel de experiencia.

### Flujo de Trabajo

1. **Investiga** componentes similares y patrones
2. **Define** la funcionalidad, props, variantes y casos de uso
3. **Implementa** siguiendo la arquitectura de 5 archivos
4. **Documenta** en Storybook con controles y ejemplos
5. **Abre un PR** siguiendo [Conventional Commits](https://www.conventionalcommits.org/)

🚀 **¿Primera vez?** Sigue la [Quick Start Guide](./docs/QUICK_START.md) y haz tu primera contribución en menos de 10 minutos.

📚 **Documentación completa**: Lee [CONTRIBUTING.md](./docs/CONTRIBUTING.md) y [GUIDELINES.md](./docs/GUIDELINES.md) antes de empezar.

### Reglas de Oro

- ✅ Solo usamos **Radix UI** como librería base (primitivos sin estilos)
- ✅ Usa tokens del sistema (colores, espaciados, fuentes) en `src/styles/theme.css`
- ✅ **TypeScript estricto**: tipos explícitos, nada de `any`
- ✅ **Accesibilidad obligatoria**: atributos ARIA, navegación por teclado
- ✅ **Inglés en código**: variables, comentarios y documentación

### 💡 ¿Tienes ideas?

- 🆕 **Propón componentes** en el [Kanban Board](https://github.com/orgs/Stack-and-Flow/projects/1)
- 🐛 **Reporta bugs** usando las plantillas de issues
- 💬 **Contacta al Project Lead** para discutir features antes de implementar

## 🧰 Herramientas del Proyecto

### Compilot CLI

Herramienta interactiva para scaffolding de componentes y mantenimiento.

```bash
npx compilot-cli
```

📖 [Más información](https://github.com/Stack-and-Flow/compilot-cli/)

### Storybook Watch

Hot reload inteligente para Storybook durante desarrollo.

```bash
npx storybook-watch
```

📖 [Más información](https://github.com/Stack-and-Flow/storybook-watch)

### Playwright MCP (AI Visual Audit)

Herramienta para que el agente AI pueda abrir el navegador, navegar Storybook y tomar capturas de pantalla durante auditorías visuales. Es infraestructura del agente — **no forma parte del proyecto** ni se instala con `pnpm install`.

> **Nota:** Solo es necesario si usas un agente AI (como opencode) para hacer auditorías visuales de componentes.

#### Prerrequisitos

- [opencode](https://opencode.ai) u otro cliente AI compatible con MCP
- Node.js disponible globalmente

#### Configuración

Añade el siguiente bloque a tu archivo de configuración del agente (p. ej. `~/.config/opencode/opencode.json`):

```json
"playwright": {
  "type": "local",
  "command": [
    "npx",
    "@playwright/mcp@latest",
    "--output-dir",
    ".playwright-mcp"
  ]
}
```

Reemplaza `/ruta/absoluta/a/tu/proyecto/screenshots` con la ruta real en tu máquina.

#### Carpeta de capturas

Las capturas se guardan en `screenshots/` en la raíz del proyecto. Esta carpeta está incluida en `.gitignore` — no se sube al repositorio.

```bash
# La carpeta ya existe en el repo (vacía, ignorada por git)
screenshots/
```

---

## 📚 Recursos de Aprendizaje

- **HeroUI**: [UI library reference](https://heroui.com/docs/react/components)
- **📖 Wiki Deepwiki**: [deepwiki.com/Stack-and-Flow/design-system](https://deepwiki.com/Stack-and-Flow/design-system)
- **🎨 Referencias UI**: [UI Libraries repo](https://github.com/Stack-and-Flow/ui-libraries)
- **📋 Kanban Board**: [GitHub Projects](https://github.com/orgs/Stack-and-Flow/projects/1)

## 🎓 Proyecto Educativo

Este repositorio tiene **fines educativos** y está completamente abierto a colaboración. Si estás interesado en:

- Aprender cómo se construye un Design System profesional
- Mejorar tus habilidades en React, TypeScript o Arquitectura de Software
- Contribuir a un proyecto open-source real
- Trabajar con patrones avanzados (Atomic Design, Container/Presentational)

📩 **¡Contáctame directamente o abre un issue!** Eres más que bienvenido.

## 🥇 Colaboradores

Agradecimiento especial a todos los que han contribuido a hacer este proyecto posible.

<a href="https://github.com/Stack-and-Flow/design-system/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Stack-and-Flow/design-system&nocache=1" />
</a>

## 📫 Contacto

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
[issues-shield]: https://img.shields.io/github/issues/Stack-and-Flow/design-system.svg?style=for-the-badge
[issues-url]: https://github.com/Stack-and-Flow/design-system/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/egdev6
[demo-url]: https://sf-design-system.netlify.app/
[demo-shield]: https://img.shields.io/badge/-Demo-black.svg?style=for-the-badge&colorB=555
[wiki-url]: https://deepwiki.com/Stack-and-Flow/design-system
[wiki-shield]: https://img.shields.io/badge/-Wiki-black.svg?style=for-the-badge&colorB=555
