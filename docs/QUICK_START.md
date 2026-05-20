# Guía de Inicio Rápido

De cero a tu primera contribución en menos de 10 minutos.

> 🇬🇧 [English version](./QUICK_START.en.md)

## Requisitos previos

| Herramienta | Versión | Instalación |
|-------------|---------|-------------|
| Node.js | ver `.nvmrc` | [nodejs.org](https://nodejs.org/) |
| pnpm | última | `npm i -g pnpm` |
| nvm | cualquiera | [UNIX](https://github.com/nvm-sh/nvm) / [Windows](https://github.com/coreybutler/nvm-windows) |
| git | cualquiera | [git-scm.com](https://git-scm.com/) |

## 1. Clonar e instalar

```bash
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system
nvm use
pnpm install
```

## 2. Iniciar Storybook

```bash
pnpm run storybook
```

Storybook se abre en `http://localhost:6006`. Este es tu entorno de desarrollo — cada componente vive aquí.

## 3. Encontrar algo en qué trabajar

Ve al [tablero del proyecto en GitHub](https://github.com/orgs/Stack-and-Flow/projects/1) y elige un issue abierto de la columna **Todo**.

> **¿Primera vez?** Busca issues etiquetados como `layer: atom` con `category: component` — son autocontenidos y bien definidos.

Comenta en el issue para que otros sepan que estás trabajando en él.

## 4. Crear tu rama

```bash
git checkout -b feat/nombre-de-tu-componente
# o
git checkout -b fix/descripcion-corta
```

El nombre de las ramas sigue [Conventional Commits](https://www.conventionalcommits.org/):
- `feat/` — nuevo componente o funcionalidad
- `fix/` — corrección de bug
- `a11y/` — mejora de accesibilidad
- `tokens/` — cambio de token de diseño
- `docs/` — solo documentación

## 5. Construir tu componente

Cada componente sigue el **patrón de 6 archivos**. Usá `CONTRIBUTOR-FLOW.md` como flujo canónico y el CLI de scaffolding solo si está alineado con esa estructura:

```bash
npx compilot-cli
```

O créalo manualmente en la capa atómica correcta:

```
src/components/atoms/tu-componente/
├── types.ts                  # Tipos + JSDoc controls + variantes CVA
├── useTuComponente.ts        # Capa Container — lógica, estado, handlers
├── TuComponente.tsx          # Capa Presentacional — solo JSX
├── TuComponente.test.tsx     # Tests de hook y comportamiento
├── TuComponente.stories.tsx  # Documentación de Storybook
└── index.ts                  # Exportaciones públicas
```

Lee [CONTRIBUTOR-FLOW.md](./CONTRIBUTOR-FLOW.md) para el flujo completo y [GUIDELINES.md](./GUIDELINES.md) para las reglas de arquitectura antes de escribir código.

## 6. Ejecutar tests

```bash
pnpm test
```

Todos los tests deben pasar antes de abrir un PR. Si estás añadiendo un nuevo componente, añade también sus tests.

## 7. Abrir un Pull Request

Sube tu rama y abre un PR contra `main`:

```bash
git push origin feat/nombre-de-tu-componente
```

Luego ve a GitHub → tu rama → **Compare & pull request**.

- Usa la plantilla de PR — completa cada sección
- Vincula el issue en el resumen (`Closes #123`)
- Añade capturas de pantalla si hay cambios visuales

> El project lead revisa y fusiona. No tienes que preocuparte por el merge en sí.

---

## Formato de mensajes de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/). Los hooks de git rechazarán commits que no sigan este formato.

```
feat(button): add loading state variant
fix(switch): forward aria-label prop correctly
docs(modal): add usage examples to Storybook
fix(a11y): improve input focus ring visibility
chore(tokens): update spacing token docs
```

Formato: `<type>(<scope opcional>): <descripción>` (`scope` es opcional)

Tipos comunes: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Usa `a11y`, `tokens` o `infra` como scopes, no como tipos personalizados.

---

## Uso de agentes IA (opcional)

Este proyecto soporta [opencode](https://opencode.ai/) con contexto preconfigurado. Si lo usas:

```bash
opencode
```

El agente carga automáticamente las reglas del proyecto desde `.atl/AGENTS.md` — no necesitas configuración manual. Lee [CONTRIBUTING.md](./CONTRIBUTING.md#trabajar-con-agentes-ia) para el flujo completo de trabajo con IA.

---

## ¿Necesitas ayuda?

- 💬 [GitHub Discussions](https://github.com/orgs/Stack-and-Flow/discussions) — para preguntas e ideas
- 🐛 [Abrir un issue](https://github.com/Stack-and-Flow/design-system/issues/new/choose) — para bugs o propuestas
- 📋 [Tablero del proyecto](https://github.com/orgs/Stack-and-Flow/projects/1) — para seguimiento de tareas
