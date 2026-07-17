# Catalogación de componentes y handoff de recatalogación V1

Esta guía define cómo clasificar componentes durante el MVP y cómo entregar la recatalogación a V1. La respuesta corta: **los PRs MVP pueden mergearse en su ubicación actual si cumplen la barra de calidad; la recatalogación completa pertenece a V1**.

---

## Ruta rápida

1. Validá primero la barra MVP: TypeScript, tests o justificación, Storybook razonable, accesibilidad básica, tokens sin drift mayor y sin blocker funcional conocido.
2. Clasificá el componente con los contratos de `primitives`, `atoms`, `molecules` y `organisms` de esta guía.
3. Si la ubicación actual no coincide con la clasificación, documentalo como follow-up V1; no lo mezcles en el PR MVP salvo que sea necesario para cumplir la calidad MVP.
4. Creá child issues solo cuando la decisión de catalogación esté validada y tenga evidencia suficiente.
5. Después del MVP, seguí la secuencia V1: #223 → #224 → #225 → #226 → #227.

---

## Regla de merge MVP vs límite V1

| Tema | Decisión |
| --- | --- |
| Merge MVP | Un componente MVP puede mergearse donde está si cumple la barra de calidad actual. |
| Barra MVP | TypeScript pasa; hay tests o ausencia justificada; Storybook cubre estados/variantes razonables; accesibilidad básica está cubierta; uso de tokens sin drift mayor; no hay blocker funcional conocido. |
| Mismatch de catálogo | La diferencia entre ubicación actual y tier objetivo se documenta como follow-up V1. |
| Trabajo V1 | No se mezcla en PRs MVP salvo que el cambio sea necesario para alcanzar la barra MVP. |
| Handoff | Esta guía es el handoff final de criterios y contratos antes de #223; no hace falta una “issue 0”. |

> Si una recatalogación cambia imports, exports, stories o estructura sin desbloquear calidad MVP, es V1.

---

## Flujo operativo

### Durante el MVP

- Validá la barra de calidad MVP antes de recatalogar.
- Clasificá el componente con esta guía y dejá el mismatch como follow-up V1 cuando la ubicación actual no coincida.
- No muevas ni dividas componentes salvo que sea necesario para cumplir la calidad MVP.

### Handoff después del MVP / antes de #223

- Usá esta guía como fuente de criterios para la recatalogación V1.
- No crees una “issue 0”: #223 arranca directamente con estos contratos y checklist.

### Inventario de #223

Inspeccioná cada componente MVP y registrá:

- ruta/tier actual;
- tier V1 propuesto;
- decisión: `reuse existing`, `keep in parent`, `split/extract`, `needs child issue` o `defer to V1 inventory`;
- evidencia contra la barra MVP y el contrato de tier;
- impacto de migración: imports, exports, stories, docs y tests;
- si necesita child issue validada.

### Child issues

- Para specs propuestas, usá `skills/component-spec-cataloging-validator/SKILL.md` antes de aprobar `## Validated component spec`; antes de aprobación debe producir `## Draft cataloging decision` o `## Cataloging blockers/questions`.
- Creá o reutilizá child issues solo después de un `## Cataloging decision` final validado, ubicado inmediatamente después de `## Validated component spec` en el mismo comentario/actualización y sin blockers/questions sin resolver.
- Usalas para candidatos `primitive`, `atom`, `molecule` u `organism` que puedan revisarse de forma independiente.
- Las piezas extraídas de tier inferior suelen ser `primitive`, `atom` o `molecule`; un `organism` también puede tener child issue cuando la decisión validada lo marca como alcance independiente.
- Si `Child issue candidates` es `yes`, el bloque `### Child issue candidates` es el handoff que consume `component-child-issues`.
- Linkeá parent/child y actualizá el checklist de catalogación.
- `skills/component-child-issues/SKILL.md` puede ayudar a ejecutar esta parte sin saltar el gate.

### PRs de recatalogación

- Mantené cada PR revisable: preferí una pieza independiente o un set pequeño y estrechamente relacionado.
- Llevá docs, stories, tests y exports junto con la unidad que cambia.
- Usá #224/#225 para moves/splits, #226 para migración de superficies públicas y docs, y #227 para verificación final.

### Regla de bloqueo

Si la decisión no está validada o falta evidencia, no crees child issues. Registrá el hallazgo en #223 primero.

---

## Contratos por tier

| Tier | Contrato | Puede depender de | No debe hacer |
| --- | --- | --- | --- |
| `primitives` | Unidad nativa del design system a nivel HTML/ARIA: elemento base, slot, wrapper o comportamiento mínimo que preserva semántica nativa. | Tokens, utilidades compartidas, atributos HTML/ARIA y hooks mínimos de accesibilidad. | Componer conceptos de producto, imponer copy, coordinar varios controles o representar un patrón de negocio. |
| `atoms` | Un concepto UI semántico único. Puede usar hasta dos sub-`primitives` de apoyo cuando eso mantiene una API simple. | `primitives`, tokens, CVA/variantes simples, estado local acotado. | Orquestar varios conceptos pares, exponer layout complejo, contener flujos, coordinar listas o crear composición contextual. |
| `molecules` | Composición pequeña de varios conceptos UI que funcionan juntos como una unidad reusable. | `atoms`, `primitives`, hooks de interacción y layout local. | Representar una sección completa de página, poseer navegación de alto nivel o absorber lógica de dominio extensa. |
| `organisms` | Bloque compuesto grande: sección, región o patrón de interfaz con varias moléculas/átomos y responsabilidad estructural clara. | `molecules`, `atoms`, `primitives`, datos de ejemplo para stories. | Convertirse en página completa, mezclar reglas de aplicación no reutilizables o esconder componentes menores que deberían extraerse. |

### Definiciones operativas

- `Primitive` significa unidad nativa HTML/ARIA del design system.
- `Atom` significa un solo concepto UI semántico; como máximo puede apoyarse en dos sub-`primitives`.
- `split/extract` significa que la propuesta debe dividirse o extraerse conceptualmente antes de decidir implementación final.
- `needs child issue` significa que al menos una unidad extraída o reutilizada es revisable de forma independiente y debe trackearse por separado.
- Las agrupaciones candidatas son ejemplos, no destino automático. La recatalogación V1 debe diseccionar moléculas/organismos complejos en `primitives`, `atoms` y `molecules` más reutilizables cuando corresponda.

---

## Criterios de split y recatalogación

Usá esta tabla para decidir si se mantiene, se mueve o se divide.

| Señal | Decisión sugerida |
| --- | --- |
| Un solo concepto UI, API pequeña, estado local simple | Candidato a `atom`. |
| Wrapper nativo reutilizable sin concepto visual propio | Candidato a `primitive`. |
| Dos o más conceptos UI coordinados | Candidato a `molecule`. |
| Región completa con jerarquía, composición y responsabilidad estructural | Candidato a `organism`. |
| Variantes que cambian la semántica del componente, no solo su estilo | Evaluar split antes de clasificar. |
| Props que activan comportamientos mutuamente excluyentes | Evaluar componentes separados. |
| Storybook necesita muchas stories para explicar usos no relacionados | Probable split. |
| Tests cubren flujos independientes dentro del mismo componente | Probable split. |
| El componente actual solo existe para layout de una página | Mantener fuera del catálogo o tratar como `organism` específico si es reusable. |

---

## Descalificadores automáticos para `atom`

Un componente **no** debe clasificarse como `atom` si cumple cualquiera de estas condiciones:

- Coordina tres o más subpiezas semánticas.
- Expone slots o regiones múltiples con responsabilidades independientes.
- Contiene una lista, colección, menú, tabla, wizard, grupo de campos o navegación compuesta.
- Requiere estado compartido entre subcomponentes para funcionar.
- Tiene variantes que cambian el patrón de interacción completo.
- Necesita más de dos sub-`primitives` para sostener su contrato.
- Su documentación necesita explicar varios casos de uso no relacionados.
- Su API mezcla layout, contenido, interacción y presentación en un solo componente.

Si aparece un descalificador, clasificá como `molecule`/`organism` o dividí antes de decidir.

---

## Checklist de clasificación para reviewers

Copiá esta plantilla en la issue, PR o comentario de revisión solo para una decisión de catálogo final/aprobada. Antes de aprobación, usá `## Draft cataloging decision` o `## Cataloging blockers/questions`.

```md
## Cataloging decision

- Component:
- Proposed tier: primitive | atom | molecule | organism
- Current/proposed path:
- Decision: reuse existing | keep in parent | split/extract | needs child issue | defer to V1 inventory
- Existing pieces to reuse:
- Pieces to extract/create:
- Child issue candidates: yes | no
- Target issue: parent | #223 | #224 | #225 | #226 | #227
- Blockers/questions: none

### Child issue candidates

Si `Child issue candidates` es `yes`, esta sección es el handoff determinístico que consume después `component-child-issues`. Incluí una fila por candidato con blockers/questions resueltos como `none`; usá `none` en toda la fila solo cuando candidates es `no`. Cualquier blocker o pregunta pendiente pertenece a `## Cataloging blockers/questions` o al draft, no a la decisión final.

| Candidate name | Proposed tier | Source/parent component | Action | Reuse target or extraction reason | Scope summary | Target issue | Blockers/questions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {name or none} | primitive/atom/molecule/organism | {source component} | reuse existing/create new/skip/defer | {existing component or why this must be extracted} | {independently reviewable scope} | parent/#223/#224/#225/#226/#227 | none |

### Evidence

- Tier contract check:
- Existing catalog check:
- Reuse/extraction rationale:
```

---

## Child issues: solo desde decisiones validadas

No crees child issues por intuición ni por inventario superficial. Una child issue de recatalogación debe nacer de un `## Cataloging decision` validado, adyacente a `## Validated component spec` en el mismo comentario/actualización, que incluya:

- componente o grupo afectado;
- tier actual y tier objetivo;
- evidencia del contrato incumplido o del split necesario;
- impacto esperado en imports, exports, Storybook, docs o tests;
- issue V1 destino;
- por cada candidato: nombre, tier propuesto, source/parent component, acción, reuse target o razón de extracción, resumen de scope, target issue y blockers/questions.

Si falta esa evidencia, registrá la observación en #223 primero.

---

## Secuencia V1

| Orden | Issue | Resultado esperado |
| --- | --- | --- |
| 1 | [#223](https://github.com/Stack-and-Flow/design-system/issues/223) | Inventario completo y taxonomía objetivo validada. |
| 2 | [#224](https://github.com/Stack-and-Flow/design-system/issues/224) | Recatalogación de `primitives` y `atoms`. |
| 3 | [#225](https://github.com/Stack-and-Flow/design-system/issues/225) | Recatalogación de `molecules` y `organisms`. |
| 4 | [#226](https://github.com/Stack-and-Flow/design-system/issues/226) | Migración de exports, Storybook y documentación. |
| 5 | [#227](https://github.com/Stack-and-Flow/design-system/issues/227) | Verificación final de catálogo, imports, docs y cobertura. |

Mantené la secuencia: primero se valida el mapa, después se mueve/divide, después se migran superficies públicas y finalmente se verifica.
