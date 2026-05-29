# GitHub Issue Body Template

Canonical Stack-and-Flow issue body. Keep headings ASCII-only because `gh` CLI output can corrupt emoji/multibyte section markers in Windows PowerShell.

```markdown
## Tarea: {ComponentName}

### Referencia:

{reference_url}

### Fases del desarrollo

- [ ] 1. **Research de funcionalidad**
  Investigar soluciones similares, patrones existentes y necesidades reales. Añadir capturas, enlaces o benchmarks si aplican.

- [ ] 2. **Definicion de funcionalidades**
  Especificar que debe hacer el componente: props, estados, interaccion, accesibilidad, variantes, etc.

- [ ] 3. **Implementacion del componente**
  Desarrollo del componente en base a la definicion anterior. Incluir historias de Storybook si procede.

- [ ] 4. **Documentacion del componente**
  - [ ] Storybook documentado con controles y ejemplos de uso
  - [ ] Documentacion escrita en JSDoc canonico de Storybook cuando aplique
  - [ ] Seccion de casos de uso o guidelines

- [ ] 5. **Code review y modificaciones**
  - [ ] Revision funcional
  - [ ] Revision visual (alineamiento con el design system)
  - [ ] Correccion de errores o ajustes sugeridos

- [ ] 6. **Merge en main**
  Una vez aprobado, mergear la rama a `main` siguiendo el flujo de PR establecido. (Esta parte me encargo yo)

---

### Notas adicionales

_Anotar cualquier comentario, decision tomada o consideraciones especiales. (Nombra a egdev6 para cualquier consulta)_

---

### Recursos relacionados

_Nombrar cualquier recurso externo_
```

## Rules

- Do not add emoji to section headings.
- Avoid accent marks in headings; body text may use accents.
- Replace `{ComponentName}` and `{reference_url}` before creating the issue.
- Write this body to a temp file and pass it with `--body-file`; do not pass multi-line markdown directly through `--body`.
