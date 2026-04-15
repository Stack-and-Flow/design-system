# Gobernanza del Design System Stack-and-Flow

Este documento describe cómo se organiza el proyecto, quién puede hacer qué, y cómo se toman las decisiones.

> 🇬🇧 [English version](./GOVERNANCE.en.md)

---

## Roles

### Project Lead

El **Project Lead** es el responsable final del design system. Actualmente: [@egdev6](https://github.com/egdev6).

Responsabilidades:
- Definir la visión y la hoja de ruta del proyecto
- Aprobar y fusionar todos los Pull Requests
- Tomar decisiones de arquitectura y diseño
- Gestionar el tablero del proyecto y las etapas de cada issue
- Resolver conflictos o desacuerdos técnicos

### Maintainer

Los **Maintainers** son contributors con historial probado en el proyecto que reciben permisos adicionales.

Responsabilidades:
- Revisar Pull Requests y dejar feedback técnico detallado
- Etiquetar y priorizar issues
- Ayudar a nuevos contributors con preguntas y onboarding
- Participar en decisiones de diseño cuando el Project Lead lo solicite

Para convertirse en Maintainer: haber contribuido al menos **3 PRs fusionados** de calidad, y ser propuesto o aceptar la invitación del Project Lead.

### Contributor

Cualquier persona que abra un issue, reporte un bug, proponga una feature o envíe un Pull Request.

Responsabilidades:
- Seguir las guías de [CONTRIBUTING.md](./CONTRIBUTING.md) y [GUIDELINES.md](./GUIDELINES.md)
- Responder al feedback de revisión dentro de los 7 días
- Mantener el PR actualizado con `main` si hay conflictos

---

## Proceso de aprobación de Pull Requests

### Flujo estándar

```
1. Contributor abre PR → vincula el issue con "Closes #NNN"
2. CI ejecuta automáticamente: tests, build de Storybook, a11y
3. Project Lead o Maintainer revisa el código
4. Si hay feedback → Contributor aplica cambios
5. Project Lead aprueba y fusiona
```

### Criterios de aprobación

Un PR está listo para fusionar cuando:

- ✅ Todos los checks de CI pasan (tests, build, a11y)
- ✅ El código sigue la estructura de 5 archivos y el patrón Container/Presentational
- ✅ Los tipos son explícitos — sin `any`, sin `interface`
- ✅ El componente tiene tests con cobertura mínima requerida
- ✅ La story de Storybook está completa con controles y descripción
- ✅ No hay valores hardcodeados — solo tokens del sistema
- ✅ Los atributos ARIA están presentes y son correctos
- ✅ El PR template está completamente rellenado
- ✅ El commit sigue el formato de Conventional Commits

### Criterios de rechazo automático

Un PR será rechazado sin revisión detallada si:

- ❌ Falla cualquier check de CI
- ❌ No está vinculado a un issue existente
- ❌ Mezcla lógica Container y Presentacional en el mismo archivo
- ❌ Usa `any` o `interface` en TypeScript
- ❌ Usa valores arbitrarios de Tailwind (`p-[14px]`, `text-[#000]`)
- ❌ Omite tests o la story de Storybook

---

## Toma de decisiones

### Decisiones menores

Cambios en componentes existentes, correcciones de bugs, mejoras de documentación y ajustes de tokens: el **Project Lead** decide unilateralmente tras la revisión.

### Decisiones de arquitectura

Cambios que afectan patrones globales (nueva capa atómica, cambio de herramientas, nuevas convenciones de naming): se discuten en un issue etiquetado como `discussion` antes de implementar. El **Project Lead** tiene la decisión final.

### Cambios de hoja de ruta

Añadir o eliminar fases del proyecto, cambios de alcance significativos: el **Project Lead** los anuncia en GitHub Discussions antes de implementarlos.

---

## Comunicación

| Canal | Para qué |
|-------|---------|
| [GitHub Issues](https://github.com/Stack-and-Flow/design-system/issues) | Bugs, propuestas de componentes, mejoras concretas |
| [GitHub Discussions](https://github.com/orgs/Stack-and-Flow/discussions) | Preguntas, ideas abiertas, feedback general |
| [Pull Requests](https://github.com/Stack-and-Flow/design-system/pulls) | Revisión de código y feedback técnico |
| [Project Board](https://github.com/orgs/Stack-and-Flow/projects/1) | Seguimiento del estado de las tareas |

---

## Código de conducta

Este proyecto sigue un entorno de colaboración profesional y respetuoso. Se espera que todos los participantes:

- Comuniquen con respeto y sin lenguaje ofensivo
- Acepten el feedback técnico de forma constructiva
- Den crédito a las contribuciones de los demás
- Prioricen la calidad del código sobre la velocidad

Comportamientos que no se toleran: ataques personales, lenguaje discriminatorio, spam o cualquier forma de acoso. El Project Lead puede retirar el acceso a cualquier participante que no cumpla estas normas.

---

## Cambios a este documento

Este documento puede ser actualizado por el **Project Lead** en cualquier momento. Los cambios significativos se anuncian en GitHub Discussions con al menos 7 días de aviso.
