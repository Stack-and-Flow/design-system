# Configuración del Entorno — Stack-and-Flow Design System

Este documento cubre todo lo que necesitas instalar y configurar antes de contribuir por primera vez. Sigue los pasos en orden.

---

## 1 — Visual Studio Code

### Instalación

Descarga e instala VS Code desde [code.visualstudio.com](https://code.visualstudio.com/).

### Extensiones recomendadas

El proyecto incluye una lista de extensiones recomendadas en `.vscode/extensions.json`. VS Code las detectará automáticamente al abrir el proyecto y te ofrecerá instalarlas.

Si prefires instalarlas manualmente:

| Extensión | ID | Para qué sirve |
|---|---|---|
| **Biome** | `biomejs.biome` | Linting y formateo — el formateador oficial del proyecto |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Autocompletado de clases Tailwind y tokens CSS |
| **TypeScript Nightly** | `ms-vscode.vscode-typescript-next` | Soporte TypeScript más actualizado |
| **Error Lens** | `usernamehw.errorlens` | Errores y warnings inline en el editor |
| **Version Lens** | `pflannery.vscode-versionlens` | Muestra versiones disponibles en `package.json` |

> **Importante:** Biome reemplaza a Prettier y ESLint en este proyecto. Si tienes Prettier instalado globalmente, asegúrate de que Biome tenga prioridad como formateador por defecto en este workspace.

### Font del editor (opcional)

La configuración del proyecto usa `RobotoMono Nerd Font`. Si no la tienes instalada, el editor usará la fuente monospace de fallback de tu sistema — no afecta al funcionamiento.

Puedes descargarla desde [nerdfonts.com](https://www.nerdfonts.com/font-downloads).

---

## 2 — Node.js y pnpm

### Node.js

El proyecto requiere **Node.js v22.14.0** exacto, gestionado con nvm.

**Instalar nvm:**

- macOS / Linux: [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- Windows: [github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

**Instalar y usar la versión correcta:**

```bash
nvm install 22.14.0
nvm use
```

El archivo `.nvmrc` en la raíz del proyecto contiene la versión requerida. `nvm use` sin argumentos la lee automáticamente.

**Verificar:**

```bash
node --version
# → v22.14.0
```

### pnpm

Este proyecto usa pnpm como gestor de paquetes. No uses npm ni yarn — el lockfile y los workspaces están configurados para pnpm.

```bash
npm install -g pnpm
```

**Verificar:**

```bash
pnpm --version
# → 10.x.x
```

---

## 3 — opencode + gentle-ai

opencode es el editor de IA que usamos para el flujo asistido de implementación de componentes. gentle-ai es la capa de configuración de agentes que vive dentro del proyecto.

### Instalar opencode

Descarga el instalador desde [opencode.ai](https://opencode.ai/) o instala via terminal:

```bash
npm install -g opencode-ai
```

📹 **Video de instalación y primeros pasos:** *(añade aquí el link cuando esté disponible)*

### Cómo funciona gentle-ai en este proyecto

No necesitas configuración manual. Al abrir el directorio del proyecto en opencode, el archivo `.atl/AGENTS.md` se inyecta automáticamente como contexto base para todos los agentes. Esto significa que el agente ya conoce:

- La arquitectura de 5 archivos y las reglas de cada uno
- Los tokens de diseño disponibles y cómo usarlos
- Las reglas de Storybook y la estructura de stories
- Los anti-patrones que provocan rechazo de PR

Cuando vayas a implementar un componente, simplemente di:

```
Implementa este componente: https://github.com/Stack-and-Flow/design-system/issues/XXX
```

El agente cargará la skill `component-contributor` y seguirá el flujo de 5 fases automáticamente.

---

## 4 — MCP Playwright

Los MCPs (Model Context Protocol servers) extienden las capacidades del agente. Playwright MCP permite al agente interactuar con el navegador — útil para revisar Storybook visualmente durante el desarrollo.

### Instalación

```bash
npm install -g @playwright/mcp
```

### Configuración en opencode

Añade la siguiente configuración en tu `~/.config/opencode/config.json` (o el equivalente en tu sistema):

```json
{
  "mcp": {
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Reinicia opencode después de añadir la configuración para que el MCP se registre.

**Verificar que está activo:** al iniciar una conversación en opencode, el agente tendrá acceso a herramientas de browser como `browser_navigate`, `browser_snapshot` y `browser_screenshot`.

> 📹 **Más información sobre MCPs en opencode:** *(añade aquí el link cuando esté disponible)*

---

## 5 — Instalación del proyecto

### Clonar el repositorio

```bash
git clone https://github.com/Stack-and-Flow/design-system.git
cd design-system
```

### Establecer la versión de Node

```bash
nvm use
```

### Instalar dependencias

```bash
pnpm install
```

Lefthook (git hooks) se instala automáticamente via el script `postinstall`. Configurará los hooks de pre-commit (Biome + TypeScript) sin que tengas que hacer nada más.

### Verificar que todo funciona

```bash
pnpm run storybook
```

Storybook debería abrirse en `http://localhost:6006`. Si ves los componentes existentes, el entorno está listo.

**Verificaciones adicionales:**

```bash
pnpm run test          # Vitest — debe pasar sin errores
pnpm exec biome check  # Biome — debe pasar sin warnings
```

---

## 6 — Configuración de Git

### Identidad

Si es la primera vez que usas Git en este equipo:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Convención de ramas

Antes de empezar cualquier tarea, crea tu rama desde `main`:

```bash
git checkout main
git pull
git checkout -b feat/nombre-componente
```

| Prefijo | Cuándo usarlo |
|---|---|
| `feat/` | Nuevo componente o funcionalidad |
| `fix/` | Corrección de bug |
| `docs/` | Documentación |
| `chore/` | Dependencias, tooling, config |
| `refactor/` | Mejora de código sin cambio de comportamiento |

### Conventional Commits

Los commits deben seguir el formato `tipo: descripción`:

```bash
git commit -m "feat: add Button component with primary and outlined variants"
git commit -m "fix: correct focus ring on Input in light mode"
git commit -m "docs: update CONTRIBUTING with visual review checklist"
```

Los hooks de pre-commit corren Biome y TypeScript automáticamente. Si el commit falla, corrige los errores reportados antes de reintentar.

---

## Listo para contribuir

Con el entorno configurado, el siguiente paso es el flujo del contributor:

👉 **[Flujo del Contributor — Stack-and-Flow Design System](https://www.notion.so/Flujo-del-Contributor-Stack-and-Flow-Design-System-3457b3df860880fd9663df8c086b1028?source=copy_link)**

---

## Solución de problemas frecuentes

**`pnpm install` falla con error de versión de Node**
Asegúrate de haber ejecutado `nvm use` en el directorio del proyecto. La versión activa debe ser `v22.14.0`.

**Biome no formatea al guardar**
Verifica que la extensión `biomejs.biome` esté activa y que Biome sea el formateador por defecto para el workspace. En VS Code: `Ctrl+Shift+P` → "Format Document With..." → selecciona Biome.

**Storybook no arranca**
Prueba limpiar la caché: `pnpm run storybook-clean-cache && pnpm run storybook`.

**Los hooks de pre-commit no se instalan**
Ejecuta `pnpm exec lefthook install` manualmente.

**opencode no carga el contexto del proyecto**
Asegúrate de abrir el directorio raíz del proyecto (`design-system/`), no una subcarpeta. El archivo `.atl/AGENTS.md` debe estar en la raíz del workspace abierto.
